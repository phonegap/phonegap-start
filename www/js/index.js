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
	if(window.localStorage.getItem("name") !=null && window.localStorage.getItem("time")!=null){
		if(document.getElementById('inPls').innerHTML==='Let Me In'){
			document.getElementById('inPls').innerHTML='Cancel Karma';
			document.getElementById('check').innerHTML='Karma Recived';
			rR = true;
			requestKarma(function(data){
				
			});
		}else if(document.getElementById('inPls').innerHTML==='Cancel Karma'){
			document.getElementById('inPls').innerHTML='Let Me In';
			document.getElementById('check').innerHTML='Check In';
			rR = false;
			killKarma(function(data){
			
			});
		}else if(document.getElementById('inPls').innerHTML==='Answer Karma'){
			if(ul.firstChild != null){
				fillKarma(ul.firstChild.innerHTML, function(data){
			});
			}
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
			rG = true;
			readyKarma(function(data){
			
			});
		}else if(document.getElementById('check').innerHTML==='Check Out'){
			document.getElementById('check').innerHTML='Check In';
			document.getElementById('inPls').innerHTML='Let Me In';
			rG = false;
			unreadyKarma(function(data){
			
			});
		}else if(document.getElementById('check').innerHTML==='Karma Recived'){
			document.getElementById('inPls').innerHTML='Let Me In';
			document.getElementById('check').innerHTML='Check In';
			rR = false;
		}
	}else{
		alert("Please set up username and time in the settings");
	}
}

function mchange(){
	window.location="secondPage.html";
}
function pchange(){
	$("#navi").toggleClass("expanded-nav");
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

var pClick = document.getElementById("people");
if(pClick.addEventListener){
	pClick.addEventListener("click", pchange, false);
}else if(pClick.attachEvent){
	pClick.attachEvent('onclick', pchange);
}
var ul= document.getElementById("listPeople");
var rR = false;
var rG = false;
var myVar = setInterval(function(){myTimer()}, Math.abs(window.localStorage.getItem("time") * 1000));
function myTimer(){
	if(window.localStorage.getItem("changeTime")){
		stopTimer(myVar);
		window.localStorage.setItem("changeTime", false);
		myVar = setInterval(function(){myTimer()},Math.abs(window.localStorage.getItem("time")) * 1000);
	}
	if(rR){
		waitingPollKarma(function(data){
		console.log(data);
			if(JSON.parse(data).onTheWay)
			{
				alert("Someone is on the way!");
			}
		});
	}
	if(rG){
		userlistKarma(function(data){
		console.log(data);
		
		var people=JSON.parse(data).tickets;
		while(ul.firstChild)
		{
			ul.removeChild(ul.firstChild);
		}

		for(var i=0; i<people.length;i++)
		{
			var temp=document.createElement(people[i]);
			ul.appendChild(temp);
			temp.innerHTML=people[i];
		}
		});
		readyPollKarma(function(data){
		console.log(data);
		
		});
	}
}

var sysM = setInterval(function(){sysTimer()}, 60000);
function sysTimer(){
	messagePollKarma(function(data){
		console.log(data);
		console.log(JSON.parse(data).message);
		alert("System message: " + JSON.parse(data).message);
	});
}

function stopTimer(thing){
	clearInterval(thing);
}
