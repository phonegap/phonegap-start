var globals = {};

globals.debugAlert = function(input) {
	var output = "[" + (typeof input) + "] ";
	
	if (input instanceof Object) {
		output += " | "
		for(var element in input) {
			output += element + " | ";
		}
	} else {
		output += input;
	}
	
	alert(output);
}

globals.nativeAlert = function (message, title) {
	if (navigator.notification) {
		navigator.notification.alert(message, null, title, 'OK');
	} else {
		alert(title ? (title + ": " + message) : message);
	}
}
