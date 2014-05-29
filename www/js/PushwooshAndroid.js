/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function registerPushwooshAndroid() {

 	var pushNotification = window.plugins.pushNotification;

	//set push notifications handler
	document.addEventListener('push-notification',
		function(event)
		{
            var title = event.notification.title;
            var userData = event.notification.userdata;

            //dump custom data to the console if it exists
            if(typeof(userData) != "undefined") {
				console.warn('user data: ' + JSON.stringify(userData));
			}

			//and show alert
			alert(title);

			//stopping geopushes
			pushNotification.stopGeoPushes();
		}
	);

	//trigger pending push notifications
	pushNotification.onDeviceReady();

	//register for pushes.
	//!!! Please note this is an API for PGB plugin. This code is different in CLI plugin!!!
	//At the moment I cannot update the plugin to the latest version. TY PGB Team!
	//see http://community.phonegap.com/nitobi/topics/malformed_xml_in_plugin_xml_file?utm_source=notification&utm_medium=email&utm_campaign=new_reply&utm_content=reply_button&reply%5Bid%5D=14224918#reply_14224918
	pushNotification.registerDevice({ projectid: "60756016005", appid : "539E9-AB8AE" },
		function(token)
		{
			alert(token);
			//callback when pushwoosh is ready
			onPushwooshAndroidInitialized(token);
		},
		function(status)
		{
			alert("failed to register: " +  status);
		    console.warn(JSON.stringify(['failed to register ', status]));
		}
	);
}

function onPushwooshAndroidInitialized(pushToken)
{
	//output the token to the console
	console.warn('push token: ' + pushToken);

	var pushNotification = window.plugins.pushNotification;
	
	pushNotification.getTags(
		function(tags)
		{
			console.warn('tags for the device: ' + JSON.stringify(tags));
		},
		function(error)
		{
			console.warn('get tags error: ' + JSON.stringify(error));
		}
	);
	 

	//set multi notificaiton mode
	//pushNotification.setMultiNotificationMode();
	//pushNotification.setEnableLED(true);
	
	//set single notification mode
	//pushNotification.setSingleNotificationMode();
	
	//disable sound and vibration
	//pushNotification.setSoundType(1);
	//pushNotification.setVibrateType(1);
	
	pushNotification.setLightScreenOnNotification(false);
	
	//goal with count
	//pushNotification.sendGoalAchieved({goal:'purchase', count:3});
	
	//goal with no count
	//pushNotification.sendGoalAchieved({goal:'registration'});

	//setting list tags
	//pushNotification.setTags({"MyTag":["hello", "world"]});
	
	//settings tags
	pushNotification.setTags({deviceName:"hello", deviceId:10},
		function(status) {
			console.warn('setTags success');
		},
		function(status) {
			console.warn('setTags failed');
		}
	);

	//Pushwoosh Android specific method that cares for the battery
	pushNotification.startGeoPushes();
}
