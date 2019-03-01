/*****************************/
// Ethan Feldman
// Platt Tech NASA HUNCH TEAM
/*****************************/

// Inital variables
let model;
let classifier;
let camera;
let canvas;

var w;
var h;
var cameraOptions;
var isPredicting = false;
var desData = [];


/*******************************/
// Core Features
/*******************************/

function setup() {
	
	// Disables the buttons
	able(true);
	
	// Creates the canvas to draw everything on
	w = window.innerWidth * 0.98;
	h = window.innerHeight * 0.96;
	createCanvas(w, h);
	
	// Sets up the cameraOptions
	cameraOptions = 
	{
		audio: false,
		video: 
		{
			facingMode: "environment"
		}
	};
	// Creates the capture using cameraOptions
	// IOS needs that 'playsinline' thing
	// Hides the camera, so that it can be used on the canvas instead
	camera = createCapture(cameraOptions);
	camera.elt.setAttribute('playsinline', true);
	camera.elt.setAttribute('autoplay', true);
	camera.hide();
	
	console.log("Camera was just set!");
	
	background(0);
	
	alert("Warning: If the page is black: KEEP the site, but leave your browser, then return back in.\nOlder versions of Chrome, Firefox, and Safari may not be compatible with Tensorflow.js\n\nPress the 'Info' button for instructions");
	
	// Gets the 'MobileNet' model through ml5
	// Gets the model classification libraries from ml5 and will use the camera
	model = ml5.featureExtractor('mobilenet', modelReady);
	
	// Will call modelLoad when files are loaded into the webpage
	document.getElementById('files').addEventListener('change', modelLoad, true);
}

// Called after the model is loaded
function modelReady() {
	
	console.log("Model was loaded!!!");
	
	// Gets the camera ready for object classification
	classifier = model.classification(camera, cameraReady);
}

// Called after the camera is loaded
function cameraReady() {
	
	console.log("Camera was loaded!!!");
	
	// Loads the preload
	preLoad();
}

// This will upload preloaded models into the page to begin with
function preLoad() {
	
	// Loads the txt file by XMLHttpRequest
	var rawFile = new XMLHttpRequest();
    rawFile.onreadystatechange = function ()
    {
        if(this.readyState === 4)
        {
            if(this.status === 200 || this.status == 0)
            {
				// Everything following the load must go here
				
				// Gets the data
                var data = this.responseText;
				
				// Puts into the desData
				// This will overwrite perious data in the webpage's session
				desData = data.split(",");
				
				//console.log("Preload txt:" + desData);
				
				// Loads the other files by ml5 built in functions
				classifier.load('./model/model.json', function() 
				{
					console.log("Preload was loaded!");
					
					document.getElementById("upperText").innerHTML = "Objects detected go here";
					document.getElementById('currentAmount').innerHTML = desData.length;
					
					// Enables the buttons
					able(false);
				});
            }
        }
    }
	rawFile.open("GET", "./model/model.descriptions.txt", true);
    rawFile.send(null);
}

// Starts or Stops predicting
function togglePredicting() {
	
	// Checks if it is predicting
	if (isPredicting == false)
	{
		// It is not predicting

		// Turns predicting to true
		isPredicting = true;
		
		// Changes the predict button to "Stop"
		document.getElementById('toggleButton').innerHTML = "<i class='fas fa-stop'></i> Stop";
		document.getElementById('toggleButton').style.filter = "invert(1)";
		
		console.log("Starting predicting");
		
		// Actual predicting
		classifier.classify(gotResult);
	}
	else
	{
		// It is predicting
		
		// Turns predicting to false
		isPredicting = false;
		
		// Changes the predict button to "Predict"
		document.getElementById('toggleButton').innerHTML = "<i class='fas fa-play'></i> Predict";
		document.getElementById('toggleButton').style.filter = "invert(1)";
		
		// Clears previous predictions
		document.getElementById('upperText').innerHTML = "...";
		
		console.log("Stopping predicting");
	}
}

// Predicts what's in front of your webcam
function gotResult(err, res) {
	
	// Sees if it is preicting
	if (isPredicting)
	{
		// Checks for errors
		if (err) 
		{	
			alert(err + "\nPress the 'Stop' button.");
		}
		else
		{
			// Gets the top result
			document.getElementById('upperText').innerHTML = res;
			
			findData(res);
			
			// Predicts again
			classifier.classify(gotResult);
		}
	}
}

// draws the camera to the canvas
function draw() {
	
	background(0);
	
	// Draws the camera to the canvas
	image(camera, 0, 0, w, h);
	fill(255);
}


/*******************************/
// Buttons
/*******************************/

// Intructions button
function alertInstr() {
	
	alert("1) Press the 'Predict' button to start or stop predicting objects.\n2) At the bottom, you can load models into the page by clicking the 'Choose Files' button and selecting: 'model.json', 'model.weights.bin', and 'model.descriptions.txt' all at once.");
}

// Sets & changes the camera used
function changeCamera() {
	
	alert("Work in progress");
}

/*******************************/
// Finding Data
/*******************************/

// Find the data from desData by the res from gotResult
function findData(r) {

	// Just in case
	r = r.toLowerCase();
	
	// Finds the index of the result
	var index = searchStringInArray(r, desData);
	//console.log(index);
	
	if (index != -1)
	{
		// Gets the full text
		var fullText = desData[index];
		
		// Get the position of : in the fullText
		var n = fullText.indexOf(":");
		
		// Adds 4 to get ride of ': D_'
		n = n + 4;
		
		// Prints the substring of fullText, aka, the description of the result
		document.getElementById('upperInfo').innerHTML = fullText.substr(n);
	}
	else
	{
		document.getElementById('upperInfo').innerHTML = "no description";
	}
}

// Searches the names in the array
function searchStringInArray(s, a) {
	
	//Creates the name to check for later
	var name = 'N_' + s + ':';
	//console.log("Searching for: " + name + " in array:");
	//console.log(a);
	
    for (var i = 0; i < a.length; i++) 
	{
		//console.log("a[" + i + "]: " + a[i] + ", name: " + name);
        
		if (a[i].includes(name))
		{
			return i;
		}
    }
    return -1;
}


/*******************************/
// Loading Models
/*******************************/

// You have the select the model.json, model.weights.bin, & model.descriptions.txt files into at the sametime!
function modelLoad(evt) {
	
	// Disables the buttons
	able(true);
	
	// Creates the FileList object
	var files = evt.target.files;
	
	// Checks for the certain file
	for (var i = 0, f; f = files[i]; i++) 
	{
		// Checks for a .txt file
		if (f.type.match(/text.*/))
		{
			// Checks for the name 'model.descriptions.txt'
			if (f.name.includes('model.descriptions.txt'))
			{
				var reader = new FileReader();
				
				reader.onload = function(e)
				{
					// Gets the data from the file
					var data = reader.result;
					
					// Puts into the desData
					// This will overwrite perious data in the webpage's session
					desData = data.split(",");
					
					//console.log("Text data: " + desData);
					
					document.getElementById('currentAmount').innerHTML = desData.length;
				}
				
				reader.readAsText(f);
			}
		}
	}
	
	// Loads the model
	classifier.load(files);
	
	document.getElementById('upperText').innerHTML = 'New Model was Loaded';
	console.log("New Model was Loaded!");
	
	// Enables the buttons
	able(false);
}


/*******************************/
// Extra
/*******************************/

// This will call when the window is resized
function windowResized() {

	// Gets new width and height
	w = window.innerWidth * 0.98;
	h = window.innerHeight * 0.96;
	
	// Resizes the canvas, w, and h when the user tilts the screen
	resizeCanvas(w, h);
	
	console.log("Window was resized");
}

// Becuase I disable and enable the buttons alot
function able(bool) {
	
	document.getElementById('camButton').disabled = bool;
	document.getElementById('instrButton').disabled = bool;
	document.getElementById('toggleButton').disabled = bool;
}

// Used to go to another page
function goTo(toLink) {
	
	location.href = toLink;
}

// Used to g back to the hub
function goBack() {
	
	location.href = "../index.html";
}

