//---------------------------------------------------------------------------Imports
//node built in
var http        = require("http");
//npm required, defined in package.json
var WebSocketIO = require("websocketio");
//var json5     = require("json5"); //for later

var httpServer  = require("./src/httpServer");
var utils       = require("./src/utils");
var gcSetup     = require("./src/globalsAndConstants");
var configSetup = require("./config.js");

//---------------------------------------------------------------------------WebServer variables
var webVars = {};
	webVars.port        = global.port; // See /config.js
	webVars.httpServer  = new httpServer("public");
	webVars.mainServer  = null;
	webVars.wsioServer  = null;
	webVars.clients     = []; //used to contain the wsio connections

var clientData = []; //any additional data as necessary for clients.

//---------------------------------------------------------------------------debug options setup
gcSetup.initialize(); //check the file for specific debug options.

//--------------------------------------------------------------------------------------------------------------------------Start webserver
//create http listener
webVars.mainServer = http.createServer( webVars.httpServer.onrequest ).listen( webVars.port );
utils.debugPrint("Server started, listening on port:" + webVars.port, "http"); //only print if http debug is enabled.

//create ws listener
webVars.wsioServer = new WebSocketIO.Server( { server: webVars.mainServer } );
webVars.wsioServer.onconnection(openWebSocketClient);
//At this point the basic web server is online.




// //create timer counter in global. 
// global.timeCounter = 0;
// setInterval( function () {
// 		global.timeCounter++;
// 		console.log(global.timeCounter * 5);
// 	 }
// 	, 5000); 
// startTime = timeObject.getTime();
// deltaTime = 0;
//global.printTimeCounter = function printTimeCounter (req) { console.log ( "Request at time:" + global.timeCounter ); }

// //Call the mainUpdater function.
// setInterval( mainUpdater, 20); //ms. 20 = 50fps.












//--------------------------------------------------------------------------------------------------------------------------WebSocket(ws) related functions 
//If there is no websocket communication, the rest can be ignored.

/*
Called whenever a connection is made.
This happens on first contact through webpage entry. Regardless of if the client sends a packet.
*/
function openWebSocketClient(wsio) {
	utils.debugPrint( ">Connection from: " + wsio.id + " (" + wsio.clientType + " " + wsio.clientID+ ")", "wsio");
	wsio.onclose(closeWebSocketClient);
	wsio.on("addClient", wsAddClient);
}

/*
Cleanup for when a connection closes.
TODO
This isn"t complete. The necessary effects change depending on what types of services the server is for.
*/
function closeWebSocketClient(wsio) {
	utils.debugPrint( ">Disconnect" + wsio.id + " (" + wsio.clientType + " " + wsio.clientID+ ")", "wsio");

	utils.removeArrayElement(webVars.clients, wsio);
} //end closeWebSocketClient

/*
The "addClient" packet is the first packet that the client must send in order to be recognized by this server.
@param wsio is the websocket that was used.
@param data is the sent packet, in json format.
TODO
Additional effects may be needed, again depending on the services.
*/
function wsAddClient(wsio, data) {
	utils.debugPrint("addClient packet received", "wsio");

	webVars.clients.push(wsio); 		//Good to remember who is connected.
	setupListeners(wsio); 				//setup the other wsio packets necessary for the services.
	wsio.emit("serverAccepted", {} ); 	//generally need to confirm that the server OK"d the wsio connection
}

/*
When receiving a packet of the named type, call the function.
*/
function setupListeners(wsio) {
	wsio.on("consoleLog",				wsConsoleLog); //basic tester packet
} //end setupListeners

function wsConsoleLog(wsio, data) {
	utils.consolePrint(data.message); //assumes there is a message property in the packet.
	data.message = "Server confirms:" + data.message;
	wsio.emit("serverConfirmCL", data);
}


