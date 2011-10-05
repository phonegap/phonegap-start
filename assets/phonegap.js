if (typeof(DeviceInfo) != 'object')
    DeviceInfo = {};

/**
 * 
 */
window.addEventListener('load', function() {
	var e = document.createEvent('Events');
	e.initEvent('deviceready');
	document.dispatchEvent(e);
}, false);

/**
 * This represents the PhoneGap API itself, and provides a global namespace for accessing
 * information about the state of PhoneGap.
 * @class
 */
PhoneGap = {
    queue: {
        ready: true,
        commands: [],
        timer: null
    },
    _constructors: []
};

/**
 * Boolean flag indicating if the PhoneGap API is available and initialized.
 */
PhoneGap.available = DeviceInfo.uuid != undefined;

/**
 * Execute a PhoneGap command in a queued fashion, to ensure commands do not
 * execute with any race conditions, and only run when PhoneGap is ready to
 * recieve them.
 * @param {String} command Command to be run in PhoneGap, e.g. "ClassName.method"
 * @param {String[]} [args] Zero or more arguments to pass to the method
 */
PhoneGap.exec = function() {
    PhoneGap.queue.commands.push(arguments);
    if (PhoneGap.queue.timer == null)
        PhoneGap.queue.timer = setInterval(PhoneGap.run_command, 10);
};
/**
 * Internal function used to dispatch the request to PhoneGap.  This needs to be implemented per-platform to
 * ensure that methods are called on the phone in a way appropriate for that device.
 * @private
 */
PhoneGap.run_command = function() {
};

/**
 * This class contains acceleration information
 * @constructor
 * @param {Number} x The force applied by the device in the x-axis.
 * @param {Number} y The force applied by the device in the y-axis.
 * @param {Number} z The force applied by the device in the z-axis.
 */
function Acceleration(x, y, z) {
	/**
	 * The force applied by the device in the x-axis.
	 */
	this.x = x;
	/**
	 * The force applied by the device in the y-axis.
	 */
	this.y = y;
	/**
	 * The force applied by the device in the z-axis.
	 */
	this.z = z;
	/**
	 * The time that the acceleration was obtained.
	 */
	this.timestamp = new Date().getTime();
}

/**
 * This class specifies the options for requesting acceleration data.
 * @constructor
 */
function AccelerationOptions() {
	/**
	 * The timeout after which if acceleration data cannot be obtained the errorCallback
	 * is called.
	 */
	this.timeout = 10000;
}
/**
 * This class provides access to device accelerometer data.
 * @constructor
 */
function Accelerometer() {
	/**
	 * The last known acceleration.
	 */
	this.lastAcceleration = null;
}

/**
 * Asynchronously aquires the current acceleration.
 * @param {Function} successCallback The function to call when the acceleration
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the acceleration data.
 * @param {AccelerationOptions} options The options for getting the accelerometer data
 * such as timeout.
 */

Accelerometer.prototype.getCurrentAcceleration = function(successCallback, errorCallback, options) {
	// If the acceleration is available then call success
	// If the acceleration is not available then call error
	
	try {
		if (!this.serviceObj) 
			this.serviceObj = this.getServiceObj();
		
		if (this.serviceObj == null) 
			throw {
				name: "DeviceErr",
				message: "Could not initialize service object"
			};
		
		//get the sensor channel
		var SensorParams = {
			SearchCriterion: "AccelerometerAxis"
		};
		var returnvalue = this.serviceObj.ISensor.FindSensorChannel(SensorParams);
		var error = returnvalue["ErrorCode"];
		var errmsg = returnvalue["ErrorMessage"];
		if (!(error == 0 || error == 1012)) {
			var ex = {
				name: "Unable to find Sensor Channel: " + error,
				message: errmsg
			};
			throw ex;
		}
		var channelInfoMap = returnvalue["ReturnValue"][0];
		var criteria = {
			ChannelInfoMap: channelInfoMap,
			ListeningType: "ChannelData"
		};
		
		if (typeof(successCallback) != 'function') 
			successCallback = function(){
			};
		if (typeof(errorCallback) != 'function') 
			errorCallback = function(){
			};
		
		this.success_callback = successCallback;
		this.error_callback = errorCallback;
		//create a closure to persist this instance of Accelerometer into the RegisterForNofication callback
		var obj = this;
		
		// TODO: this call crashes WRT, but there is no other way to read the accel sensor
		// http://discussion.forum.nokia.com/forum/showthread.php?t=182151&highlight=memory+leak
		this.serviceObj.ISensor.RegisterForNotification(criteria, function(transId, eventCode, result){
			try {
				var criteria = {
					TransactionID: transId
				};
				obj.serviceObj.ISensor.Cancel(criteria);
				
				var accel = new Acceleration(result.ReturnValue.XAxisData, result.ReturnValue.YAxisData, result.ReturnValue.ZAxisData);
				Accelerometer.lastAcceleration = accel;
				
				obj.success_callback(accel);
				
			} 
			catch (ex) {
				obj.serviceObj.ISensor.Cancel(criteria);
				obj.error_callback(ex);
			}
			
		});
	} catch (ex) {
		errorCallback(ex);
	}

};


/**
 * Asynchronously aquires the acceleration repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the acceleration
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the acceleration data.
 * @param {AccelerationOptions} options The options for getting the accelerometer data
 * such as timeout.
 */

Accelerometer.prototype.watchAcceleration = function(successCallback, errorCallback, options) {
	this.getCurrentAcceleration(successCallback, errorCallback, options);
	// TODO: add the interval id to a list so we can clear all watches
 	var frequency = (options != undefined)? options.frequency : 10000;
	return setInterval(function() {
		navigator.accelerometer.getCurrentAcceleration(successCallback, errorCallback, options);
	}, frequency);
};

/**
 * Clears the specified accelerometer watch.
 * @param {String} watchId The ID of the watch returned from #watchAcceleration.
 */
Accelerometer.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};

//gets the Acceleration Service Object from WRT
Accelerometer.prototype.getServiceObj = function() {
	var so;
	
    try {
        so = device.getServiceObject("Service.Sensor", "ISensor");
    } catch (ex) {
		throw {
			name: "DeviceError",
			message: "Could not initialize accel service object (" + ex.name + ": " + ex.message + ")"
		};
    }		
	return so;
};

if (typeof navigator.accelerometer == "undefined") navigator.accelerometer = new Accelerometer();/**
 * This class provides access to the device media, interfaces to both sound and video
 * @constructor
 */
function Audio(src, successCallback, errorCallback) {
	this.src = src;
	this.successCallback = successCallback;
	this.errorCallback = errorCallback;												
}

Audio.prototype.record = function() {
};

Audio.prototype.play = function() {
try {
	if (document.getElementById('gapsound'))
		document.body.removeChild(document.getElementById('gapsound'));
	var obj;
	obj = document.createElement("embed");
	obj.setAttribute("id", "gapsound");
	obj.setAttribute("type", "audio/x-mpeg");
	obj.setAttribute("width", "0");
	obj.setAttribute("width", "0");
	obj.setAttribute("hidden", "true");
	obj.setAttribute("autostart", "true");
	obj.setAttribute("src", this.src);
	document.body.appendChild(obj);
} catch (ex) { debug.log(ex.name + ": " + ex.message); }
};

Audio.prototype.pause = function() {
};

Audio.prototype.stop = function() {
	document.body.removeChild(document.getElementById('gapsound'));
};
/**
 * This class provides access to the device camera.
 * @constructor
 */
function Camera() {
	this.success_callback = null;
	this.error_callback = null;
}

/**
 * We use the Platform Services 2.0 API here. So we must include a portion of the
 * PS 2.0 source code (camera API). 
 * @param {Function} successCallback
 * @param {Function} errorCallback
 * @param {Object} options
 */
Camera.prototype.getPicture = function(successCallback, errorCallback, options){
	try {
		if (!this.serviceObj) {
			this.serviceObj = com.nokia.device.load("", "com.nokia.device.camera", "");
		}
		if (!this.serviceObj) {
			throw {
				name: "CameraError",
				message: "could not load camera service"
			};
		}
		var obj = this;
		
		obj.success_callback = successCallback;
		obj.error_callback = errorCallback;
		this.serviceObj.startCamera( function(transactionID, errorCode, outPut) { 
			//outPut should be an array of image urls (local), or an error code
			if (errorCode == 0) {
				obj.success_callback(outPut);
			}
			else {
				obj.error_callback({
					name: "CameraError",
					message: errorCode
				});
			}
		});
		
	} catch (ex) {
		errorCallback.call(ex);
	}
	
};

if (typeof navigator.camera == "undefined") navigator.camera = new Camera();/*
Copyright © 2009 Nokia. All rights reserved.
Code licensed under the BSD License:
Software License Agreement (BSD License) Copyright © 2009 Nokia.
All rights reserved.
Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. 
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. 
Neither the name of Nokia Corporation. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission of Nokia Corporation. 
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

version: 1.0
*/


// utility.js
//
// This file contains some utility functions for S60 providers


// Start an application and wait for it to exit

//TBD: Get rid of this global, use closures instead

DeviceError.prototype = new Error(); //inheritance occurs here
DeviceError.prototype.constructor = DeviceError; //If this not present then, it uses default constructor of Error

//constructor for DeviceError.
function DeviceError(message,code) 
{
	this.toString = concatenate;
	this.code = code;
	this.name = "DeviceException";//we can even overwrite default name "Error"
	this.message=message; 
}

function concatenate()
{
	return (this.name+":"+" "+this.message+" "+this.code);
}

function splitErrorMessage(errmessage)
{
	if(errmessage.search(/:/)!=-1)
	{
		if((errmessage.split(":").length)==2)
		{
			return errmessage.split(":")[1];
		}
		if((errmessage.split(":").length)>2)
		{
			return errmessage.split(":")[2];
		}
	}
	return errmessage;
}


var __s60_start_and_wait_cb;

function __s60_on_app_exit(){
  widget.onshow = null;
  if(__s60_start_and_wait_cb != null){
    __s60_start_and_wait_cb();
  }
}

function __s60_on_app_start(){
  widget.onhide = null;
  widget.onshow = __s60_on_app_exit;
}

// This function cannot actually force JS to wait,
// but it does supply a callback the apps can use
// to continue processing on return from the app.
// Apps should take care not to reinvoke this and
// should be careful about any other processing
// that might happen while the app is running.

function __s60_start_and_wait(id, args, app_exit_cb){
  __s60_start_and_wait_cb = app_exit_cb;
  widget.onhide = __s60_on_app_start;
  widget.openApplication(id, args);
}

function __s60_api_not_supported(){
  throw(err_ServiceNotSupported);
}

function __s60_enumerate_object(object, namespace, func, param){
    var key;
    for(key in object){
       
        var propname;
       	if(namespace){
	    propname = namespace + "." + key;
	}
	else{
	    propname = key;
	}
        var value = object[key];
        if(typeof value == "object"){
	  __s60_enumerate_object(value, propname, func, param);
	}
	else {
	  func(propname,value, param);
	}
    }
}
/*
Copyright © 2009 Nokia. All rights reserved.
Code licensed under the BSD License:
Software License Agreement (BSD License) Copyright © 2009 Nokia.
All rights reserved.
Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. 
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. 
Neither the name of Nokia Corporation. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission of Nokia Corporation. 
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

version: 1.0
*/


var __device_debug_on__ = true;
var err_missing_argument = 1003;
var event_cancelled = 3;
var err_bad_argument = 1002;
var err_InvalidService_Argument = 1000;
var err_ServiceNotReady = 1006;
var err_ServiceNotSupported = 1004;

function __device_debug(text){
  //if(__device_debug_on__) alert(text);
}

function __device_handle_exception(e, text){
	__device_debug(text);
	throw(e);
}

function __device_typeof(value)
{
	// First check to see if the value is undefined.
	if (value == undefined) {
        return "undefined";
    }
	// Check for objects created with the "new" keyword.
	if (value instanceof Object) {
		// Check whether it's a string object.
		if (value instanceof String) {
			return "String";
		}
		// Check whether it's an array object/array literal.
		else 
			if (value instanceof Array) {
				return "Array";
			}
	}
	// dealing with a literal.
		if (typeof value) {
			if (typeof value == "object") {
				if (typeof value == "object" && !value) {
					return "null";
				}
			}
           // if not null check for other types
			
				// Check if it's a string literal.
			else if (typeof value == "string") {
					return "string";
				}
		}	 
}


// The top-level service object. It would be nice to use a namespace here 
// (com.nokia.device.service), but emulating namespaces still allows name clashes.
/*
var sp_device = {
        //services: null; // TBD: Make the services list a member of this object?
	load: __device_service_load,
        listServices: __device_service_list,
        listInterfaces: __device_service_interfaces,
        version: "0.1",
        info: "device prototype"
};
*/

if(undefined == com)
    var com={};

if( typeof com != "object")
    throw("com defined as non object");

if(undefined == com.nokia)
    com.nokia = {};

if( typeof com.nokia != "object")
    throw("com.nokia defined as non object");

if(undefined == com.nokia.device)
    com.nokia.device = {
        load: __device_service_load,
        listServices: __device_service_list,
        listInterfaces: __device_service_interfaces,
        version: "0.1",
        info: "device prototype"
        };
else
    throw("com.nokia.device already defined");

com.nokia.device.SORT_ASCENDING = 0;
com.nokia.device.SORT_DESCENDING = 1;

com.nokia.device.SORT_BY_DATE = 0;
com.nokia.device.SORT_BY_SENDER = 1;

com.nokia.device.STATUS_READ = 0;
com.nokia.device.STATUS_UNREAD = 1;


// Configure the services offered.

var __device_services_inited = false;

var __device_services = [

  // For now, the only service is the base "device"" service
  {
    "name":"com.nokia.device",
    "version": 0.1, 
    "interfaces": []
  }
];

// Initialize the configured services.

function __device_services_init(){
  if(__device_services_inited){
    return;
  }
  __device_services_inited = true;

  // Get the service-specific service entries. Note that these
  // need to be individually wrapped by try/catch blocks so that the
  // interpreter gracefully handles missing services. 

  try {
    __device_services[0].interfaces.push(__device_geolocation_service_entry);
  }catch (e){
    __device_debug("Missing library implementation: " + e);
  }
  try {
    __device_services[0].interfaces.push(__device_camera_service_entry);
  }catch (e){
    __device_debug("Missing library implementation: " + e);
  }
  try {
    __device_services[0].interfaces.push(__device_media_service_entry);
  }catch (e){
//    __device_debug("Missing library implementation: " + e);
  }
  try {
    __device_services[0].interfaces.push(__device_contacts_service_entry);
  }catch (e){
//    __device_debug("Missing library implementation: " + e);
  }
 try {
    __device_services[0].interfaces.push(__device_messaging_service_entry);
  }catch (e){
      __device_debug("Missing library implementation: " + e);
  }
  try {
    __device_services[0].interfaces.push(__device_calendar_service_entry);
  }catch (e){
      __device_debug("Missing library implementation: " + e);
  }
  try {
    __device_services[0].interfaces.push(__device_landmarks_service_entry);
  }catch (e){
      __device_debug("Missing library implementation: " + e);
  }
  try {
    __device_services[0].interfaces.push(__device_event_service_entry);
  }catch (e){
      __device_debug("Missing library implementation: " + e);
  }
  try {
    __device_services[0].interfaces.push(__device_sysinfo_service_entry);
  }catch (e){
      __device_debug("Missing library implementation: " + e);
  }
  try {
    __device_services[0].interfaces.push(__device_sensors_service_entry);
  }catch (e){
      __device_debug("Missing library implementation: " + e);
  }

}

function __device_get_implementation(i){
  //__device_debug("get_implementation: " + i);
  return  new i.proto(new(i.providers[0].instance));
}

function __device_get_descriptor(i){
  //__device_debug("get_descriptor: " + i);
  return new i.descriptor(new(i.providers[0].descriptor));
}

function __device_get_interface(s, interfaceName, version){
  //__device_debug("get_interface: " + s + " " + interfaceName);
  var i = s.interfaces;
  if((interfaceName == null) || (interfaceName == '')){
    // Interface name not specified, get first interface, ignoring version
    return __device_get_implementation(i[0]);
  }

  // Find first match of name and version
  for (var d in i){
  
    if(i[d].name == null){
      __device_update_descriptor(i[d]);
    }
    if(i[d].name == undefined){
      continue;
    }
    if (i[d].name == interfaceName){
      // Match version if specified
      if ((version == null) || (version == '') || (i[d].version >= version)){
	return __device_get_implementation(i[d]);
      }
    }
  }
  return null;
}

// Implemention of the load method

function __device_service_load(serviceName, interfaceName, version){

  __device_services_init();
  
  // Service name is specified
   if ((serviceName != null) && (serviceName != '') &&(serviceName != "*")){
    for(var s in __device_services){
      if (serviceName == __device_services[s].name){
	return __device_get_interface(__device_services[s], interfaceName, version);
      }
    }
  // Service name not specified, get first implementation 
  } else {
    //__device_debug("Trying to get interface implementations: ");
    for(var s in __device_services){
      //__device_debug("service_load: " + s + ":" +  __device_services[s].name + ": " + interfaceName);
      var i = __device_get_interface(__device_services[s], interfaceName, version);
      if (i != null){
	return i;
      }
    }
  }
  return null;
}

// Lazily fill in the descriptor table

function __device_update_descriptor(i){
  var d = __device_get_descriptor(i);
  i.name = d.interfaceName;
  i.version = d.version;  
}
// Get an array of interface descriptors for a service

function __device_interface_list(s){
  var retval = new Array();
  for(var i in s.interfaces){
    if(s.interfaces[i].name == null){
      __device_update_descriptor(s.interfaces[i]);
    }
    if(s.interfaces[i].name == undefined){
      continue;
    }
    retval[i] = new Object();
    retval[i].name = s.interfaces[i].name;
    retval[i].version = s.interfaces[i].version;
  }  
  return retval;
}

// Get a service description

function __device_service_descriptor(s){
  this.name = s.name;
  this.version = s.version;
  this.interfaces = __device_interface_list(s);
  this.toString = __device_service_descriptor_to_string;
}

function __device_service_descriptor_to_string(){
  var is = "\nInterfaces(s): ";

  for (i in this.interfaces){
    is += "\n" + this.interfaces[i].name + " " + this.interfaces[0].version;
  }
  return ("Service: " + this.name + is);
}

// Implement the listServices method 

function __device_service_list(serviceName, interfaceName, version){
  //__device_debug("__device_service_list: " + serviceName + " " + interfaceName);
  __device_services_init();
  var retval = new Array();
  var n = 0;
  
  //Treat empty service and interface names as wildcards
  if ((serviceName == null)|| (serviceName == '')/* || (serviceName == undefined)*/){
    serviceName = ".*"; 
  }
  if ((interfaceName == null) || (interfaceName == '') /*|| (serviceName == undefined)*/){
    interfaceName = ".*";
  }
 
  if ((typeof serviceName != "string") || (typeof interfaceName != "string")) {
  	return retval;
  }
  
  // This method does regular expression matching of service and interface

  var sregx = new RegExp(serviceName);
  var iregx = new RegExp(interfaceName);
 
  for(var s in __device_services){
   //__device_debug (serviceName + "==" + __device_services[s].name + "?:" + sregx.test(__device_services[s].name));
    if (sregx.test(__device_services[s].name)){
      // Find the first matching interface 
        
      for(var i in __device_services[s].interfaces){
        if(__device_services[s].interfaces[i].name == null){
          __device_update_descriptor(__device_services[s].interfaces[i]);
	}
        if(__device_services[s].interfaces[i].name == undefined){
	  continue;
	}
	//__device_debug (interfaceName + "==" + __device_services[s].interfaces[i].name + "?:" + iregx.test(__device_services[s].interfaces[i].name));
	if (iregx.test(__device_services[s].interfaces[i].name)){
	  if ((version == null) || (version == '') || (__device_services[s].interfaces[i].version >= version)){
            // An interface matched, we're done.
            retval[n] = new __device_service_descriptor(__device_services[s]);
            break; 
	  }
	}
      }
    }
    ++n;
  }
  return retval;
}

// Implement the listInterfaces method
    
function __device_service_interfaces(serviceName){
  __device_services_init();
  if(serviceName==null||serviceName==undefined||serviceName==''){
  	throw new DeviceError("Framework: listInterfaces: serviceName is missing", err_missing_argument);
  }
  for (var s in __device_services){
    if(__device_services[s].name == serviceName){
      return __device_interface_list(__device_services[s]);
    }
  }
  return null;
}

function modifyObjectBaseProp(obj){
  for (pro in obj) {
    if(typeof obj[pro] == "function" )
      obj[pro] = 0;
    }
};
/*
Copyright © 2009 Nokia. All rights reserved.
Code licensed under the BSD License:
Software License Agreement (BSD License) Copyright © 2009 Nokia.
All rights reserved.
Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. 
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. 
Neither the name of Nokia Corporation. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission of Nokia Corporation. 
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

version: 1.0
*/


// S60 sp-based camera provider

function __sp_camera_descriptor(){
  //__device_debug("sp_camera_descriptor");
  //Read-only properties
  this.interfaceName = "com.nokia.device.camera";
  this.version = "0.1";
  //Class-static properties 
}

// TBD make local to closure funcs
var __sp_camera_start_date;

function __sp_camera_instance(){
  //__device_debug("sp_camera_instance");
  //Descriptor
  this.descriptor = new __sp_camera_descriptor();
  //Core methods
  this.startCamera = __sp_startCamera;
  this.stopViewfinder = __s60_api_not_supported;
  //Extended methods
  this.takePicture = __s60_api_not_supported;
  //Private data
}

var CAMERA_APP_ID = 0x101f857a;

//Apps should take care that this is not reinvoked
//while the viewfinder is running. 

function __sp_startCamera(camera_cb){

	//If callback is null , then return missing argument error
    if( camera_cb == null )
        throw new DeviceError("Camera:startCamera:callback is missing", err_missing_argument);
        
	//If the callback is not a function, then return bad type error
	if( typeof(camera_cb) != "function" )
	    throw new DeviceError("Camera:startCamera:callback is a non-function", err_bad_argument);

  var finished = function (){
    var invoker = function (arg1, arg2, arg3){
      //__device_debug("invoker with: " + camera_cb);
      var it = arg3.ReturnValue;
      var item;
      var items = new Array();
      while (( item = it.getNext()) != undefined){
          var d = new Date(Date.parse(item.FileDate));
          //__device_debug(item.FileName + " " + d );
          // Items returned in reverse date order, so stop iterating before
          // reaching initial date. (Should be able to do this more efficiently
          // with sp filter, but that doesn't seem to work right now.)
          if (d > __sp_camera_start_date) {
              var pathname = item.FileNameAndPath.replace(/\\/g, "/");
              var fileScheme = "file:///";
              //Non-patched builds don't allow file scheme TBD: change this for patched builds
              items.unshift(fileScheme + pathname);
          }
      }
      var dummyTransID = 0;
      var dummyStatusCode = 0;
      camera_cb(dummyTransID, dummyStatusCode, items);
    };

    
    //When camera returns, get the image(s) created
    try {
      var mso = device.getServiceObject("Service.MediaManagement", "IDataSource");
    }
    catch(e) {
      __device_handle_exception (e, "media service not available : " + e);
    }
    
    var criteria = new Object();
	modifyObjectBaseProp(criteria);
    criteria.Type = 'FileInfo';
    criteria.Filter = new Object();
	modifyObjectBaseProp(criteria.Filter);
    criteria.Filter.FileType = 'Image';
    //criteria.Filter.Key = 'FileDate';
    //criteria.Filter.StartRange = null;
    //criteria.Filter.EndRange = null;
    criteria.Sort = new Object();
	modifyObjectBaseProp(criteria.Sort);
    criteria.Sort.Key = 'FileDate';
    criteria.Sort.Order = 'Descending';
    
    try {
      var rval = mso.IDataSource.GetList(criteria, invoker);
    }
    catch (e) {
      __device_handle_exception (e, "media service GetList failed: " + e);
    }
  };

  __sp_camera_start_date = new Date();
  __s60_start_and_wait(CAMERA_APP_ID, "", finished);
  var dummyTid = 0;
  return dummyTid;
}


/*
Copyright © 2009 Nokia. All rights reserved.
Code licensed under the BSD License:
Software License Agreement (BSD License) Copyright © 2009 Nokia.
All rights reserved.
Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. 
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. 
Neither the name of Nokia Corporation. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission of Nokia Corporation. 
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

version: 1.0
*/


// Camera service interface

var __device_camera_service_entry =  {"name": null, 
					 "version": null,
					 "proto": __device_camera,
					 "descriptor": __device_camera_descriptor,
					 "providers": [{"descriptor": __sp_camera_descriptor, "instance": __sp_camera_instance}]
					};

function __device_camera_descriptor(provider){
  this.interfaceName = provider.interfaceName;
  this.version = provider.version;
}


// Private camera  prototype: called from service factory
function __device_camera(provider){
  //Private properties
  this.provider = provider;
  //Read-only properties
  this.interfaceName = provider.descriptor.interfaceName;
  this.version = provider.descriptor.version;
 // this.supportedMediaTypes = provider.supportedMediaTypes;
 // this.supportedSizes = provider.supportedSizes;
  //Core methods
  this.startCamera = __device_camera_startCamera;
  this.stopViewfinder = __device_camera_stopViewfinder;
  //Extended methods
  this.takePicture = __device_camera_takePicture;
}


//Why bother to define these methods? Because the camera
//object defines the contract for providers!

function __device_camera_startCamera(camera_cb){
  return this.provider.startCamera(camera_cb);
}

function __device_camera_stopViewfinder(){
  this.provider.stopViewfinder();
}

function __device_camera_takePicture(format){
  this.provider.takePicture(format);
}
/**
 * This class provides access to the device contacts.
 * @constructor
 */

function Contacts() {
	
}

function Contact() {
	this.id = null;
	this.name = { 
		formatted: "",
		givenName: "",
		familyName: ""
	};
    this.phones = [];
    this.emails = [];
}

Contact.prototype.displayName = function()
{
    // TODO: can be tuned according to prefs
	return this.givenName + " " + this.familyName;
};

/*
 * @param {ContactsFilter} filter Object with filter properties. filter.name only for now.
 * @param {function} successCallback Callback function on success
 * @param {function} errorCallback Callback function on failure
 * @param {object} options Object with properties .page and .limit for paging
 */

Contacts.prototype.find = function(filter, successCallback, errorCallback, options) {
	try {
		this.contactsService = device.getServiceObject("Service.Contact", "IDataSource");
		if (typeof options == 'object')
			this.options = options;
		else
			this.options = {};
		
		var criteria = new Object();
		criteria.Type = "Contact";
		if (filter && filter.name) {
			var searchTerm = '';
			if (filter.name.givenName && filter.name.givenName.length > 0) {
				searchTerm += filter.name.givenName;
			}
			if (filter.name.familyName && filter.name.familyName.length > 0) {
				searchTerm += searchTerm.length > 0 ? ' ' + filter.name.familyName : filter.name.familyName;
			}
			if (!filter.name.familyName && !filter.name.givenName && filter.name.formatted) {
				searchTerm = filter.name.formatted;
			}
			criteria.Filter = { SearchVal: searchTerm };
		}
		
		if (typeof(successCallback) != 'function') 
			successCallback = function(){};
		if (typeof(errorCallback) != 'function') 
			errorCallback = function(){};
		if (isNaN(this.options.limit))
			this.options.limit = 200;
		if (isNaN(this.options.page))
			this.options.page = 1;
		
		//need a closure here to bind this method to this instance of the Contacts object
		this.global_success = successCallback;
		var obj = this;
		
		//WRT: result.ReturnValue is an iterator of contacts
		this.contactsService.IDataSource.GetList(criteria, function(transId, eventCode, result){
			obj.success_callback(result.ReturnValue);
		});
	} 
	catch (ex) {
		alert(ex.name + ": " + ex.message);
		errorCallback(ex);
	}
};

Contacts.prototype.success_callback = function(contacts_iterator) {
	try {
	var gapContacts = new Array();
	if (contacts_iterator) {
		contacts_iterator.reset();
		var contact;
		var i = 0;
		var end = this.options.page * this.options.limit;
		var start = end - this.options.limit;
		while ((contact = contacts_iterator.getNext()) != undefined && i < end) {
			try {
				if (i >= start) {
					var gapContact = new Contact();
					gapContact.name.givenName = Contacts.GetValue(contact, "FirstName");
					gapContact.name.familyName = Contacts.GetValue(contact, "LastName");
					gapContact.name.formatted = gapContact.name.givenName + " " + gapContact.name.familyName;
					gapContact.emails = Contacts.getEmailsList(contact);
					gapContact.phones = Contacts.getPhonesList(contact);
					gapContact.address = Contacts.getAddress(contact);
					gapContact.id = Contacts.GetValue(contact, "id");
					gapContacts.push(gapContact);
				}
				i++;
			} catch (e) {
				alert("ContactsError (" + e.name + ": " + e.message + ")");
			}
		}
	}
	this.contacts = gapContacts;
	this.global_success(gapContacts);
	} catch (ex) { alert(ex.name + ": " + ex.message); }
};

Contacts.getEmailsList = function(contact) {
	var emails = new Array();
	try {
			emails[0] = { type:"General", address: Contacts.GetValue(contact, "EmailGen") };
			emails[1] = { type:"Work", address: Contacts.GetValue(contact, "EmailWork") };		
			emails[2] = { type:"Home", address: Contacts.GetValue(contact, "EmailHome") };
	} catch (e) {
		emails = [];
	}
	return emails;
};

Contacts.getPhonesList = function(contact) {
	var phones = new Array();
	try {
			phones[0] = { type:"Mobile", number: Contacts.GetValue(contact, "MobilePhoneGen") };
			phones[1] = { type:"Home", number: Contacts.GetValue(contact, "LandPhoneGen") };
			phones[2] = { type:"Fax", number: Contacts.GetValue(contact, "FaxNumberGen") };
			phones[3] = { type:"Work", number: Contacts.GetValue(contact, "LandPhoneWork") };
			phones[4] = { type:"WorkMobile", number: Contacts.GetValue(contact, "MobilePhoneWork") };
	} catch (e) {
		phones = [];
	}
	return phones;
};

Contacts.getAddress = function(contact) {
	var address = "";
	try {
		address = Contacts.GetValue(contact, "AddrLabelHome") + ", " + Contacts.GetValue(contact, "AddrStreetHome") + ", " +
				Contacts.GetValue(contact, "AddrLocalHome") + ", " + Contacts.GetValue(contact, "AddrRegionHome") + ", " + 
				Contacts.GetValue(contact, "AddrPostCodeHome") + ", " + Contacts.GetValue(contact, "AddrCountryHome");
	} catch (e) {
		address = "";
	}
	return address;
};

Contacts.GetValue = function(contactObj, key) {
	try {
		return contactObj[key]["Value"];
	} catch (e) {
		return "";
	}
};

if (typeof navigator.contacts == "undefined") navigator.contacts = new Contacts();
/**
 * This class provides access to the debugging console.
 * @constructor
 */
function DebugConsole() {
}

/**
 * Print a normal log message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.log = function(message) {
	
	//This ends up in C:\jslog_widget.log on the device
	console.log(message);
};

/**
 * Print a warning message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.warn = function(message) {
	console.log(message);
};

/**
 * Print an error message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.error = function(message) {
	console.log(message);
};

if (typeof window.debug == "undefined") window.debug = new DebugConsole();
PhoneGap.ExtendWrtDeviceObj = function(){
	
	if (!window.device)
		window.device = {};
	navigator.device = window.device;

	try {
	
		if (window.menu)
	    	window.menu.hideSoftkeys();
		
		device.available = PhoneGap.available;
		device.platform = null;
		device.version = null;
		device.name = null;
		device.uuid = null;
		
		var so = device.getServiceObject("Service.SysInfo", "ISysInfo");
		var pf = PhoneGap.GetWrtPlatformVersion(so);
		device.platform = pf.platform;
		device.version = pf.version;
		device.uuid = PhoneGap.GetWrtDeviceProperty(so, "IMEI");
		device.name = PhoneGap.GetWrtDeviceProperty(so, "PhoneModel");
	} 
	catch (e) {
		alert(e.name + ": " + e.message);
		device.available = false;
	}
};

PhoneGap.GetWrtDeviceProperty = function(serviceObj, key) {
	var criteria = { "Entity": "Device", "Key": key };
	var result = serviceObj.ISysInfo.GetInfo(criteria);
	if (result.ErrorCode == 0) {
		return result.ReturnValue.StringData;
	}
	else {
		return null;
	}
};

PhoneGap.GetWrtPlatformVersion = function(serviceObj) {
	var criteria = { "Entity": "Device", "Key": "PlatformVersion" };
	var result = serviceObj.ISysInfo.GetInfo(criteria);
	if (result.ErrorCode == 0) {
		var version = {};
		version.platform = result.ReturnValue.MajorVersion;
		version.version = result.ReturnValue.MinorVersion;
		return version;
	}
	else {
		return null;
	}
};

PhoneGap.ExtendWrtDeviceObj();/**
 * This class provides access to device GPS data.
 * @constructor
 */
function Geolocation() {
    /**
     * The last known GPS position.
     */
    this.lastPosition = null;
    this.lastError = null;
    this.callbacks = {
        onLocationChanged: [],
        onError:           []
    };
};

/**
 * Asynchronously aquires the current position.
 * @param {Function} successCallback The function to call when the position
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the position data.
 * @param {PositionOptions} options The options for getting the position data
 * such as timeout.
 */
Geolocation.prototype.getCurrentPosition = function(successCallback, errorCallback, options) {
    var referenceTime = 0;
    if (this.lastPosition)
        referenceTime = this.lastPosition.timestamp;
    else
        this.start(options);

    var timeout = 20000;
    var interval = 500;
    if (typeof(options) == 'object' && options.interval)
        interval = options.interval;

    if (typeof(successCallback) != 'function')
        successCallback = function() {};
    if (typeof(errorCallback) != 'function')
        errorCallback = function() {};

    var dis = this;
    var delay = 0;
    var timer = setInterval(function() {
        delay += interval;
		//if we have a new position, call success and cancel the timer
        if (dis.lastPosition && dis.lastPosition.timestamp > referenceTime) {
            successCallback(dis.lastPosition);
            clearInterval(timer);
        } else if (delay >= timeout) { //else if timeout has occured then call error and cancel the timer
            errorCallback();
            clearInterval(timer);
        }
		//else the interval gets called again
    }, interval);
};

/**
 * Asynchronously aquires the position repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the position
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the position data.
 * @param {PositionOptions} options The options for getting the position data
 * such as timeout and the frequency of the watch.
 */
Geolocation.prototype.watchPosition = function(successCallback, errorCallback, options) {
	// Invoke the appropriate callback with a new Position object every time the implementation 
	// determines that the position of the hosting device has changed. 
	this.getCurrentPosition(successCallback, errorCallback, options);
	var frequency = 10000;
        if (typeof options == 'object' && options.frequency)
            frequency = options.frequency;
	var that = this;
	return setInterval(function() {
		that.getCurrentPosition(successCallback, errorCallback, options);
	}, frequency);
};


/**
 * Clears the specified position watch.
 * @param {String} watchId The ID of the watch returned from #watchPosition.
 */
Geolocation.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};

Geolocation.prototype.start = function(options) {
	var so = device.getServiceObject("Service.Location", "ILocation");
	
	//construct the criteria for our location request
	var updateOptions = new Object();
	// Specify that location information need not be guaranteed. This helps in
	// that the widget doesn't need to wait for that information possibly indefinitely.
	updateOptions.PartialUpdates = true;
	
	//default 15 seconds
	if (typeof(options) == 'object' && options.timeout) 
		//options.timeout in in ms, updateOptions.UpdateTimeout in microsecs
		updateOptions.UpdateTimeOut = options.timeout * 1000;

	//default 1 second
	if (typeof(options) == 'object' && options.interval) 
		//options.timeout in in ms, updateOptions.UpdateTimeout in microsecs
		updateOptions.UpdateInterval = options.interval * 1000;
	
	// Initialize the criteria for the GetLocation call
	var trackCriteria = new Object();
	// could use "BasicLocationInformation" or "GenericLocationInfo"
	trackCriteria.LocationInformationClass = "GenericLocationInfo";
	trackCriteria.Updateoptions = updateOptions;
	
	var dis = this;
	so.ILocation.Trace(trackCriteria, function(transId, eventCode, result) {
		var retVal = result.ReturnValue;

		if (result.ErrorCode != 0 || isNaN(retVal.Latitude))
			return;
		
		// heading options: retVal.TrueCourse, retVal.MagneticHeading, retVal.Heading, retVal.MagneticCourse
		// but retVal.Heading was the only field being returned with data on the test device (Nokia 5800)
		// WRT does not provide accuracy
		var newCoords = new Coordinates(retVal.Latitude, retVal.Longitude, retVal.Altitude, null, retVal.Heading, retVal.HorizontalSpeed);
		var positionObj = { coords: newCoords, timestamp: (new Date()).getTime() };

		dis.lastPosition = positionObj;
	});
	
};


if (typeof navigator.geolocation == "undefined") navigator.geolocation = new Geolocation();

/**
 * This class provides access to native mapping applications on the device.
 */
function Map() {
	
}

/**
 * Shows a native map on the device with pins at the given positions.
 * @param {Array} positions
 */
Map.prototype.show = function(positions) {

	var err = "map api is unimplemented on symbian.wrt";
	debug.log(err);
	return { name: "MapError", message: err };

};

if (typeof navigator.map == "undefined") navigator.map = new Map();
function Network() {
    /**
     * The last known Network status.
     */
	this.lastReachability = null;
};

Network.prototype.isReachable = function(hostName, successCallback, options) {
	var req = new XMLHttpRequest();  
   	req.open('GET', hostName, true);  
   	req.onreadystatechange = function (aEvt) {  
     	if (req.readyState == 4) {  
        	if(req.status == 200)  
        		successCallback(NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK);
         	else  
          		successCallback(NetworkStatus.NOT_REACHABLE);
 		}  
  	};  
  	req.send(null);

};

/**
 * This class contains information about any NetworkStatus.
 * @constructor
 */
function NetworkStatus() {
	this.code = null;
	this.message = "";
}

NetworkStatus.NOT_REACHABLE = 0;
NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK = 1;
NetworkStatus.REACHABLE_VIA_WIFI_NETWORK = 2;

if (typeof navigator.network == "undefined") navigator.network = new Network();
/**
 * This class provides access to notifications on the device.
 */
function Notification() {
	
}

Notification.prototype.vibrate = function(mills)
{
	
	if (!Notification.getSysinfoObject())
		Notification.embedSysinfoObject();
	
	this.sysinfo = Notification.getSysinfoObject();
	this.sysinfo.startvibra(mills, 100);
};

//TODO: this is not beeping
Notification.prototype.beep = function(count, volume)
{
	if (!Notification.getSysinfoObject())
		Notification.embedSysinfoObject();
	
	this.sysinfo = Notification.getSysinfoObject();	
	this.sysinfo.beep(220,2000);
};


/**
 * Open a native alert dialog, with a customizable title and button text.
 * @param {String} message Message to print in the body of the alert
 * @param {String} [title="Alert"] Title of the alert dialog (default: Alert)
 * @param {String} [buttonLabel="OK"] Label of the close button (default: OK)
 */
Notification.prototype.alert = function(message, title, buttonLabel) {
    // Default is to use a browser alert; this will use "index.html" as the title though
    alert(message);
};

/**
 * Start spinning the activity indicator on the statusbar
 */
Notification.prototype.activityStart = function() {
};

/**
 * Stop spinning the activity indicator on the statusbar, if it's currently spinning
 */
Notification.prototype.activityStop = function() {
};

/**
 * Causes the device to blink a status LED.
 * @param {Integer} count The number of blinks.
 * @param {String} colour The colour of the light.
 */
Notification.prototype.blink = function(count, colour) {
	
};

Notification.embedSysinfoObject = function() {
	var el = document.createElement("embed");
	el.setAttribute("type", "application/x-systeminfo-widget");
	el.setAttribute("hidden", "yes");
	document.getElementsByTagName("body")[0].appendChild(el);
	return;
};

Notification.getSysinfoObject = function() {
	return document.embeds[0];
};

if (typeof navigator.notification == "undefined") navigator.notification = new Notification();
/**
 * This class provides access to the device orientation.
 * @constructor
 */
function Orientation() {
	/**
	 * The current orientation, or null if the orientation hasn't changed yet.
	 */
	this.currentOrientation = null;
}

/**
 * Set the current orientation of the phone.  This is called from the device automatically.
 * 
 * When the orientation is changed, the DOMEvent \c orientationChanged is dispatched against
 * the document element.  The event has the property \c orientation which can be used to retrieve
 * the device's current orientation, in addition to the \c Orientation.currentOrientation class property.
 *
 * @param {Number} orientation The orientation to be set
 */
Orientation.prototype.setOrientation = function(orientation) {
		if (orientation == this.currentOrientation) 
			return;
		var old = this.currentOrientation;

		this.currentOrientation = orientation;
		var e = document.createEvent('Events');
		e.initEvent('orientationChanged', 'false', 'false');
		e.orientation = orientation;
		e.oldOrientation = old;
		document.dispatchEvent(e);
};

/**
 * Asynchronously aquires the current orientation.
 * @param {Function} successCallback The function to call when the orientation
 * is known.
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the orientation.
 */
Orientation.prototype.getCurrentOrientation = function(successCallback, errorCallback) {
	// If the orientation is available then call success
	// If the orientation is not available then call error
	try {
		if (!this.serviceObj) 
			this.serviceObj = this.getServiceObj();
		
		if (this.serviceObj == null) 
			errorCallback({
				name: "DeviceErr",
				message: "Could not initialize service object"
			});
		
		//get the sensor channel
		var SensorParams = {
			SearchCriterion: "Orientation"
		};
		var returnvalue = this.serviceObj.ISensor.FindSensorChannel(SensorParams);
		
		var error = returnvalue["ErrorCode"];
		var errmsg = returnvalue["ErrorMessage"];
		if (!(error == 0 || error == 1012)) {
			var ex = {
				name: "Unable to find Sensor Channel: " + error,
				message: errmsg
			};
			errorCallback(ex);
		}
		var channelInfoMap = returnvalue["ReturnValue"][0];
		var criteria = {
			ChannelInfoMap: channelInfoMap,
			ListeningType: "ChannelData"
		};
		
		if (typeof(successCallback) != 'function') 
			successCallback = function(){
			};
		if (typeof(errorCallback) != 'function') 
			errorCallback = function(){
			};
		
		this.success_callback = successCallback;
		this.error_callback = errorCallback;
		
		//create a closure to persist this instance of orientation object into the RegisterForNofication callback
		var obj = this;
		
		// TODO: this call crashes WRT, but there is no other way to read the orientation sensor
		// http://discussion.forum.nokia.com/forum/showthread.php?t=182151&highlight=memory+leak
		this.serviceObj.ISensor.RegisterForNotification(criteria, function(transId, eventCode, result){
			var criteria = {
				TransactionID: transId
			};
			try {
				//var orientation = result.ReturnValue.DeviceOrientation;
				obj.serviceObj.ISensor.Cancel(criteria);
				
				var orientation = null;
				switch (result.ReturnValue.DeviceOrientation) {
					case "DisplayUpwards": orientation = DisplayOrientation.FACE_UP; break;
					case "DisplayDownwards": orientation = DisplayOrientation.FACE_DOWN; break;
					case "DisplayUp": orientation = DisplayOrientation.PORTRAIT; break;
					case "DisplayDown": orientation = DisplayOrientation.REVERSE_PORTRAIT; break;
					case "DisplayRightUp": orientation = DisplayOrientation.LANDSCAPE_RIGHT_UP; break;
					case "DisplayLeftUp": orientation = DisplayOrientation.LANDSCAPE_LEFT_UP; break;
					
				}
				
				obj.setOrientation(orientation);
				
				obj.success_callback(orientation);
				
			} 
			catch (ex) {
				obj.serviceObj.ISensor.Cancel(criteria);
				obj.error_callback(ex);
			}
			
		});
	} catch (ex) {
		errorCallback({ name: "OrientationError", message: ex.name + ": " + ex.message });
	}
};

/**
 * Asynchronously aquires the orientation repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the orientation
 * data is available.
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the orientation data.
 */
Orientation.prototype.watchOrientation = function(successCallback, errorCallback, options) {
	// Invoke the appropriate callback with a new Position object every time the implementation 
	// determines that the position of the hosting device has changed. 
	this.getCurrentOrientation(successCallback, errorCallback);
	var frequency = (options != undefined)? options.frequency : 1000;
	return setInterval(function() {
		navigator.orientation.getCurrentOrientation(successCallback, errorCallback);
	}, frequency);
};

/**
 * Clears the specified orientation watch.
 * @param {String} watchId The ID of the watch returned from #watchOrientation.
 */
Orientation.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};

//gets the Acceleration Service Object from WRT
Orientation.prototype.getServiceObj = function() {
	var so;
	
    try {
        so = device.getServiceObject("Service.Sensor", "ISensor");
    } catch (ex) {
		throw {
			name: "DeviceError",
			message: ex.name + ": " + ex.message
		};
    }		
	return so;
};


/**
 * This class encapsulates the possible orientation values.
 * @constructor
 */
function DisplayOrientation() {
	this.code = null;
	this.message = "";
}

DisplayOrientation.PORTRAIT = 0;
DisplayOrientation.REVERSE_PORTRAIT = 1;
DisplayOrientation.LANDSCAPE_LEFT_UP = 2;
DisplayOrientation.LANDSCAPE_RIGHT_UP = 3;
DisplayOrientation.FACE_UP = 4;
DisplayOrientation.FACE_DOWN = 5;

if (typeof navigator.orientation == "undefined") navigator.orientation = new Orientation();
/**
 * This class contains position information.
 * @param {Object} lat
 * @param {Object} lng
 * @param {Object} acc
 * @param {Object} alt
 * @param {Object} altacc
 * @param {Object} head
 * @param {Object} vel
 * @constructor
 */
function Position(coords, timestamp) {
	this.coords = coords;
        this.timestamp = new Date().getTime();
}

function Coordinates(lat, lng, alt, acc, head, vel) {
	/**
	 * The latitude of the position.
	 */
	this.latitude = lat;
	/**
	 * The longitude of the position,
	 */
	this.longitude = lng;
	/**
	 * The accuracy of the position.
	 */
	this.accuracy = acc;
	/**
	 * The altitude of the position.
	 */
	this.altitude = alt;
	/**
	 * The direction the device is moving at the position.
	 */
	this.heading = head;
	/**
	 * The velocity with which the device is moving at the position.
	 */
	this.speed = vel;
}

/**
 * This class specifies the options for requesting position data.
 * @constructor
 */
function PositionOptions() {
	/**
	 * Specifies the desired position accuracy.
	 */
	this.enableHighAccuracy = true;
	/**
	 * The timeout after which if position data cannot be obtained the errorCallback
	 * is called.
	 */
	this.timeout = 10000;
}

/**
 * This class contains information about any GSP errors.
 * @constructor
 */
function PositionError() {
	this.code = null;
	this.message = "";
}

PositionError.UNKNOWN_ERROR = 0;
PositionError.PERMISSION_DENIED = 1;
PositionError.POSITION_UNAVAILABLE = 2;
PositionError.TIMEOUT = 3;
/**
 * This class provides access to the device SMS functionality.
 * @constructor
 */
function Sms() {

}

/**
 * Sends an SMS message.
 * @param {Integer} number The phone number to send the message to.
 * @param {String} message The contents of the SMS message to send.
 * @param {Function} successCallback The function to call when the SMS message is sent.
 * @param {Function} errorCallback The function to call when there is an error sending the SMS message.
 * @param {PositionOptions} options The options for accessing the GPS location such as timeout and accuracy.
 */
Sms.prototype.send = function(number, message, successCallback, errorCallback, options) {
    try {
		if (!this.serviceObj)
			this.serviceObj = this.getServiceObj();
			
	    // Setup input params using dot syntax
	    var criteria = new Object();
	    criteria.MessageType = 'SMS';
	    criteria.To = number;
	    criteria.BodyText = message;

      	var result = this.serviceObj.IMessaging.Send(criteria);
    	if (result.ErrorCode != 0 && result.ErrorCode != "0")
		{
			var exception = { name: "SMSError", message: result.ErrorMessage };
			throw exception;
		} else {
			successCallback.call();
		}
    }
  	catch(ex)
  	{
		errorCallback.call({ name: "SmsError", message: ex.name + ": " + ex.message });
  	}

};


//gets the Sms Service Object from WRT
Sms.prototype.getServiceObj = function() {
	var so;
	
    try {
        so = device.getServiceObject("Service.Messaging", "IMessaging");
    } catch (ex) {
		throw {
			name: "SmsError",
			message: "Failed to load sms service (" + ex.name + ": " + ex.message + ")"
		};
    }		
	return so;
};

if (typeof navigator.sms == "undefined") navigator.sms = new Sms();/**
 * @author ryan
 */

function Storage() {
	this.available = true;
	this.serialized = null;
	this.items = null;
	
	if (!window.widget) {
		this.available = false;
		return;
	}
	var pref = window.widget.preferenceForKey(Storage.PREFERENCE_KEY);
	
	//storage not yet created
	if (pref == "undefined" || pref == undefined) {
		this.length = 0;
		this.serialized = "({})";
		this.items = {};
		window.widget.setPreferenceForKey(this.serialized, Storage.PREFERENCE_KEY);
	} else {
		this.serialized = pref;'({"store_test": { "key": "store_test", "data": "asdfasdfs" },})';
		this.items = eval(this.serialized);
	}
}

Storage.PREFERENCE_KEY = "phonegap_storage_pref_key";

Storage.prototype.index = function (key) {
	
};

Storage.prototype.getItem = function (key) {
	try {
		return this.items[key].data;
	} catch (ex) {
		return null;
	}
};

Storage.prototype.setItem = function (key, data) {

	this.items[key] = {
		"key": key,
		"data": data
	};
	
	this.serialize();
};

Storage.prototype.removeItem = function (key) {

	if (this.items[key]) {
		this.items[key] = undefined;
	}
	this.serialize();
};

Storage.prototype.clear = function () {
	this.serialized = "({})";
	this.items = {};
	this.serialize();
};

Storage.prototype.serialize = function() {
	var json = "";
	
	for (key in this.items) {
		var item = this.items[key];
		if (typeof item != "undefined") {
			json += "\"" + item.key + "\": { \"key\": \"" + item.key + "\", \"data\": \"" + item.data + "\" }, ";
		}
	}
	this.serialized = "({" + json + "})";

	window.widget.setPreferenceForKey( this.serialized, Storage.PREFERENCE_KEY);
};

if (typeof navigator.storage == "undefined" ) navigator.storage = new Storage();
/**
 * This class provides access to the telephony features of the device.
 * @constructor
 */
function Telephony() {
	this.number = "";
}

/**
 * Calls the specifed number.
 * @param {Integer} number The number to be called.
 */
Telephony.prototype.send = function(number) {
	widget.openURL('tel:+' + number);
};

if (typeof navigator.telephony == "undefined") navigator.telephony = new Telephony();