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
	
	background(0);
	
	// Gets the 'MobileNet' model through ml5
	// Gets the model classification libraries from ml5 and will use the camera
	model = ml5.imageClassifier('MobileNet', camera, modelReady);
	
	alert("Warning: If the page is black: KEEP the site, but leave your browser, then return back in.\nWarning: Older versions of Chrome, Firefox, and Safari may not be compatible with Tensorflow.js\nThis demo uses the default MobileNet model that I did not train!\nPress the 'Instructions' button for instructions");
	
}

function modelReady() {
	
	preLoad()
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
				// Gets the data
                var data = this.responseText;
				
				// Puts into the desData
				// This will overwrite perious data in the webpage's session
				desData = data.split(",");
				
				document.getElementById("upperText").innerHTML = "MobileNet loaded!";
				able(false);
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
	
	console.log("Predicting");
	
	// Sees if it is preicting
	if (isPredicting)
	{
		// Checks for errors
		if (err) 
		{	
			if (err == "TypeError: Cannot read property 'predict' of null")
			{
				alert("No images were trained!\nPress the 'Stop' button.");
			}
			else
			{
				// I have come to find out "TypeError: Cannot read property 'predict' of null" might be the only error...
				alert(err);
			}
		}
		else
		{
			console.log(res[0].className);
			
			// Gets the top result
			document.getElementById('upperText').innerHTML = res[0].className;
			
			findData(res[0].className);
			
			// Predicts again
			model.predict(gotResult);
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
	
	//alert("This is a test for IOS");
	alert("1) Press the 'Predict' button to start or stop predicting objects.");
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

	// Finds the index of the result
	var index = searchString(r, desData);
	
	if (index != -1)
	{
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
	else
	{
		document.getElementById('info').innerHTML = "no description";
	}
}

// Searches the names in the array
function searchString(s, a) {
	
	// Just in case
	s = s.toLowerCase();
	
	// Checks the entire array
	for (var i = 0; i < a.length; i++)
	{
		// Isolates the name
		var name = a[i].substring(
			a[i].lastIndexOf("N_") + 2, 
			a[i].lastIndexOf(":")
		);
		
		// tries to find name in the result s
		if (s.includes(name))
		{
			return i;
		}
	}
    return -1;
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
}

// Becuase I disable and enable the buttons alot
function able(bool) {
	
	document.getElementById('camButton').disabled = bool;
	document.getElementById('instrButton').disabled = bool;
	document.getElementById('toggleButton').disabled = bool;
}

function goBack() {
	
	window.history.back();
}

