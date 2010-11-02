/**
 * Lawnchair
 * =========
 * A lightweight JSON document store.
 *
 */
var Lawnchair = function(opts) {
	this.init(opts);
}

Lawnchair.prototype = {
	
	init:function(opts) {
		var adaptors = {
			'webkit':window.WebkitSQLiteAdaptor,
			'gears':window.GearsSQLiteAdaptor,
			'dom':window.DOMStorageAdaptor,
			'cookie':window.CookieAdaptor,
			'air':window.AIRSQLiteAdaptor,
			'userdata':window.UserDataAdaptor,
			'air-async':window.AIRSQLiteAsyncAdaptor,
			'blackberry':window.BlackBerryPersistentStorageAdaptor
		};
		this.adaptor = opts.adaptor ? new adaptors[opts.adaptor](opts) : new WebkitSQLiteAdaptor(opts);
        // Check for native JSON functions.
        if (!JSON || !JSON.stringify) throw "Native JSON functions unavailable - please include http://www.json.org/json2.js or run on a decent browser :P";
	},
	
	// Save an object to the store. If a key is present then update. Otherwise create a new record.
	save:function(obj, callback) {this.adaptor.save(obj, callback)},
	
	// Invokes a callback on an object with the matching key.
	get:function(key, callback) {this.adaptor.get(key, callback)},

	// Returns whether a key exists to a callback.
	exists:function(callback) {this.adaptor.exists(callback)},
	
	// Returns all rows to a callback.
	all:function(callback) {this.adaptor.all(callback)},
	
	// Removes a json object from the store.
	remove:function(keyOrObj, callback) {this.adaptor.remove(keyOrObj, callback)},
	
	// Removes all documents from a store and returns self.
	nuke:function(callback) {this.adaptor.nuke(callback);return this},
	
	/**
	 * Iterator that accepts two paramters (methods or eval strings):
	 *
	 * - conditional test for a record
	 * - callback to invoke on matches
	 *
	 */
	find:function(condition, callback) {
		var is = (typeof condition == 'string') ? function(r){return eval(condition)} : condition;
		var cb = this.adaptor.terseToVerboseCallback(callback);
	
		this.each(function(record, index) {
			if (is(record)) cb(record, index); // thats hot
		});
	},


	/**
	 * Classic iterator.
	 * - Passes the record and the index as the second parameter to the callback.
	 * - Accepts a string for eval or a method to be invoked for each document in the collection.
	 */
	each:function(callback) {
		var cb = this.adaptor.terseToVerboseCallback(callback);
		this.all(function(results) {
			var l = results.length;
			for (var i = 0; i < l; i++) {
				cb(results[i], i);
			}
		});
	}
// --
};
