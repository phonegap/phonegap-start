var PushWoosh = {  
	getHWId : function() {
		return device.uuid;
	},

	register : function(token, lambda, lambdaerror) {
		var method = 'POST';
		var url = PushWoosh.baseurl + 'registerDevice';

		var offset = new Date().getTimezoneOffset() * 60;	//in seconds

		var language = window.navigator.language;
		var lang = 'en';
        if(language) {
             lang = language.substring(0,2); 
        }

		var deviceType = 1;
		if (device.platform == 'android' || device.platform == 'Android') {
			deviceType = 3;
		}

		var params = {
				request : {
					application : PushWoosh.appCode,
					push_token : token,
					language : lang,
					hwid : PushWoosh.getHWId(),
					timezone : offset,
					device_type : deviceType
				}
			};

		payload = (params) ? JSON.stringify(params) : '';
		PushWoosh.helper(url, method, payload, lambda, lambdaerror);
	},

	unregister : function(lambda, lambdaerror) {
		var method = 'POST';
		var url = PushWoosh.baseurl + 'unregisterDevice';

		var params = {
				request : {
					application : PushWoosh.appCode,
					hwid : PushWoosh.getHWId()
				}
			};

		payload = (params) ? JSON.stringify(params) : '';
		PushWoosh.helper(url, method, payload, lambda, lambdaerror);
	},

	sendBadge : function(badgeNumber, lambda, lambdaerror) {
		var method = 'POST';
		var url = PushWoosh.baseurl + 'setBadge';

		var params = {
				request : {
					application : PushWoosh.appCode,
					hwid : PushWoosh.getHWId(),
					badge: badgeNumber
				}
			};

		payload = (params) ? JSON.stringify(params) : '';
		PushWoosh.helper(url, method, payload, lambda, lambdaerror);
	},

	sendAppOpen : function(lambda, lambdaerror) {
		var method = 'POST';
		var url = PushWoosh.baseurl + 'applicationOpen';

		var params = {
				request : {
					application : PushWoosh.appCode,
					hwid : PushWoosh.getHWId()
				}
			};

		payload = (params) ? JSON.stringify(params) : '';
		PushWoosh.helper(url, method, payload, lambda, lambdaerror);
	},

	sendPushStat : function(hashValue, lambda, lambdaerror) {
		var method = 'POST';
		var url = PushWoosh.baseurl + 'pushStat';

		var params = {
				request : {
					application : PushWoosh.appCode,
					hwid : PushWoosh.getHWId(),
					hash: hashValue
				}
			};

		payload = (params) ? JSON.stringify(params) : '';
		PushWoosh.helper(url, method, payload, lambda, lambdaerror);
	},

	setTags : function(tagsJsonObject, lambda, lambdaerror) {
		var method = 'POST';
		var url = PushWoosh.baseurl + 'setTags';

		var params = {
				request : {
					application : PushWoosh.appCode,
					hwid : PushWoosh.getHWId(),
					tags: tagsJsonObject
				}
			};

		payload = (params) ? JSON.stringify(params) : '';
		PushWoosh.helper(url, method, payload, lambda, lambdaerror);
	},

	helper : function(url, method, params, lambda, lambdaerror) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) { //Request complete !!
				if(xhr.status == 200) {
					if(lambda) lambda(xhr.responseText);
				}
				else {
					if(lambdaerror) lambdaerror(xhr.responseText);
				}
			}
		};

		// open the client
		xhr.open(method, url, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		// send the data
		xhr.send(params);
	}
};

PushWoosh.baseurl = 'https://cp.pushwoosh.com/json/1.3/';
