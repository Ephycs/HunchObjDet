//
//
//

// Model, classier, camera, and canvas setup
let model;
let classifier;
let camera;
let canvas;
var w;
var h;

var cameraOptions;
var countStr;
var preStr = "";
var isPredicting;
var desData = new Object();

function alertInstr() {
	
	alert("1) Start training the model by entering the 'name' & 'description' of the object, then press the 'Add Image' button.\n2) To train another object, just simply change the 'name' & 'description' and take pictures of the new object.\n3) Try to have roughly the same amount of images for each of your pictures.\n4) When ready, tap the 'Train' button to train the model, you will see the loss at the top.\n5) Once done, you can press the 'Predict' button to start or stop predicting objects.\n6) You can download the model to your computer's Downloads folder with the 'Save' button.\n7) At the bottom, you can load models into the page by clicking the 'Choose Files' button and selecting both the model.js & model.weights.bin.");
}

function setup() {
	
	// Disables the buttons
	able(true);
	
	// Creates the canvas to draw everything on
	w = window.innerHeight * 0.97;
	h = window.innerHeight * 0.96;
	createCanvas(w, h);
	
	// Sets up some variables
	camNum = 0;
	countStr = 0;
	isPredicting = false;
	
	// Sets up the cameraOptions
	// Creates the capture using those options
	// IOS needs that 'playsinline' thing
	// Hides the camera, so that it can be used on the canvas instead
	cameraOptions = 
	{
		audio: false,
		video: 
		{
			facingMode: "environment"
		}
	};
	camera = createCapture(cameraOptions);
	camera.elt.setAttribute('playsinline', '');
	camera.hide();
	
	background(0);
	
	// Displays No Model Trained warning
	document.getElementById('upperText').innerHTML = "No Images Trained";
	document.getElementById('info').innerHTML = "Information about the object goes here";
	
	// Gets the 'MobileNet' model through ml5
	// Gets the model classification libraries from ml5
	model = ml5.featureExtractor('MobileNet', modelReady);
	classifier = model.classification(camera, cameraReady);
	
	alert("Warning: If the page or buttons don't load right: keep the site, but leave your browser, then return back in and zoom out if need be.\nPress the 'Instructions' button for instructions");
	
	// Will call function when files are loaded into the webpage
	document.getElementById('files').addEventListener('change', modelLoad, false);
}

// Sets & changes the camera used
function changeCamera() {
	
	alert("Work in progress");
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

// draws the camera to the canvas
function draw() {
	
	background(0);
	
	// Draws the camera to the canvas
	image(camera, 0, 0, w, h);
	fill(255);
}

// Loads the model for transfer learning
function modelReady() {
	
	console.log('Model is ready!!!');
}

function cameraReady() {
	
	console.log('Camera is ready!!!');
	
	// There is a bug that calls windowResized() before a Chrome page is loaded, so this is called a second later to compensate
	windowResized();
	
	// Enables the buttons
	able(false);
}

// Adds an image using the model, BUT THIS WILL NOT ADD TO THE ORIGINAL MODEL
function modelAddImage() {
	
	console.log("Took a picture");
	
	// Gets what you typed into the input box
	// Makes it lowercase
	// Gets ride of all the spaces
	var str = document.getElementById('inputText').value;
	str = str.toLowerCase();
	str = str.replace(/\s/g,'');
	
	// This will check if you have not pressed the button multiple times with the same name
	if (preStr != str)
	{
		countStr = 0;
		preStr = str;
	}
	
	// Adds 1 to how many times you press the Add Image button with the same string
	countStr++;
	document.getElementById('info').innerHTML = str + " " + countStr;
	
	// Adds the image to our model
	classifier.addImage(str);
	
	// Gets what you typed into the info box
	// Makes it lowercase
	// Gets ride of all the spaces
	var des = document.getElementById('inputInfo').value;
	des = des.toLowerCase();
	des = des.replace(/\s/g,'');
	
	if (des == '' || des == 'description')
	{
		// In case you just want to add more images without changing the description
		// Just make the description box '' or 'description'
		console.log("The description was not changed");
	}
	else
	{
		// Adds the description to desData
		desData[str] = des;
	}
}

function modelTrain() {
	
	// Start training
	document.getElementById('upperText').innerHTML = "Starting Training...";
	
	// Disables the buttons
	able(true);
	
	// Trains the model, this will loop
	classifier.train(whileTraining);
}

function whileTraining(loss) {
	
	// Checks if finshed training
	if (loss == null)
	{
		// Done training
		document.getElementById('upperText').innerHTML = "Done Training!";
		
		// Enables the buttons
		able(false);
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
		
		// Disables all buttons except the 'camButton', 'toggleButton', & 'instrButton'
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
		
		// Enables all buttons except the 'camButton', 'toggleButton', & 'instrButton'
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

// Becuase I disable and enable the buttons alot
function able(bool) {
	
	document.getElementById('camButton').disabled = bool;
	document.getElementById('instrButton').disabled = bool;
	document.getElementById('toggleButton').disabled = bool;
	document.getElementById('addButton').disabled = bool;
	document.getElementById('trainButton').disabled = bool;
	document.getElementById('saveButton').disabled = bool;
}

// Saves the model to your Downloads
function modelSave() {
	
	console.log(desData);
	
	// Saves the model & weights
	classifier.save();
	
	// Saves the description file, with the desData
	var blob = new Blob([desData.toString()], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "model.descriptions.txt");
}

// FileList
// You have the select both the model.json & model.weights.bin files into at the sametime!
function modelLoad(evt) {
	
	var files = evt.target.files; // Creates the FileList object
	
	console.log(files);
	
	classifier.load(files, modelReady);
}

