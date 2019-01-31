//
//
//

// Model, classier, video, and canvas setup
let model;
let video;
let canvas;
var w = window.innerWidth * 0.97;
var h = window.innerHeight * 0.97;

var countStr;
var preStr = "";
var isPredicting;

var threshold = .30;
var prediction;
var accuracy;

function alertInstr() {
	alert("Warning: do not flip screen.\n1) This page uses a pretrained model to predict objects through your device's camera.\n2) Press the 'Predict' button to start or stop predicting objects.\n3) Objects detected will appear at the top of the screen.\n4) Information about that object will appear at the bottom of the screen.\n5) Press the 'Add Image Page' button to add images of your own");
}

function setup() {
	
	// Disables the buttons
	document.getElementById('instrButton').disabled = true;
	document.getElementById('toggleButton').disabled = true;
	document.getElementById('addButton').disabled = true;
	
	// Creates the canvas to draw everything on
	canvas = createCanvas(w, h);
	
	var videoOptions = 
	{
		audio: false,
		video: 
		{
			facingMode: "environment"
		}
	};
	
	// Gets the camera input with certain options
	video = createCapture(videoOptions);
	video.hide();
	
	background(0);
	
	// Displays where the objects will go
	document.getElementById('upperText').innerHTML = "Objects detected go here";
	document.getElementById('info').innerHTML = "Information about the object goes here";
	
	// Sets up some variables
	countStr = 0;
	isPredicting = false;
	
	// Gets the 'MobileNet' model through ml5
	model = ml5.imageClassifier('MobileNet', video, modelReady);
	
	alert("Press the 'Instructions' button for instructions");
}

function draw() {
	
	background(0);
	
	// Draws the video to the canvas
	image(video, 0, 0, w, h);
	fill(255);
}

function modelReady() {
	
	console.log('Model & Video are ready!!!');
	
	// Enables the buttons
	document.getElementById('instrButton').disabled = false;
	document.getElementById('toggleButton').disabled = false;
	document.getElementById('addButton').disabled = false;
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
		
		// Disables all buttons except the document.getElementById('toggleButton')
		document.getElementById('instrButton').disabled = true;
		document.getElementById('addButton').disabled = true;
		
		// Actual predicting
		model.predict(gotResult);
	}
	else
	{
		// It is predicting
		
		// Turns predicting to false
		isPredicting = false;
		
		// Changes the predict button to "Stop"
		document.getElementById('toggleButton').innerHTML = "Predict";
		
		// Enables all buttons except the document.getElementById('toggleButton')
		document.getElementById('instrButton').disabled = false;
		document.getElementById('addButton').disabled = false;
		
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
				alert(err);
			}
		}
		else
		{
			// If the top result is above a certain threshold
			if (res[0].probability >= threshold)
			{
				// Prints the top prediction with accuracy
				document.getElementById('upperText').innerHTML = res[0].className + " " + (res[0].probability).toFixed(2);
			}
			else
			{
				document.getElementById('upperText').innerHTML = "...";
			}
			
			// Predicts again
			model.predict(gotResult);
		}
	}
}

function goToAddImagePage() {
	
	window.location="train.html";
}