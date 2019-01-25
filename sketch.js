// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Webcam Image Classification with ml5
// https://youtu.be/D9BoBSkLvFo

let model;
let classifier;
let video;

var canvas;
var w = window.innerWidth * 0.97;
var h = window.innerHeight * 0.97;

var toggle = false;
var str;
var preStr = "";
var countStr = 0;

var predictions;

function modelReady() {
	
	console.log('Model is ready!!!');
	
	// Enables the buttons to be pressed
	document.getElementById("toggle").disabled = false;
	document.getElementById("train").disabled = false;
	document.getElementById("add").disabled = false;
	
}

function videoReady() {
	
	console.log('Video is ready!!!');
}

// Adds an image using the model, BUT THIS WILL NOT ADD TO THE ORIGINAL MODEL
function modelAddImage() {
	
	// Gets what you typed into the input box
	str = document.getElementById("inputText").value;
	str = str.toLowerCase();
	
	// This will check if you have not pressed the button multiple times with the same name
	if (preStr != str)
	{
		countStr = 0;
		
		preStr = str;
	}
	
	// Adds 1 o how many times you press the Add Image button with the same string
	countStr++;
	document.getElementById("count").innerHTML = str + " " + countStr;
	
	// Adds the image to our data
	classifier.addImage(str);
}

function modelTrain() {
	
	// disables all the buttons to be pressed
	document.getElementById("toggle").disabled = true;
	document.getElementById("train").disabled = true;
	document.getElementById("add").disabled = true;
	
	// Trains the model, this will loop
	classifier.train(whileTraining);
}

function whileTraining(loss) {
	
	// If finshed training
	if (loss == null)
	{
		// Still training
		document.getElementById("lossState"). innerHTML = "Done Training";
		
		// Enables the buttons to be pressed
		document.getElementById("toggle").disabled = false;
		document.getElementById("train").disabled = false;
		document.getElementById("add").disabled = false;
	}
	else
	{
		console.log(loss);
		
		// Still training
		document.getElementById("lossState"). innerHTML = "Still Training";
		
	}
	
}

// Starts or Stops predicting
function togglePredicting() {
	
	// Turns on the button
	if (toggle == false)
	{
		// Toggles to true in order to predict
		toggle = true;
		
		// Disables the train button
		document.getElementById("train").disabled = true;
		
		// Makes the toggle button a Stop button
		document.getElementById("toggle").innerHTML = "Stop";
		
		// Starts predicts
		//model.predict(gotResults);
		classifier.classify(gotResults);
	}
	// Turns off the button
	else
	{
		// Toggles to true in order to predict
		toggle = false;
		
		// Clears all predictions
		document.getElementById("predictions").innerHTML = '';
		
		// Makes the toggle button a Stop button
		document.getElementById("toggle").innerHTML = "Start";
		
		// Enables the train button
		document.getElementById("train").disabled = false;
		document.getElementById("add").disabled = false;
		
	}
}

function gotResults(error, results) {
	
	if (toggle)
	{
		if (error) 
		{	
			console.error(error);
		}
		else
		{
			//console.log(results);
			
			// Gets the top result
			//label = results[0].className;
			document.getElementById("predictions").innerHTML = results;
			
			// Predicts again
			//model.predict(gotResults);
			classifier.classify(gotResults);
		}
	}
}

// function imageReady() {
// image(puffin, 0, 0, width, height);
// }

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
	
	// Disables the toggle button
	document.getElementById("toggle").disabled = true;
	document.getElementById("train").disabled = false;
	
	// Gets the 'MobileNet' model from ml5
	model = ml5.featureExtractor('MobileNet', modelReady);
	classifier = model.classification(video, videoReady);
}

function draw() {
	
	background(0);
	
	// Draws the video to the canvas
	image(video, 0, 0, w, h - 60);
	fill(255);
}