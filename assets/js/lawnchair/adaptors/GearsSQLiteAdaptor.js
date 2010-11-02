// init.js directly included to save on include traffic
//
// Copyright 2007, Google Inc.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//	1. Redistributions of source code must retain the above copyright notice,
//		 this list of conditions and the following disclaimer.
//	2. Redistributions in binary form must reproduce the above copyright notice,
//		 this list of conditions and the following disclaimer in the documentation
//		 and/or other materials provided with the distribution.
//	3. Neither the name of Google Inc. nor the names of its contributors may be
//		 used to endorse or promote products derived from this software without
//		 specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Sets up google.gears.*, which is *the only* supported way to access Gears.
//
// Circumvent this file at your own risk!
//
// In the future, Gears may automatically define google.gears.* without this
// file. Gears may use these objects to transparently fix bugs and compatibility
// issues. Applications that use the code below will continue to work seamlessly
// when that happens.

(function() {
	// We are already defined. Hooray!
	if (window.google && google.gears) {
		return;
	}

	var factory = null;

	// Firefox
	if (typeof GearsFactory != 'undefined') {
		factory = new GearsFactory();
	} else {
		// IE
		try {
			factory = new ActiveXObject('Gears.Factory');
			// privateSetGlobalObject is only required and supported on IE Mobile on
			// WinCE.
			if (factory.getBuildInfo().indexOf('ie_mobile') != -1) {
				factory.privateSetGlobalObject(this);
			}
		} catch (e) {
			// Safari
			if ((typeof navigator.mimeTypes != 'undefined')
					 && navigator.mimeTypes["application/x-googlegears"]) {
				factory = document.createElement("object");
				factory.style.display = "none";
				factory.width = 0;
				factory.height = 0;
				factory.type = "application/x-googlegears";
				document.documentElement.appendChild(factory);
			}
		}
	}

	// *Do not* define any objects if Gears is not installed. This mimics the
	// behavior of Gears defining the objects in the future.
	if (!factory) {
		return;
	}

	// Now set up the objects, being careful not to overwrite anything.
	//
	// Note: In Internet Explorer for Windows Mobile, you can't add properties to
	// the window object. However, global objects are automatically added as
	// properties of the window object in all browsers.
	if (!window.google) {
		google = {};
	}

	if (!google.gears) {
		google.gears = {factory: factory};
	}
})();

/**
 * GearsSQLiteAdaptor
 * ===================
 * Gears flavored SQLite implementation for Lawnchair.
 *
 */
var GearsSQLiteAdaptor = function(options) {
	for (var i in LawnchairAdaptorHelpers) {
		this[i] = LawnchairAdaptorHelpers[i];
	}
	this.init(options);
};


GearsSQLiteAdaptor.prototype = {
	init:function(options) {
	
		var that = this;
		var merge = that.merge;
		var opts = (typeof arguments[0] == 'string') ? {table:options} : options;
	
		this.name = merge('Lawnchair', opts.name);
		this.table = merge('field', opts.table);
	
		this.db = google.gears.factory.create('beta.database');
		this.db.open(this.name);
		this.db.execute('create table if not exists ' + this.table + ' (id NVARCHAR(32) UNIQUE PRIMARY KEY, value TEXT, timestamp REAL)');
	},
	save:function(obj, callback) {
		var that = this;

		var insert = function(obj, callback) {
			var id = (obj.key == undefined) ? that.uuid() : obj.key;
			delete(obj.key);
	
			var rs = that.db.execute(
				"INSERT INTO " + that.table + " (id, value, timestamp) VALUES (?,?,?)",
				[id, that.serialize(obj), that.now()]
			);
			if (callback != undefined) {
				obj.key = id;
				callback(obj);
			}
		};
	
		var update = function(id, obj, callback) {
			that.db.execute(
				"UPDATE " + that.table + " SET value=?, timestamp=? WHERE id=?",
				[that.serialize(obj), that.now(), id]
			);
			if (callback != undefined) {
				obj.key = id;
				callback(obj);
			}
		};
	
		if (obj.key == undefined) {
			insert(obj, callback);
		} else {
			this.get(obj.key, function(r) {
				var isUpdate = (r != null);
	
				if (isUpdate) {
					var id = obj.key;
					delete(obj.key);
					update(id, obj, callback);
				} else {
					insert(obj, callback);
				}
			});
		}
	
	},
	get:function(key, callback) {
		var rs = this.db.execute("SELECT * FROM " + this.table + " WHERE id = ?", [key]);
	
		if (rs.isValidRow()) {
			// FIXME need to test null return / empty recordset
			var o = this.deserialize(rs.field(1));
			o.key = key;
			callback(o);
		} else {
			callback(null);
		}
		rs.close();
	},
	all:function(callback) {
		var cb	= this.terseToVerboseCallback(callback);
		var rs	= this.db.execute("SELECT * FROM " + this.table);
		var r		= [];
		var o;
	
		// FIXME need to add 0 len support
		//if (results.rows.length == 0 ) {
		//	cb([]);
	
		while (rs.isValidRow()) {
			o = this.deserialize(rs.field(1));
			o.key = rs.field(0);
				r.push(o);
				rs.next();
		}
		rs.close();
		cb(r);
	},
	remove:function(keyOrObj, callback) {
		this.db.execute(
			"DELETE FROM " + this.table + " WHERE id = ?",
			[(typeof keyOrObj == 'string') ? keyOrObj : keyOrObj.key]
		);
		if(callback)
		  callback();
	},
	nuke:function(callback) {
		this.db.execute("DELETE FROM " + this.table);
		if(callback)
		  callback();
		return this;
	}
};
