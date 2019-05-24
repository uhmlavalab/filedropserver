//--------------------------------------------------------------------------------------------------------------------------Global vars
var debug = true;
var wsio;

//--------------------------------------------------------------------------------------------------------------------------Start wsio communcation

function initializeWS() {
	console.log("Initializing client");

	// Create a connection to server
	wsio = new WebsocketIO();
	console.log("Websocket status:" + wsio);
	wsio.open(function() {
		console.log("Websocket opened, ending addClient");
		
		wsio.emit("addClient", {});

		setupListeners(); 
	});

	wsio.on("close", function (evt) {
		alert("Lost connection");
	});


} //end initialize


//--------------------------------------------------------------------------------------------------------------------------Start wsio communcation
function setupListeners() {
	wsio.on("serverAccepted", function(data) {

		var workingDiv = document.getElementById("serverResponse");
		workingDiv.innerHTML = "Accepted by server";

	});

	wsio.on("serverConfirmCL", function(data) {

		var workingDiv = document.getElementById("serverResponse");
		workingDiv.innerHTML = data.message;

	});
}



//--------------------------------------------------------------------------------------------------------------------------Start wsio communcation
function sendInbox() {
	var workingDiv = document.getElementById("inbox");
	data = {};
	data.message = workingDiv.value;
	workingDiv.value = "";
	wsio.emit("consoleLog", data);

}


