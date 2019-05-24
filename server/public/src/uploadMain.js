//--------------------------------------------------------------------------------------------------------------------------Global vars
var debug = true;
var wsio;

var fileDragSettings = {
	lastUpdate: null,
	dropZoneRemoveChecker: null,
	delay: 2000,
};


//--------------------------------------------------------------------------------------------------------------------------

let uploadStatusDiv = document.getElementById("uploadStatus");

window.addEventListener("dragover", handleDragOver);
window.addEventListener("drop", (e) => { e.preventDefault(); });
dropZone.addEventListener("dragover", handleDragOver);



//--------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------
// File drop handling

function dropZoneRemoveFunction(e) {
	// If time has passed without more drag events, hide the dropzonee
	if (fileDragSettings.lastUpdate + fileDragSettings.delay > Date.now()) {
		hideDropZone();
	} else {
		fileDragSettings.dropZoneRemoveChecker = setTimeout(() => {
			dropZoneRemoveFunction();
		}, fileDragSettings.delay);
	}
}

function hideDropZone() {
	dropZone.style.left = "-100px";
	dropZone.style.top = "-100px";
	dropZone.style.width = "10px";
	dropZone.style.height = "10px";
	fileDragSettings.dropZoneRemoveChecker = null;
}



function handleDragOver(e) {
	fileDragSettings.lastUpdate = Date.now();
	dropZone.style.left = "5%";
	dropZone.style.top = "5%";
	dropZone.style.width = "90%";
	dropZone.style.height = "90%";
	if (!fileDragSettings.dropZoneRemoveChecker) {
		fileDragSettings.dropZoneRemoveChecker = setTimeout(dropZoneRemoveFunction, fileDragSettings.delay);
	}
	e.preventDefault();
}
function handleDrop(e) {
	hideDropZone();
	e.preventDefault();
	// File
	if (e.dataTransfer.files){
		// alert("e.dataTransfer.files");
		console.log(e.dataTransfer);
		var filesForUpload = event.dataTransfer.files;
		if (filesForUpload.length > 0) {
			console.log("There are files", filesForUpload);
			uploadFiles(filesForUpload);
		} else {
			console.log("Unable to upload non-files");
		}
	}
}



//--------------------------------------------------------------------------------------------------------------------------





function uploadFiles(files) {
	var loaded = {};
	var filesFinished = 0;
	var total = 0;

	// To keep track of progress
	var progressCallback = function(event) {
		console.log("---progressCallback---");
		console.log(event);
		console.log(event.target.id);
		if (loaded[event.target.id] === undefined) {
			total += event.total;
		}
		loaded[event.target.id] = event.loaded;
		var uploaded = 0;
		for (var key in loaded) {
			uploaded += loaded[key];
		}
		var pc = parseInt(
			(event.loaded / event.total)
			* 100)
			+ "%";
		uploadStatus.innerHTML = event.target.id+ ": " + pc
			+ "<br>\n" + uploadStatus.innerHTML;
	};

	var loadCallback = function(event) {
		console.log("Unsure if loadCallback triggers");
		// Get the name and type
		var sn = event.target.response.substring(event.target.response.indexOf("name: ") + 7);
		var st = event.target.response.substring(event.target.response.indexOf("type: ") + 7);
		var name = sn.substring(0, sn.indexOf("\n") - 2);
		var type = st.substring(0, st.indexOf("\n") - 2);
		// Parse the reply into JSON
		var msgFromServer;
		try {
			msgFromServer = JSON.parse(event.target.response);
		} catch (e) {
			console.log("File: " + event.target.response, e);
			return; // Needs server message to continue
		}
		// Check the return values for success/error
		Object.keys(msgFromServer.files).map(function(k) {
			console.log("Message from server: ", msgFromServer);
		});

		filesFinished++;
		console.log("File upload complete");
	};

	// Start upload
	let array_xhr = [];
	let maxUploadSize = 20 * (1024 * 1024 * 1024); // 20GB
	// Converting value to boolean
	for (var i = 0; i < files.length; i++) {
		if (files[i].size <= maxUploadSize) {
			var formdata = new FormData();
			formdata.append("file" + i.toString(), files[i]);

			var xhr = new XMLHttpRequest();
			// add the request into the array
			array_xhr.push(xhr);
			xhr.open("POST", "upload", true);
			xhr.upload.id = "file" + i.toString() + " > " + files[i].name;
			xhr.upload.addEventListener("progress", progressCallback, false);
			xhr.addEventListener("load", loadCallback, false);
			xhr.send(formdata);
		} else {
			// show message for 4 seconds
			console.log("File: " + files[i].name + " is too large (max size is " +
				(maxUploadSize / (1024 * 1024 * 1024)) + " GB)");
		}
	}
};
