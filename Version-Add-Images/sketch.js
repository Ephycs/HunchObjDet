// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Webcam Image Classification with ml5
// https://youtu.be/D9BoBSkLvFo

// Model, classier, video, and canvas setup
let model;
let classifier;
let video;
let canvas;
var w = window.innerWidth * 0.97;
var h = window.innerHeight * 0.97;

/* DOM elements
var document.getElementById('upperText') = document.getElementById('document.getElementById('upperText')');
var document.getElementById('toggleButton') = document.getElementById('document.getElementById('toggleButton')');
var document.getElementById('addButton') = document.getElementById('document.getElementById('addButton')');
var document.getElementById('trainButton') = document.getElementById('document.getElementById('trainButton')');
var document.getElementById('saveButton') = document.getElementById('document.getElementById('saveButton')');
var document.getElementById('inputText') = document.getElementById('document.getElementById('inputText')');
var document.getElementById('inputInfo') = document.getElementById('document.getElementById('inputInfo')');
var document.getElementById('addedImage') = document.getElementById('document.getElementById('addedImage')');
*/

var countStr;
var preStr = "";
var isPredicting;

function modelReady() {
	
	console.log('Model is ready!!!');
	
	// Enables the buttons to be pressed
	document.getElementById('toggleButton').disabled = false;
	document.getElementById('addButton').disabled = false;
	document.getElementById('trainButton').disabled = false;
	document.getElementById('saveButton').disabled = false;
	
}

function videoReady() {
	
	console.log('Video is ready!!!');
}

// Adds an image using the model, BUT THIS WILL NOT ADD TO THE ORIGINAL MODEL
function modelAddImage() {
	
	console.log("Took a picture");
	
	// Gets what you typed into the input box
	var str = document.getElementById('inputText').value;
	str = str.toLowerCase();
	
	// This will check if you have not pressed the button multiple times with the same name
	if (preStr != str)
	{
		countStr = 0;
		preStr = str;
	}
	
	// Adds 1 to how many times you press the Add Image button with the same string
	countStr++;
	document.getElementById('addedImage').innerHTML = str + " " + countStr;
	
	// Adds the image to our data
	classifier.addImage(str);
}

function modelTrain() {
	
	// Disables all buttons
	document.getElementById('toggleButton').disabled = true;
	document.getElementById('addButton').disabled = true;
	document.getElementById('trainButton').disabled = true;
	document.getElementById('saveButton').disabled = true;
	
	// Trains the model, this will loop
	classifier.train(whileTraining);
}

function whileTraining(loss) {
	
	// Checks if finshed training
	if (loss == null)
	{
		// Done training
		document.getElementById('upperText').innerHTML = "Done Training";
		
		// Enables the buttons
		document.getElementById('toggleButton').disabled = false;
		document.getElementById('addButton').disabled = false;
		document.getElementById('trainButton').disabled = false;
		document.getElementById('saveButton').disabled = false;
	}
	else
	{
		// Still training
		document.getElementById('upperText').innerHTML = "Still Training, Loss: " + loss;
	}
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
		document.getElementById('addButton').disabled = true;
		document.getElementById('trainButton').disabled = true;
		document.getElementById('saveButton').disabled = true;
		
		// Actual predicting
		classifier.classify(gotResult);
	}
	else
	{
		// It is predicting
		
		// Turns predicting to false
		isPredicting = false;
		
		// Changes the predict button to "Stop"
		document.getElementById('toggleButton').innerHTML = "Predict";
		
		// Enables all buttons except the document.getElementById('toggleButton')
		document.getElementById('addButton').disabled = false;
		document.getElementById('trainButton').disabled = false;
		document.getElementById('saveButton').disabled = false;
		
		// Clears previous predictions
		document.getElementById('upperText').innerHTML = "";
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
			alert(err);
		}
		else
		{
			// Gets the top result
			//label = res[0].className;
			document.getElementById('upperText').innerHTML = res;
			
			// Predicts again
			classifier.classify(gotResult);
		}
	}
}

// Saves the model to your Downloads
function modelSave() {
	
	classifier.save();
}

function setup() {
	
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
	
	// Displays No Model Trained warning
	document.getElementById('upperText').innerHTML = "No Images Trained";
	
	// Sets up some variables
	countStr = 0;
	isPredicting = false;
	
	// Gets the 'MobileNet' model from ml5
	model = ml5.featureExtractor('MobileNet', modelReady);
	classifier = model.classification(video, videoReady);
}

function draw() {
	
	background(0);
	
	// Draws the video to the canvas
	image(video, 0, 0, w, h);
	fill(255);
}
