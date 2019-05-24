"use strict";

var fs     = require("fs");                  // filesystem access

//---------------------------------------------------------------------------------------------------------------------------------------------File functions
//---------------------------------------------------------------------------------------------------------------------------------------------

/*
Test if file is exists and readable.
Returns true if exists and can read. Otherwise false.
 */
function doesFileExist(filename) {
	try {
		fs.accessSync(filename, fs.R_OK); //check if file can be read. Note ONLY checks if Node has read access.
		return true;
	} catch (err) {
		return false;
	}
}

function doesFolderExist(foldername) {
	return fs.existsSync(foldername);
}



function getHomeDirectory() {
	return process.env[ (process.platform === "win32") ? "USERPROFILE" : "HOME"];
}



//---------------------------------------------------------------------------------------------------------------------------------------------Console and Debug functions
//---------------------------------------------------------------------------------------------------------------------------------------------
function consolePrint(stringToPrint) {

	//this will be filled with other things later. Like actual file logging when I get around to it.

	console.log(stringToPrint);
}

/*
Only print if debug is active.
@param stringToPrint what will be printed
@param condition that property of the debug option must be true to print.
*/
function debugPrint(stringToPrint, condition) {
	var shouldPrint = false;

	if (arguments.length > 2) {
		console.log(arguments);
	} else if ( (arguments.length == 2) && (typeof condition !== "string")) {
		console.log(arguments);
	}

	if(condition === null && global.debug.general) { shouldPrint = true; }
	else if( global.debug[(""+condition)] === true) { shouldPrint = true;}

	if(shouldPrint) { consolePrint( "Debug:" + condition + ">" + stringToPrint); }
}


//---------------------------------------------------------------------------------------------------------------------------------------------List (array) functions
//---------------------------------------------------------------------------------------------------------------------------------------------

/*
Given a list, remove the specified element if it is in there.
Returns true if element was removed. Otherwise false
 */
function removeElement(list, elem) {
	if(list.indexOf(elem) >= 0){
		moveElementToEnd(list, elem);
		list.pop();
		return true;
	}
	return false;
}

/*
If the given list contains the given element, moves the element to the end.
Returns true if was able to move. Otherwise false.
 */
function moveElementToEnd(list, elem) {
	var i;
	var pos = list.indexOf(elem);

	if(pos < 0) { return false; }

	for(i=pos; i<list.length-1; i++){
		list[i] = list[i+1];
	}
	list[list.length-1] = elem;
	return true;
}

//---------------------------------------------------------------------------------------------------------------------------------------------Rectangle functions
//---------------------------------------------------------------------------------------------------------------------------------------------
/*
Takes two objects with attributes
cx, cy, width, height.
*/
function isSecondRectangleWithinFirst(firstRect, secondRect) {

	if( firstRect.cx - firstRect.width/2 < secondRect.cx - secondRect.width/2 ) {
		if(firstRect.cx + firstRect.width/2 > secondRect.cx + secondRect.width/2) {

			if(firstRect.cy - firstRect.height/2 < secondRect.cy - secondRect.height/2) {
				if(firstRect.cy + firstRect.height/2 > secondRect.cy + secondRect.height/2) {

					return true;

				}
			}

		}
	}

	return false;

} //end


/*
Takes two objects with attributes
cx, cy, width, height.
*/
function areRectanglesTouching(firstRect, secondRect) {

	if( firstRect.cx - firstRect.width/2 <= secondRect.cx + secondRect.width/2 ) {
		if(firstRect.cx + firstRect.width/2 >= secondRect.cx - secondRect.width/2) {

			if(firstRect.cy - firstRect.height/2 <= secondRect.cy + secondRect.height/2) {
				if(firstRect.cy + firstRect.height/2 >= secondRect.cy - secondRect.height/2) {

					return true;

				}
			}
		}
	}
	return false;
} //end



exports.doesFileExist                = doesFileExist;
exports.doesFolderExist              = doesFolderExist;
exports.getHomeDirectory             = getHomeDirectory;
exports.consolePrint                 = consolePrint;
exports.debugPrint                   = debugPrint;
exports.removeArrayElement           = removeElement;
exports.moveArrayElementToEnd        = moveElementToEnd;
exports.isSecondRectangleWithinFirst = isSecondRectangleWithinFirst;
exports.areRectanglesTouching        = areRectanglesTouching;



