/**
 * UserDataAdaptor
 * ===================
 * UserData implementation for Lawnchair for older IE browsers.
 *
 */
var UserDataAdaptor = function(options) {
    for (var i in LawnchairAdaptorHelpers) {
        this[i] = LawnchairAdaptorHelpers[i];
    }
    this.init(options);
};

UserDataAdaptor.prototype = {
	init:function(){
		var s = document.createElement('span');
		s.style.behavior = 'url(\'#default#userData\')';
		s.style.position = 'absolute';
		s.style.left = 10000;
		document.body.appendChild(s);
		this.storage = s;
		this.storage.load('lawnchair');
	},
	get:function(key, callback){
		
		var obj = this.deserialize(this.storage.getAttribute(key));
	        if (obj) {
	            obj.key = key;
	            
	        }
			if (callback)
	                callback(obj);
	},
	save:function(obj, callback){
		var id = obj.key || 'lc' + this.uuid();
	        delete obj.key;		
		this.storage.setAttribute(id, this.serialize(obj));
		this.storage.save('lawnchair');		
		if (callback){
			obj.key = id;
			callback(obj);
			}
	},
	all:function(callback){
		var cb = this.terseToVerboseCallback(callback);
		var ca = this.storage.XMLDocument.firstChild.attributes;
		var yar = [];
		var v,o;
		// yo ho yo ho a pirates life for me
		for (var i = 0, l = ca.length; i < l; i++) {
			v = ca[i];
			o = this.deserialize(v.nodeValue);
			if (o) {
				o.key = v.nodeName;
				yar.push(o);
			}
		}
		if (cb)
			cb(yar);
	},
	remove:function(keyOrObj,callback) {
		var key = (typeof keyOrObj == 'string') ?  keyOrObj : keyOrObj.key;		
		this.storage.removeAttribute(key);
		this.storage.save('lawnchair');
		if(callback)
		  callback();
	}, 
	nuke:function(callback) {
		var that = this;		  
		this.all(function(r){
			for (var i = 0, l = r.length; i < l; i++) {
				if (r[i].key)
					that.remove(r[i].key);
			}
			if(callback) 
				callback();
		});
	}
};
