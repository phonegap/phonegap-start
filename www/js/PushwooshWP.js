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

function registerPushwooshWP() {
    var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

    //set push notification callback before we initialize the plugin
    document.addEventListener('push-notification', function (event) {
        //get the notification payload
        var notification = event.notification;

        //display alert to the user for example
        alert(JSON.stringify(notification));
    });

    //initialize the plugin
    pushNotification.onDeviceReady({ appid: "3A43A-A3EAB", serviceName: "" });

    //register for pushes
    pushNotification.registerDevice(
        function (status) {
            var deviceToken = status;
            console.warn('registerDevice: ' + deviceToken);
            alert("push token is " + deviceToken);
            onPushwooshWPInitialized();
        },
        function (status) {
            console.warn('failed to register : ' + JSON.stringify(status));
            alert(JSON.stringify(['failed to register ', status]));
        }
    );
}

function onPushwooshWPInitialized()
{
    var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

    //if you need push token at a later time you can always get it from Pushwoosh plugin
    pushNotification.getPushToken(
        function (token) {
            alert('push token: ' + token);
        }
    );

    //and HWID if you want to communicate with Pushwoosh API
    pushNotification.getPushwooshHWID(
        function (token) {
            alert('Pushwoosh HWID: ' + token);
        }
    );

    //settings tags
    pushNotification.setTags({ tagName: "tagValue", intTagName: 10 },
        function (status) {
            alert('setTags success: ' + JSON.stringify(status));
        },
        function (status) {
            console.warn('setTags failed');
        }
    );

    pushNotification.getTags(
        function (status) {
            alert('getTags success: ' + JSON.stringify(status));
        },
        function (status) {
            console.warn('getTags failed');
        }
    );
}
