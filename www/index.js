var watchID;
var accelerometerOptions = { frequency: 2000 };  // Update every 2 seconds
accelerometerOptions.frequency = 3000; //changed my mind - now 3 seconds


//when the page is created...
$(document).on("pagecreate", "#page1", function () {
	
	//setup listener for the toggle switch
	$("#flipswitch").on("change", function() {
		
		if( $(this).val() == "on" ) startSensor();
		else if ( $(this).val() == "off" ) stopSensor();

	});
	
	//setup listener for the slider
	$("#slider").on("slidestop", function() {
		
		
		//the value from the slider is text - it needs to be turned into an integer
		var freq = parseInt($(this).val());
		
		updateFreq(freq);
	
	});
	
});


function startSensor() {
	watchID = navigator.accelerometer.watchAcceleration( accelerometerSuccess, accelerometerError, accelerometerOptions);
}


function stopSensor() {
	navigator.accelerometer.clearWatch(watchID);
			
	$('#sensorX').val("");
	$('#sensorY').val("");
	$('#sensorZ').val("");
	$('#timestamp').val("");
}

function accelerometerSuccess(acceleration) {
	
	$('#sensorX').val(acceleration.x);
	$('#sensorY').val(acceleration.y);
	$('#sensorZ').val(acceleration.z);
	$('#timestamp').val(acceleration.timestamp);

}

function accelerometerError() {
   alert('Error');
}

function updateFreq(freq) {
	//do something to update freq. here.
}



