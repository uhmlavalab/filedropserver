/*
Use config to specify additional locations to upload

alternativeLocations is an array holding upload site
	Array of objects
		description: "string to show in webpage"
		hostnamess: [
			"array of strings",
			"if involves multiple site upload",
			"for one site, just put one string"
		]
*/
var config = {
	alternativeLocations: [
		{
			// Special case for HOSTEDLOCATION, which gets automatically swapped out.
			description: "HOSTEDLOCATION",
			hostnames: ["HOSTEDLOCATION"],
			port: "HOSTEDLOCATION",
		},
		{
			description: "Makani",
			hostnames: ["http://makani.manoa.hawaii.edu:9002"],
		},
		{
			description: "Lono",
			hostnames: ["http://lono.manoa.hawaii.edu:9002"],
		},
		{
			description: "Test two sites: Makani and Lono",
			hostnames: [
				"http://makani.manoa.hawaii.edu:9002",
				"http://lono.manoa.hawaii.edu:9002"],
		},
		{
			description: "Test with localhost 9001 (usually from file or alt server)",
			hostnames: ["http://localhost"],
			port: 9001,
		},
	],
};