// inline the AIR aliases file, edited to include only what we need

/* AIRAliases.js - Revision: 2.0beta */

/*
ADOBE SYSTEMS INCORPORATED
Copyright 2007-2008 Adobe Systems Incorporated. All Rights Reserved.
 
NOTICE:		Adobe permits you to modify and distribute this file only in accordance with
the terms of Adobe AIR SDK license agreement.  You may have received this file from a
source other than Adobe.	Nonetheless, you may modify or
distribute this file only in accordance with such agreement.

http://www.adobe.com/products/air/tools/sdk/eula/
*/

var air;
if (window.runtime)
{
		if (!air) air = {};
		// functions
		air.trace = window.runtime.trace;

		// file
		air.File = window.runtime.flash.filesystem.File;
		air.FileStream = window.runtime.flash.filesystem.FileStream;
		air.FileMode = window.runtime.flash.filesystem.FileMode;

		// data
		air.EncryptedLocalStore = window.runtime.flash.data.EncryptedLocalStore;
		air.SQLCollationType = window.runtime.flash.data.SQLCollationType;
		air.SQLColumnNameStyle = window.runtime.flash.data.SQLColumnNameStyle;
		air.SQLColumnSchema = window.runtime.flash.data.SQLColumnSchema;
		air.SQLConnection = window.runtime.flash.data.SQLConnection;
		air.SQLError = window.runtime.flash.errors.SQLError;
		air.SQLErrorEvent = window.runtime.flash.events.SQLErrorEvent;
		air.SQLErrorOperation = window.runtime.flash.errors.SQLErrorOperation;
		air.SQLEvent = window.runtime.flash.events.SQLEvent;
		air.SQLIndexSchema = window.runtime.flash.data.SQLIndexSchema;
		air.SQLMode = window.runtime.flash.data.SQLMode;
		air.SQLResult = window.runtime.flash.data.SQLResult;
		air.SQLSchema = window.runtime.flash.data.SQLSchema;
		air.SQLSchemaResult = window.runtime.flash.data.SQLSchemaResult;
		air.SQLStatement = window.runtime.flash.data.SQLStatement;
		air.SQLTableSchema = window.runtime.flash.data.SQLTableSchema;
		air.SQLTransactionLockType = window.runtime.flash.data.SQLTransactionLockType;
		air.SQLTriggerSchema = window.runtime.flash.data.SQLTriggerSchema;
		air.SQLUpdateEvent = window.runtime.flash.events.SQLUpdateEvent;
		air.SQLViewSchema = window.runtime.flash.data.SQLViewSchema;

}



 
/**
 * AIRSQLiteAsyncAdaptor
 * ===================
 * AIR flavored SQLite implementation for Lawnchair.
 *
 * This uses asynchronous connections to the DB.
 */
var AIRSQLiteAsyncAdaptor = function(options) {
	for (var i in LawnchairAdaptorHelpers) {
		this[i] = LawnchairAdaptorHelpers[i];
	}
	this.init(options);
};


AIRSQLiteAsyncAdaptor.prototype = {
	init:function(options) {
	
		var that = this;
		var merge = that.merge;
		var opts = (typeof arguments[0] == 'string') ? {table:options} : options;
	
		this.name = merge('Lawnchair', opts.name);
		this.table = merge('field', opts.table);
	
		this.conn = new air.SQLConnection();
		var appstoredir = air.File.applicationStorageDirectory;
		this.dbFile = appstoredir.resolvePath(this.name + ".sqlite.db");
	
		try {
			this.conn.openAsync(this.dbFile);
		} catch(err) {
			air.trace('Error msg:'+err.message);
			air.trace('Error details:'+err.details);
		}

		this._execSql('create table if not exists ' + this.table + ' (id NVARCHAR(32) UNIQUE PRIMARY KEY, value TEXT, timestamp REAL)');
	},
	
	/*
	
	*/
	save:function(obj, callback) {
		var that = this;

		var insert = function(obj, callback) {
			var id;

			if (obj.key == undefined) {
				id = that.uuid();
			} else {
				id = obj.key;
			}
	
			delete(obj.key);
	
			that._execSql("INSERT INTO " + that.table + " (id, value, timestamp) VALUES (:id,:value,:timestamp)",
				{
					':id':id,
					':value':that.serialize(obj),
					':timestamp':that.now()
				},
				function(rs) {
					if (callback != undefined) {
						obj.key = id;
						callback(obj);
					}
				}
			);
		};
	
		var update = function(id, obj, callback) {
			that._execSql("UPDATE " + that.table + " SET value=:value, timestamp=:timestamp WHERE id=:id",
				{
					':id':id,
					':value':that.serialize(obj),
					':timestamp':that.now()
				},
				function(rs) {
					if (callback != undefined) {
						obj.key = id;
						callback(obj);
					}					
				}
			);
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
	
	/*
	
	*/
	get:function(key, callback) {
		var that = this;
		this._execSql("SELECT * FROM " + this.table + " WHERE id = :id",
			{
				':id':key
			},
			function(rs) {
				if (rs.data && rs.data.length> 0) {
					var o = that.deserialize(rs.data[0].value);
					o.key = key;
					callback(o);
				} else {
					callback(null);
				}
			}
		);
	},

	all:function(callback) {
		var that = this;
		
		if (typeof callback === 'string') {
			throw new Error("Callback was a string; strings are not supported for callback shorthand under AIR");
		}

		var cb	= this.terseToVerboseCallback(callback);
		this._execSql("SELECT * FROM " + this.table, null, function(rs) {
			var r		 = [];
			var o;
			if (rs.data && rs.data.length > 0) {
				var k = 0;
				var numrows = rs.data.length;

				while (k < numrows) {
					var thisdata = rs.data[k];
					o = that.deserialize(thisdata.value);
					o.key = thisdata.id;
						r.push(o);
					k++;
				}
			} else {
				r = [];
			}

			cb(r);
		});

	},
	
	/*
	
	*/
	remove:function(keyOrObj) {
	
		var key = (typeof keyOrObj == 'string') ? keyOrObj : keyOrObj.key;
		this._execSql("DELETE FROM " + this.table + " WHERE id = :id",
			{
				':id':key
			}
		);
	},
	
	/*

	*/
	nuke:function() {
		this._execSql("DELETE FROM " + this.table);
	},
	
	/*
		this is a wrapper for the overly complex AIR SQL API method of executing
		SQL statements
	*/
	_execSql:function(sql, params, onSuccess, onError) {
	
		var stmt = new air.SQLStatement();
		stmt.sqlConnection = this.conn;
		stmt.text = sql;
		if (params) {
			for (var key in params) {
				stmt.parameters[key] = params[key];
			}
		}
		
		
		function resultHandler(event) {
			var rs = stmt.getResult();
			if (onSuccess) {
				onSuccess(rs);
			}
		}
		
		function errorHandler(event) {
			air.trace('Error:' + event.error.message);
			air.trace('Error details:' + event.error.details);
			if (onError) {
				onError(event.error);
			}
		}
		
		stmt.addEventListener(air.SQLEvent.RESULT, resultHandler); 
		stmt.addEventListener(air.SQLErrorEvent.ERROR, errorHandler);
		
		try {
			stmt.execute();
		} catch(err) {
			air.trace('Error:' + err.message);
			air.trace('Error details:' + err.details);
			if (onError) {
				onError(err);
			}
		}
	}
};
