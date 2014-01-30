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
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
        var xhr = new XMLHttpRequest();
         xhr.open('GET', 'https://api.github.com/legacy/repos/search/javascript', true);
          // Response handlers.
          xhr.onload = function () {
             var repos = JSON.parse(xhr.response), i, reposHTML = "";
             for (i = 0; i < repos.repositories.length; i++) {
                reposHTML += "<p><a href='https://github.com/" + repos.repositories[i].username + "/" + repos.repositories[i].name + "'>" + repos.repositories[i].name + "</a><br>" + repos.repositories[i].description + "</p>";
             }
             document.getElementById("allRepos").innerHTML = reposHTML;
          };
           
          xhr.onerror = function () {
             alert('error making the request.');
          };
           
        xhr.send();
    }
};
