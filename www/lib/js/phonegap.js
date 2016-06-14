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

var connectionStatus;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        document.addEventListener('offline', app.onOffline, false);
        document.addEventListener('online', app.onOnline, false);
    },

    onPrompt: function (result) {
        // alert(result);
    },

    // offline Event Handler
    onOffline: function() {
        if('offline' !== connectionStatus){
            document.addEventListener('backbutton', app.backbutton, false);
            var $networkErrorModal = $('#networkErrorModal');
            connectionStatus = 'offline';
            if('Android' !== device.platform || parseInt(device.version) > 5){
                $networkErrorModal.find('.btn.mobile-data-settings').hide();
            }
            $networkErrorModal.modal('show');
        }
    },

    // online Event Handler
    onOnline: function() {
        if('online' !== connectionStatus) {
            document.removeEventListener('backbutton', app.backbutton, false);
            connectionStatus = 'online';
            $('#networkErrorModal').modal('hide');
        }
    },

    backbutton: function(){}

};
app.initialize();
