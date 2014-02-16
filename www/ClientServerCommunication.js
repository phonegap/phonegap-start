user = "Michael"
plat = "OSX"
platVer = "7.1"
uuid = "The Woz"//We're off to see the wizard,The wonderful wizard of Woz.
secret = "blowfish321@"
serverAddr = "10.0.6.20:5000"

//Cancels the request
function killKarma()
{
	$.get(
		"http://" + serverAddr + "/killKarma/" + uuid + "/" + secret,
		function(data) {
			//success or failure
			//failure is unimportant
			alert('page content: ' + data)
	})
}
//This is the opens a request for karma
function requestKarma()
{
	$.get(
		"http://" + serverAddr + "/requestKarma/" + uuid + "/" + user + "/" + plat + "/" + platVer + "/" + secret,
		function(data) {
			//success or failure
			//failure matters
			alert('page content: ' + data)
	})
}
//User says"I got dis!" and goes to open the door
//@param filledUUID is the UUID of the person requesting Karma
function fillKarma(filledUUID)
{
	$.get(
		"http://" + serverAddr + "/fillKarma/" + filledUUID + "/" + uuid + "/" + user + "/" + plat + "/" + platVer + "/" + secret,
		function(data) {
			//success or failure
			//failure means something
			alert('page content: ' + data)
	})
}
//signals user is ready to open the door
function readyKarma()
{
	$.get(
		"http://" + serverAddr + "/readyKarma/" + uuid + "/" + user + "/" + secret,
		function(data) {
			//success or failure
			//failure is important
			alert('my hands are typing words: ' + data)
	})
}
// signals that user is no longer available for door openage
function unreadyKarma()
{
	$.get(
		"http://" + serverAddr + "/unreadyKarma/" + uuid + "/" + user + "/" + secret,
		function(data) {
			//success or failure
			//failure shouldn't particularly matter
			alert('words are coming out: ' + data)
	})
}
//Returns list of waiting users
function userlistKarma()
{
	$.get(
		"http://" + serverAddr + "/userListKarma/" + secret,
		function(data) {
			//we should be expecting a JSON formatted list back
			alert('and now they form sentences: ' + data)
	})
}
// called when ready to receive karma to see if it is on its way
function waitingPollKarma() {
	$.get(
		"http://" + serverAddr + "/waitingPollKarma/" + secret,
		function(data) {
			//success or failure
			//repeated failure matters
			alert('and now data arrives: ' + data)
	})
}
// called when ready to give karma to see if tasks need to be done
function readyPollKarma() {
	$.get(
		"http://" + serverAddr + "/readyPollKarma/" + secret,
		function(data) {
			//success or failure
			//repeated failure matters
			alert('and we complete the cuuuuube: ' + data)
	})
}
//polls for global messages
function messagePollKarma() {
	$.get(
		"http://" + serverAddr + "/messagePollKarma/" + secret,
		function(data) {
			//success or failure
			//failure is the default state
			//success indicates a message
			alert('and they healed :) ' + data)
	})
}
//Test code
/*
funcs = [
	requestKarma,
	function() {fillKarma(uuid)},
]

for(var i = 0; i < funcs.length; i++) {
	setTimeout(funcs[i], 1000 * i)
}*/





//It was at this point the lobsters ascended!