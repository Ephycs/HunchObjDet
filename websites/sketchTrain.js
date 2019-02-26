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

var countStr;
var preStr;


/*******************************/
// Core Features
/*******************************/

function setup() {
	
	// Disables the buttons
	able(true);
	
	// Sets up some variables
	countStr = 0;
	preStr = "";
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
	
	// Gets the 'MobileNet' model featureExtractor libraries from ml5 ready
	model = ml5.featureExtractor('MobileNet', modelReady);
	
	alert("Warning: If the page or buttons don't load right: keep the site, but leave your browser, then return back in and zoom out if need be.\nPress the 'Instructions' button for instructions");
	
	// There is a bug that calls windowResized() before a Chrome page is loaded, so this is called a second later to compensate
	windowResized();
}

// Called after the model is loaded
function modelReady() {
	
	console.log('Model is ready!!!');
	
	// Gets the camera ready for object classification
	classifier = model.classification(camera, cameraReady);
}

// Called after the camera is loaded
function cameraReady() {
	
	console.log('Camera is ready!!!');
	
	// Enables the buttons
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
		
		// Changes the predict button to "Predict"
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
				// Else
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

// draws the camera to the canvas
function draw() {
	
	background(0);
	
	// Draws the camera to the canvas
	image(camera, 0, 0, w, h);
	fill(255);
}


/*******************************/
// 2 Buttons
/*******************************/

// Intructions button
function alertInstr() {
	
	alert("1) Start training the model by entering the 'name' & 'description' of the object, then press the 'Add Image' button.\n2) To train another object, just simply change the 'name' & 'description' and take pictures of the new object.\n3) Try to have roughly the same amount of images for each of your pictures.\n4) When ready, tap the 'Train' button to train the model, wait until it says 'Done Training'.\n5) Once done, you can press the 'Predict' button to start or stop predicting objects.\n6) You can download the model to your computer's Downloads folder with the 'Download' button.");
}

// Sets & changes the camera used
function changeCamera() {
	
	alert("Work in progress");
}


/*******************************/
// Adding Data
// Training
// Saving
/*******************************/

// Adds an image using the model, BUT THIS WILL NOT ADD TO THE ORIGINAL MODEL
function modelAddImage() {
	
	// Gets what you typed into the input box
	// Makes it lowercase
	// IT WILL GET RID OF ALL SPACES
	var str = document.getElementById('inputText').value;
	str = str.toLowerCase();
	str = str.replace(/\s/g,'');
	
	// Gets what you typed into the info box
	// Makes it lowercase
	var des = document.getElementById('inputInfo').value;
	des = des.toLowerCase();
	
	// Checks to see if the name or description of the object is empty or includes bad special characters
	if (str == '')
	{
		alert("Please input a name");
	}
	else if (str.includes("'") || str.includes('"') || str.includes(',') || str.includes(';') || str.includes(":"))
	{
		alert("Names can't have ' '' , ; or : in it");
	}
	else if (des.includes("'") || des.includes('"') || des.includes(',') || des.includes(';') || des.includes(":"))
	{
		alert("Descriptions can't have ' '' , ; or : in it");
	}
	else
	{
		console.log("Took a picture");
		
		// This will check if you have not pressed the button multiple times with the same name
		if (preStr != str)
		{
			countStr = 0;
			preStr = str;
		}
		
		// Adds 1 to how many times you press the Add Image button with the same string
		countStr++;
		
		if (des == '' || des == 'description')
		{
			// In case you just want to add more images without changing the description
			// Just make the description box '' or 'description'
			console.log("The description was not changed");
			
			des = 'null';
		}
		else
		{
			// Adds the description to desData
			addDesData(str, des);
		}
		
		document.getElementById('info').innerHTML = `<center><table class='infoTable'><tr><th class='infoTh' style='width: 4em;'>Count</th><th class='infoTh' style='width: 8em;'>Name</th><th class='infoTh'>Description</th></tr><tr><td class='infoTd' style='width: 4em;'>${countStr}</td><td class='infoTd' style='width: 8em;'>${str}</td><td class='infoTd'>${des}</td></tr></table></center>`;
		
		// Adds the image to our model
		classifier.addImage(str);
	}
}

// Adds an description to the 
function addDesData(s, d) {
	
	// Creates the fullText and description format
	var fullText = 'N_' + s + ': D_' + d;
	
	//Creates the name to check for later
	var name = 'N_' + s + ':';
	
	// The first time this goes throught it will always error because there is nothing in the array
	if (desData.length == 0)
	{
		// Adds the data to the array
		desData.push(fullText);
		
		console.log(desData[0]);
	}
	else
	{
		// Searches for a atring in the array
		var idx = searchStringInArray(name, desData);
		
		//console.log(idx);
		
		if (idx == 0)
		{
			// Found, but the first one
			
			// Sets it for the first one
			desData[idx] = fullText;
			
			// Should be zero
			//console.log("Replaced First one " + idx + ") " + desData[idx]);
		}
		else if (idx == -1)
		{
			// Not found
			
			// Adds the data to the array
			desData.push(fullText);
			
			//var last = desData.length - 1;
			//console.log(last + ") " + desData[last]);
		}
		else
		{
			// Found in a position other than 0
			
			// Sets it
			desData[idx] = fullText;
			
			//console.log(idx + ") " + desData[idx]);
		}
	}
}

// Searches the names in the array, but it is simpler
function searchStringInArray(s, a) {
    for (var i = 0; i < a.length; i++) 
	{
		//console.log("s: " + s + ", includes thing: " + check);
		
        if (a[i].includes(s))
		{
			return i;
		}
    }
    return -1;
}

// Trains the model
function modelTrain() {
	
	// Disables the buttons
	able(true);
	
	// Start training
	document.getElementById('upperText').innerHTML = "Starting Training...";
	
	// Trains the model, this will loop
	classifier.train(function(lossValue) 
	{
		try
		{
			// Checks if finshed training
			if (lossValue == null)
			{
				// Done training
				document.getElementById('upperText').innerHTML = "Done Training!";
				
				// Enables the buttons
				able(false);
			}
			else
			{
				// Still training
				document.getElementById('upperText').innerHTML = "Still Training, Loss: " + lossValue;
			}
		}
		catch(err)
		{
			// There is an error when training on IOS
			alert(err);
		}
	});
}

// Saves the model to your Downloads
function modelSave() {
	
	console.log(desData);
	
	// Saves the model & weights
	classifier.save();
	
	// Saves the description file, with the desData
	var blob = new Blob([desData], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "model.descriptions.txt");
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
	document.getElementById('addButton').disabled = bool;
	document.getElementById('trainButton').disabled = bool;
	document.getElementById('saveButton').disabled = bool;
}

function goTo(toLink) {
	location.href = toLink;
}

