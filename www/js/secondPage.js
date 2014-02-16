function done(){
	var userName=document.getElementById('userInput').value;
	var time=document.getElementById('timeInput').value;
	window.localStorage.setItem("name", userName);
	window.localStorage.setItem("time", time);
	window.location="index.html";
}

function cancel(){
	window.location="index.html";
}