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
var isPredicting;
var desData = [];


/*******************************/
// Core Features
/*******************************/

function setup() {
	
	// Disables the buttons
	able(true);
	
	// Sets up some variables
	isPredicting = false;
	
	// Sets up the cameraOptions
	cameraOptions = 
	{
		audio: false,
		video: 
		{
			facingMode: "environment"
		}
	};
	
	// Creates the canvas to draw everything on
	w = window.innerWidth * 0.98;
	h = window.innerHeight * 0.96;
	createCanvas(w, h);
	
	// Creates the capture using cameraOptions
	// IOS needs that 'playsinline' thing
	// Hides the camera, so that it can be used on the canvas instead
	camera = createCapture(cameraOptions);
	camera.elt.setAttribute('playsinline', '');
	camera.hide();
	
	background(0);
	
	// Gets the 'MobileNet' model through ml5
	// Gets the model classification libraries from ml5 and will use the camera
	model = ml5.imageClassifier('MobileNet', camera, modelReady);
	
	alert("Warning: If the page or buttons don't load right: keep the site, but leave your browser, then return back in.\nPress the 'Instructions' button for instructions");
	
	// Will call modelLoad when files are loaded into the webpage
	document.getElementById('files').addEventListener('change', modelLoad, false);
	
	// There is a bug that calls windowResized() before a Chrome page is loaded, so this is called a second later to compensate
	windowResized();
}

function modelReady() {
	
	console.log('Model is ready!!!');
	
	document.getElementById("upperText").innerHTML = "MobileNet loaded!";
	
	able(false);
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
		document.getElementById('toggleButton').innerHTML = "Stop";
		
		// Actual predicting
		model.predict(gotResult);
	}
	else
	{
		// It is predicting
		
		// Turns predicting to false
		isPredicting = false;
		
		// Changes the predict button to "Predict"
		document.getElementById('toggleButton').innerHTML = "Predict";
		
		// Clears previous predictions
		document.getElementById('upperText').innerHTML = "...";
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
			if (err == "TypeError: Cannot read property 'predict' of null")
			{
				alert("You have not trained any images!\nPress the 'Stop' button.");
			}
			else
			{
				// I have come to find out "TypeError: Cannot read property 'predict' of null" might be the only error...
				alert(err);
			}
		}
		else
		{
			// Gets the top result
			document.getElementById('upperText').innerHTML = res[0].className;
			
			findData(res[0].className);
			
			// Predicts again
			model.predict(gotResults);
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
	
	alert("This is a test for IOS");
	//alert("1) Press the 'Predict' button to start or stop predicting objects.\n2) At the bottom, you can load models into the page by clicking the 'Choose Files' button and selecting: 'model.json', 'model.weights.bin', and 'model.descriptions.txt' all at once.");
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
	
	// Gets the full text
	var fullText = desData[index];
	
	// Get the position of : in the fullText
	var n = fullText.indexOf(":");
	
	// Adds 4 to get ride of ': D_'
	n = n + 4;
	
	// Gets the substring of fullText, aka, the description of the result
	var s = fullText.substr(n);
	
	// Prints the text
	document.getElementById('info').innerHTML = s;
}

// Searches the names in the array
function searchStringInArray(s, a) {
	
	var name = "N_" + s + ":";
	//console.log("Does desData have: " + name + "?");
	
    for (var i = 0; i < a.length; i++) 
	{
        if (a[i].includes(name))
		{
			//console.log("It does at position: " + i);
			return i;
		}
    }
	
	//console.log("It does not");
    return -1;
}


/*******************************/
// Loading Models
/*******************************/

// You have the select the model.json, model.weights.bin, & model.descriptions.txt files into at the sametime!
function modelLoad(evt) {
	
	// Creates the FileList object
	var files = evt.target.files;
	console.log(files);
	
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
					
					console.log(desData);
				}
				
				reader.readAsText(f);
			}
		}
	}
	
	// Loads the model
	model.load(files, modelReady);
	
	document.getElementById('upperText').innerHTML = 'Model & Descriptions Loaded!';
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

function goTo(toLink) {
	
	location.href = toLink;
}

