//---------------------------------------------------------------------------Imports
// Node default
var path  = require("path");
// Files
var utils = require("./src/utils");







//---------------------------------------------------------------------------Configuration
// Edit here to change values

// Which port to listen on.
global.port = 9002;

// global.destinationFolder = "uploads"; // Local to folder
global.destinationFolder = path.join(utils.getHomeDirectory(), "Documents", "zipdrop");



