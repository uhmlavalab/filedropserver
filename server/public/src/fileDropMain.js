
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// Globals and init

var fileDragSettings = {
	lastUpdate: null,
	dropZoneRemoveChecker: null,
	delay: 2000,
};

window.addEventListener("dragover", handleDragOver);
window.addEventListener("drop", (e) => { e.preventDefault(); });
dropZone.addEventListener("dragover", handleDragOver);

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// Functions after this

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
	if (e.dataTransfer.items) {
		alert("e.dataTransfer.items");
	} 
	if (e.dataTransfer.files){
		alert("e.dataTransfer.files");
	} else {
		alert("Dunno what was dropped check the console.");
		console.log(e.dataTransfer);
	}
}
