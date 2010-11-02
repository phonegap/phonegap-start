/**
 * DOMStorageAdaptor
 * ===================
 * DOM Storage implementation for Lawnchair.
 *
 * - originally authored by Joseph Pecoraro
 * - window.name code courtesy Remy Sharp: http://24ways.org/2009/breaking-out-the-edges-of-the-browser
 *
 */
var DOMStorageAdaptor = function(options) {
	for (var i in LawnchairAdaptorHelpers) {
		this[i] = LawnchairAdaptorHelpers[i];
	}
	this.init(options);
};


DOMStorageAdaptor.prototype = {
	init:function(options) {
		var self = this;
		this.storage = this.merge(window.localStorage, options.storage);
		this.table = this.merge('field', options.table);
		
		if (!window.Storage) {
			this.storage = (function () {
				// window.top.name ensures top level, and supports around 2Mb
				var data = window.top.name ? self.deserialize(window.top.name) : {};
				return {
					setItem: function (key, value) {
						data[key] = value+""; // force to string
						window.top.name = self.serialize(data);
					},
					removeItem: function (key) {
						delete data[key];
						window.top.name = self.serialize(data);
					},
					getItem: function (key) {
						return data[key] || null;
					},
					clear: function () {
						data = {};
						window.top.name = '';
					}
				};
			})();
		};
	},

	save:function(obj, callback) {
		var id = this.table + '::' + (obj.key || this.uuid());
		delete obj.key;
		this.storage.setItem(id, this.serialize(obj));
		if (callback) {
		    obj.key = id.split('::')[1];
		    callback(obj);
		}
	},

    get:function(key, callback) {
        var obj = this.deserialize(this.storage.getItem(this.table + '::' + key));
        var cb = this.terseToVerboseCallback(callback);
        
        if (obj) {
            obj.key = key;
            if (callback) cb(obj);
        } else {
			if (callback) cb(null);
		}
    },

	all:function(callback) {
		var cb = this.terseToVerboseCallback(callback);
		var results = [];
		for (var i = 0, l = this.storage.length; i < l; ++i) {
			var id = this.storage.key(i);
			var tbl = id.split('::')[0]
			var key = id.split('::').slice(1).join("::");
			if (tbl == this.table) {
				var obj = this.deserialize(this.storage.getItem(id));
				obj.key = key;
				results.push(obj);
			}
		}
		if (cb)
			cb(results);
	},

	remove:function(keyOrObj, callback) {
		var key = this.table + '::' + (typeof keyOrObj === 'string' ? keyOrObj : keyOrObj.key);
		this.storage.removeItem(key);
		if(callback)
		  callback();
	},

	nuke:function(callback) {
		var self = this;
		this.all(function(r) {
			for (var i = 0, l = r.length; i < l; i++) {
				self.remove(r[i]);
			}
			if(callback)
			  callback();
		});
	}
};
