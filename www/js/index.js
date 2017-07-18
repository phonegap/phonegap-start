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
	document.getElementbyId('btncalculate').addEventListener('click'this.onCalculate,false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
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
	onCalculate:function(e)	{
					if(13==e.keycode)
					{
						var l=document.getElementbyId('leng').value;
						var b=document.getElementbyId('bred').value;
						if(l.length==0||b.length==0)
						document.getElementbyId('res').innerHtml= "ERROR: Please fill all the fields.";


						else if(l==0||b==0)
						document.getElementbyId('res').innerHtml= "ERROR: Please enter valid values.";	


						else
						{
							var x=parseInt(l);
							var y=parseInt(b);
							var area=x*y;
							//document.getelementbyId('res').innerHtml="Area="+area;
						}
					}
				}
		/*function (e)
		{
			if(13==e.keycode)
			{
				document.getelementbyId('res').innerHtml="Area="+area;	
			}
		}*/ 
};
