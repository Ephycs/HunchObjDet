// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Webcam Image Classification with ml5
// https://youtu.be/D9BoBSkLvFo

let model;
let video;
var videoOptions;

var canvas;
var w = window.innerWidth * 0.97;
var h = window.innerHeight * 0.97;

var toggle = false;
var predictions;

function modelReady() {
	
	console.log('Model is ready!!!');
	
	// Enables the toggle button to be pressed
	document.getElementById("toggle").disabled = false;
	
}

// Starts or Stops predicting
function togglePredicting() {
	
	// Will make the predicting Start
	if (toggle == false)
	{
		// Toggles to true in order to predict
		toggle = true;
		
		// Makes the toggle button a Stop button
		document.getElementById("toggle").innerHTML = "Stop";
		
		// Starts predicts
		model.predict(gotResults);
	}
	// Will make the predicting Start
	else
	{
		// Toggles to false in order to not predict
		toggle = false;
		
		// Clears all predictions
		document.getElementById("predictions").innerHTML = '';
		
		// Makes the toggle button a Stop button
		document.getElementById("toggle").innerHTML = "Start";
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
			
			// Threshold
			var threshold = .80;
			
			// If the top result is above a certain threshold
			if (results[0].probability >= threshold)
			{
				// Prints the top result
				document.getElementById("predictions").innerHTML = results[0].className;
				
				// Prints the top result accuracy
				document.getElementById("accuracy").innerHTML = (results[0].probability).toFixed(2);
			}
			else
			{
				document.getElementById("predictions").innerHTML = "...";
				document.getElementById("accuracy").innerHTML = "...";
			}
			
			// Predicts again
			model.predict(gotResults);
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
	
	// Gets the 'MobileNet' model from ml5
	model = ml5.imageClassifier('MobileNet', video, modelReady);
}

function draw() {
	
	background(0);
	
	// Draws the video to the canvas
	image(video, 0, 0, w, h);
	fill(255);
}