
"use strict";

//node basic
var url 	= require("url");
var fs 		= require("fs");
var path  = require("path");
//npm required
var mime 	     = require("mime");
var Formidable = require("formidable"); // upload assist
//
var utils 	= require("./utils");


/*
Create a server given public directory.
*/
function HttpServer(publicDirectory) {
	this.publicDirectory = publicDirectory;
	this.onrequest = this.onreq.bind(this); //not sure why/what this is for
}

/*
Process http requests.
@param req is the request packet
@param res is the response stream. I think.

Currently only handles GET requests.
*/
HttpServer.prototype.onreq = function(req, res) {

	if (req.method === "GET") {
		var reqURL = url.parse(req.url); //parse url into a json object with parts as fields
		var getName = decodeURIComponent(reqURL.pathname);

		utils.debugPrint("Request for:" + getName, "http");

		// redirect root path to index.html
		if (getName === "/") {
			this.redirect(res, "index.html");
			return;
		}

		//get the path with relation to server file system.
		var requestPath = this.publicDirectory + getName;
		utils.debugPrint("full request path:" + requestPath, "http");

		var stats;
		if( utils.doesFileExist(requestPath) ) {
			//get information about the requested path item. (ie: is it a folder, file, etc.)
			stats = fs.lstatSync(requestPath);
		}
		else {
			stats = null;
		}
		if(stats != null) {
			if (stats.isDirectory()) {
				this.redirect(res, getName+"/index.html"); //prevent directory snooping
				return;
			} else { //else give back the file

				var header = {};
				header["Content-Type"] = mime.lookup(requestPath);
				header["Access-Control-Allow-Headers" ] = "Range";
				header["Access-Control-Expose-Headers"] = "Accept-Ranges, Content-Encoding, Content-Length, Content-Range";

				if (req.headers.origin !== undefined) {
					header["Access-Control-Allow-Origin" ]     = req.headers.origin;
					header["Access-Control-Allow-Methods"]     = "GET";
					header["Access-Control-Allow-Headers"]     = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
					header["Access-Control-Allow-Credentials"] = true;
				}

				var total = stats.size;
				var stream;
				if (typeof req.headers.range !== "undefined") {
					var range = req.headers.range;
					var parts = range.replace(/bytes=/, "").split("-");
					var partialstart = parts[0];
					var partialend   = parts[1];

					var start = parseInt(partialstart, 10);
					var end = partialend ? parseInt(partialend, 10) : total-1;
					var chunksize = (end-start)+1;

					header["Content-Range"]  = "bytes " + start + "-" + end + "/" + total;
					header["Accept-Ranges"]  = "bytes";
					header["Content-Length"] = chunksize;

					res.writeHead(206, header);

					stream = fs.createReadStream(requestPath, {start: start, end: end});
					stream.pipe(res);
				}
				else {
					header["Content-Length"] = total;
					res.writeHead(200, header);
					stream = fs.createReadStream(requestPath);
					stream.pipe(res);
				}
			} //end else must be a directory
		} //end if has stats
		else {
			// File not found: 404 HTTP error, with link to index page
			res.writeHead(404, {"Content-Type": "text/html"});
			res.write("<h1>Page path not found</h1>\n\n");
			res.end();
			return;
		}
	}//end if req.method == get
	else if (req.method === "POST") {
		





















		var postName = url.parse(req.url).pathname;

		var form     = new Formidable.IncomingForm();
		// Limits the amount of memory all fields together (except files) can allocate in bytes.
		//    set to 4MB.
		form.maxFieldsSize = 4 * 1024 * 1024;
		// Maybe need to increase due to default.
		// Default is 2MB https://github.com/felixge/node-Formidable/commit/39f27f29b2824c21d0d9b8e85bcbb5fc0081beaf
		form.maxFileSize = 20 * (1024 * 1024 * 1024); // 20GB to match the client side upload
		form.type          = "multipart";
		form.multiples     = true;
	
		form.on("fileBegin", function(name, file) {
			utils.debugPrint("Upload initiated");
		});
	
		form.on("error", function(err) {
			console.log("Error during upload", err);
		});
	
		form.on("field", function(field, value) {
			// // Keep user information
			// if (field === "ptrName") {
			// 	ptrName = value;
			// 	utils.debugprint("Upload", "by", ptrName);
			// }
		});
	
		form.parse(req, function(err, fields, files) {
			var header = HttpServer.prototype.buildHeader();
			if (err) {
				header["Content-Type"] = "text/plain";
				res.writeHead(500, header);
				res.write(err + "\n\n");
				res.end();
				return;
			}
			// build the reply to the upload
			header["Content-Type"] = "application/json";
			res.writeHead(200, header);
			// For webix uploader: status: server
			fields.done = true;
	
			// Get the file (only one even if multiple drops, it comes one by one)
			var file = files[ Object.keys(files)[0] ];
			utils.debugPrint("parsing file: " + file);
			// Send the reply
			res.end(JSON.stringify({status: "server",
				fields: fields, files: files}));
		});
	
		form.on("end", function() {
			// This magical variable, openedFiles is part of the Formidable. "this" is the form
			utils.debugPrint("Form upload ended", this.openedFiles);
			HttpServer.prototype.putUploadedFilesInCorrectSpot(this.openedFiles);
		});
		



























	} else {
		// File not found: 404 HTTP error, with link to index page
		res.writeHead(404, {"Content-Type": "text/html"});
		res.write("<h1>Not a get request</h1>\n\n");
		res.end();
		return;
	}

};



/*
*/
HttpServer.prototype.putUploadedFilesInCorrectSpot = function(files) {

	utils.debugPrint("Need to move the file to a correct location at this point in time");

	// First make sure directory destination exists
	// global.destinationFolder defined in config.js
	let directoryDestination = global.destinationFolder;
	if (!utils.doesFolderExist(directoryDestination)) {
		fs.mkdirSync(directoryDestination);
	}

	// Now move the file to directory
	let fileKeys = Object.keys(files);
	let file, fileDestinationPath;
	for (let i = 0; i < fileKeys.length; i++) {
		file = files[fileKeys[i]];

		// Could do cleaning on file name...
		// file.name.replace(/[$%^&()"`\\/]/g, "_");
		
		// Move file 
		fileDestinationPath = path.join(directoryDestination, file.name);
		fs.renameSync(file.path, fileDestinationPath);
		
		utils.debugPrint("Should be done moving: ", fileDestinationPath, "Progress: ", i + 1, "/", fileKeys.length);
	}
};





/**
 * Handle a HTTP redirect
 *
 * @method redirect
 * @param res {Object} response
 * @param aurl {String} destination URL
 */
HttpServer.prototype.redirect = function(res, aurl) {
	// 302 HTTP code for redirect
	res.writeHead(302, {"Location": aurl});
	res.end();
};










/**
 * Build an HTTP header object.
 *
 * @method buildHeader
 * @return {Object} an object containig common HTTP header values
 */
HttpServer.prototype.buildHeader = function() {
	// Get the site configuration, from server.js
	var cfg = global.config;
	// Build the header object
	var header = {};

	// Default datatype of the response
	header["Content-Type"] = "text/html; charset=utf-8";

	// The X-Frame-Options header can be used to to indicate whether a browser is allowed
	// to render a page within an <iframe> element or not. This is helpful to prevent clickjacking
	// attacks by ensuring your content is not embedded within other sites.
	// See more here: https://developer.mozilla.org/en-US/docs/HTTP/X-Frame-Options.
	// "SAMEORIGIN" or "DENY" for instance
	header["X-Frame-Options"] = "SAMEORIGIN";

	// This header enables the Cross-site scripting (XSS) filter built into most recent web browsers.
	// It's usually enabled by default anyway, so the role of this header is to re-enable the filter
	// for this particular website if it was disabled by the user.
	// This header is supported in IE 8+, and in Chrome.
	header["X-XSS-Protection"] = "1; mode=block";

	// The only defined value, "nosniff", prevents Internet Explorer and Google Chrome from MIME-sniffing
	// a response away from the declared content-type. This also applies to Google Chrome, when downloading
	// extensions. This reduces exposure to drive-by download attacks and sites serving user uploaded content
	// that, by clever naming, could be treated by MSIE as executable or dynamic HTML files.
	header["X-Content-Type-Options"] = "nosniff";


	return header;
};

module.exports = HttpServer;


