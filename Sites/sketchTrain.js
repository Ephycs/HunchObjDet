//
//
//

// Model, classier, video, and canvas setup
let model;
let classifier;
let video;
let canvas;
var w;
var h;

var countStr;
var preStr = "";
var isPredicting;

function alertInstr() {
	
	alert("Warning: do not flip screen.\n1) Start training the model by entering the 'name' & 'description' of the object, then press the 'Add Image' button.\n2) To train another object, just simply change the 'name' & 'description' and take pictures of the new object.\n3) Try to have roughly the same amount of images for each of your pictures.\n4) When ready, tap the 'Train' button to train the model, you will see the loss at the top.\n5) Once done, you can press the 'Predict' button to start or stop predicting objects.\n6) You can download the model to your computer's Downloads folder with the 'Download' button.\n7) At the bottom, you can load models into the page by clicking the 'Choose Files' button and selecting both the model.js & model.weights.bin.");
}

function setup() {
	
	// Disables the buttons
	document.getElementById('instrButton').disabled = true;
	document.getElementById('demoButton').disabled = true;
	document.getElementById('toggleButton').disabled = true;
	document.getElementById('addButton').disabled = true;
	document.getElementById('trainButton').disabled = true;
	document.getElementById('saveButton').disabled = true;
	
	// Creates the canvas to draw everything on
	w = window.innerHeight * 0.97;
	h = window.innerHeight * 0.96;
	createCanvas(w, h);
	
	var videoOptions = 
	{
		audio: false,
		video: 
		{
			facingMode: "environment"
		}
	};*/
	
	// Gets the camera input with certain options
	video = createCapture(videoOptions);
	video.elt.setAttribute('playsinline', '');
	video.hide();
	
	background(0);
	
	// Displays No Model Trained warning
	document.getElementById('upperText').innerHTML = "No Images Trained";
	document.getElementById('info').innerHTML = "Information about the object goes here";
	
	// Sets up some variables
	countStr = 0;
	isPredicting = false;
	
	// Gets the 'MobileNet' model through ml5
	// Gets the model classification libraries from ml5
	model = ml5.featureExtractor('MobileNet', modelReady);
	classifier = model.classification(video, videoReady);
	
	alert("Press the 'Instructions' button for instructions");
	
	// Will call function when files are loaded into the webpage
	document.getElementById('files').addEventListener('change', modelLoad, false);
}

// This will call when the window is resized
function windowResized() {
	
	// Gets new width and height
	w = window.innerWidth * 0.97;
	h = window.innerHeight * 0.96;
	
	// Resizes the canvas, w, and h when the user tilts the screen
	resizeCanvas(w, h);
	
	console.log("Window was resized");
}

function draw() {
	
	background(0);
	
	// Draws the video to the canvas
	image(video, 0, 0, w, h);
	fill(255);
}

function modelReady() {
	
	console.log('Model is ready!!!');
}

function videoReady() {
	
	console.log('Video is ready!!!');
	
	// There is a bug that calls windowResized() before a Chrome page is loaded, so this is called a second later
	windowResized();
	
	// Enables the buttons
	document.getElementById('instrButton').disabled = false;
	document.getElementById('demoButton').disabled = false;
	document.getElementById('toggleButton').disabled = false;
	document.getElementById('addButton').disabled = false;
	document.getElementById('trainButton').disabled = false;
	document.getElementById('saveButton').disabled = false;
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
	document.getElementById('info').innerHTML = str + " " + countStr;
	
	// Adds the image to our data
	classifier.addImage(str);
}

function modelTrain() {
	
	// Disables the buttons
	document.getElementById('instrButton').disabled = true;
	document.getElementById('demoButton').disabled = true;
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
		document.getElementById('instrButton').disabled = false;
		document.getElementById('demoButton').disabled = false;
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
		document.getElementById('instrButton').disabled = true;
		document.getElementById('demoButton').disabled = true;
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
		document.getElementById('instrButton').disabled = false;
		document.getElementById('demoButton').disabled = false;
		document.getElementById('addButton').disabled = false;
		document.getElementById('trainButton').disabled = false;
		document.getElementById('saveButton').disabled = false;
		
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
			// Gets the top result
			document.getElementById('upperText').innerHTML = res;
			
			// Predicts again
			classifier.classify(gotResult);
		}
	}
}

function changeCamera() {
	
	
	
}

// Button that acts like a hyper link
function goToDemoPage() {
	
	window.location="index.html";
}

// Saves the model to your Downloads
function modelSave() {
	
	classifier.save();
}

// FileList
// You have the select both the model.json & model.weights.bin files into at the sametime!
function modelLoad(evt) {
	
	var files = evt.target.files; // Creates the FileList object
	
	classifier.load(files, modelReady);
}