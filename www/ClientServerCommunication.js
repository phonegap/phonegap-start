user = window.localStorage.getItem('name')
plat = "OSX"
platVer = "7.1"
uuid = "The Woz"//We're off to see the wizard,The wonderful wizard of Woz.
secret = window.localStorage.getItem('secret')
serverAddr = window.localStorage.getItem('serverIP')
console.log(serverAddr)
if ( serverAddr == null || serverAddr == "" )
{
	serverAddr = "10.0.6.20:5000"
}

//Cancels the request
function killKarma(callback)
{
	$.get(
		"http://" + serverAddr + "/killKarma/" + uuid + "/" + secret,
		callback
	)
}
//This is the opens a request for karma
function requestKarma(callback)
{
	$.get(
		"http://" + serverAddr + "/requestKarma/" + uuid + "/" + user + "/" + plat + "/" + platVer + "/" + secret,
		callback
	)
}
//User says"I got dis!" and goes to open the door
//@param filledUUID is the UUID of the person requesting Karma
function fillKarma(filledUUID, callback)
{
	$.get(
		"http://" + serverAddr + "/fillKarma/" + filledUUID + "/" + uuid + "/" + user + "/" + plat + "/" + platVer + "/" + secret,
		callback
	)
}
//signals user is ready to open the door
function readyKarma(callback)
{
	$.get(
		"http://" + serverAddr + "/readyKarma/" + uuid + "/" + user + "/" + secret,
		callback
	)
}
// signals that user is no longer available for door openage
function unreadyKarma(callback)
{
	$.get(
		"http://" + serverAddr + "/unreadyKarma/" + uuid + "/" + user + "/" + secret,
		callback
	)
}
//Returns list of waiting users
function userlistKarma(callback)
{
	$.get(
		"http://" + serverAddr + "/userListKarma/" + secret,
		callback
	)
}
// called when ready to receive karma to see if it is on its way
function waitingPollKarma(callback) {
	$.get(
		"http://" + serverAddr + "/waitingPollKarma/" + secret,
		callback
	)
}
// called when ready to give karma to see if tasks need to be done
function readyPollKarma(callback) {
	$.get(
		"http://" + serverAddr + "/readyPollKarma/" + secret,
		callback
	)
}
//polls for global messages
function messagePollKarma(callback) {
	$.get(
		"http://" + serverAddr + "/messagePollKarma/" + secret,
		callback
	)
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
