/**
 * BlackBerryPersistentStorageAdaptor
 * ===================
 * Implementation that uses the BlackBerry Persistent Storage mechanism. This is only available in PhoneGap BlackBerry projects
 * See http://www.github.com/phonegap/phonegap-blackberry
 *
 */
var BlackBerryPersistentStorageAdaptor = function(options) {
	for (var i in LawnchairAdaptorHelpers) {
		this[i] = LawnchairAdaptorHelpers[i];
	}
	this.init(options);
};

BlackBerryPersistentStorageAdaptor.prototype = {
	init:function() {
		// Check for the existence of the phonegap blackberry persistent store API
		if (!navigator.store)
			throw('Lawnchair, "This browser does not support BlackBerry Persistent Storage; it is a PhoneGap-only implementation."');
	},
	get:function(key, callback) {
		var that = this;
		navigator.store.get(function(value) { // success cb
			if (callback) {
				// Check if BBPS returned a serialized JSON obj, if so eval it.
				if (that.isObjectAsString(value)) {
					eval('value = ' + value.substr(0,value.length-1) + ',key:\'' + key + '\'};');
				}
				that.terseToVerboseCallback(callback)(value);
			}
		}, function() {}, // empty error cb
		key);
	},
	save:function(obj, callback) {
		var id = obj.key || this.uuid();
		delete obj.key;
		var that = this;
		navigator.store.put(function(){
			if (callback) {
				var cbObj = obj;
				cbObj['key'] = id;
				that.terseToVerboseCallback(callback)(cbObj);
			}
		}, function(){}, id, this.serialize(obj));
	},
	all:function(callback) {
		var that = this;
		navigator.store.getAll(function(json) { // success cb
			if (callback) {
				// BlackBerry store returns straight strings, so eval as necessary for values we deem as objects.
				var arr = [];
				for (var prop in json) {
					if (that.isObjectAsString(json[prop])) {
						eval('arr.push(' + json[prop].substr(0,json[prop].length-1) + ',key:\'' + prop + '\'});');
					} else {
						eval('arr.push({\'' + prop + '\':\'' + json[prop] + '\'});');
					}
				}
				that.terseToVerboseCallback(callback)(arr);
			}
		}, function() {}); // empty error cb
	},
	remove:function(keyOrObj, callback) {
		var key = (typeof keyOrObj == 'string') ? keyOrObj : keyOrObj.key;
		var that = this;
		navigator.store.remove(function() {
			if (callback)
		    	that.terseToVerboseCallback(callback)();
		}, function() {}, key);
	},
	nuke:function(callback) {
		var that = this;
		navigator.store.nuke(function(){
			if (callback)
		    	that.terseToVerboseCallback(callback)();
		},function(){});
	},
	// Private helper.
	isObjectAsString:function(value) {
		return (value != null && value[0] == '{' && value[value.length-1] == '}');
	}
};