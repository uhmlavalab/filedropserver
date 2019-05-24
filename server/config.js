//---------------------------------------------------------------------------Imports
// Node default
var path  = require("path");
// Files
var utils = require("./src/utils");







//---------------------------------------------------------------------------Configuration
// Edit here to change values


// global.destinationFolder = "uploads"; // Local to folder
global.destinationFolder = path.join(utils.getHomeDirectory(), "Documents", "zipdrop");



