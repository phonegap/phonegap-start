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
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function tchange(){
	console.log('nailed it');
	if(window.localStorage.getItem("name") !=null && window.localStorage.getItem("time")!=null){
		if(document.getElementById('inPls').innerHTML==='Let Me In'){
			document.getElementById('inPls').innerHTML='Cancel Karma';
			document.getElementById('check').innerHTML='Karma Recived';
			requestKarma();
		}else if(document.getElementById('inPls').innerHTML==='Cancel Karma'){
			document.getElementById('inPls').innerHTML='Let Me In';
			document.getElementById('check').innerHTML='Check In';
			killKarma();
		}else if(document.getElementById('inPls').innerHTML==='Answer Karma'){
			fillKarma(device.uuid);
		}
	}else{
		alert("Please set up username and time in the settings");
	}
}

function bchange(){
	if(window.localStorage.getItem("name") !=null && window.localStorage.getItem("time") !=null){
		if(document.getElementById('check').innerHTML==='Check In'){
			document.getElementById('check').innerHTML='Check Out';
			document.getElementById('inPls').innerHTML='Answer Karma';
			readyKarma();
		}else if(document.getElementById('check').innerHTML==='Check Out'){
			document.getElementById('check').innerHTML='Check In';
			document.getElementById('inPls').innerHTML='Let Me In';
			unreadyKarma();
		}else if(document.getElementById('check').innerHTML==='Karma Recived'){
			document.getElementById('inPls').innerHTML='Let Me In';
			document.getElementById('check').innerHTML='Check In';
		}
	}else{
		alert("Please set up username and time in the settings");
	}
}

function mchange(){
	console.log('nailed it');
	window.location="secondPage.html";
}

var tButton = document.getElementById('inPls');
if(tButton.addEventListener){
	tButton.addEventListener("click", tchange, false);
}else if(tButton.attachEvent){
	tButton.attachEvent('onclick', tchange);
}

var bButton = document.getElementById('check');
if(bButton.addEventListener){
	bButton.addEventListener("click", bchange, false);
}else if(tButton.attachEvent){
	bButton.attachEvent('onclick', bchange);
}

var mClick = document.getElementById("menu");

if(mClick.addEventListener){
	mClick.addEventListener("click", mchange, false);
}else if(mClick.attachEvent){
	mClick.attachEvent('onclick', mchange);
}