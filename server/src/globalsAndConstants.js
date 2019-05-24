"use strict";

function setupGlobals() {

}

function setupDebug() {
	global.debug 			= {};
	global.debug.general	= true;
	global.debug.http		= true;
	global.debug.wsio		= true;
}

function setupConstants() {

}

function initialize() {
	setupGlobals();
	setupDebug();
	setupConstants();
}

exports.initialize = initialize;
