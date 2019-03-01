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

var countStr = 0;
var preStr = "";
var maxAmount;
var currentAmount = 0;
var trainAble = false;
var trained = false;

var namesData = [];

var timeout;


/*******************************/
// Core Features
/*******************************/

function setup() {
	
	// Disables the buttons
	able(true);
	document.getElementById('trainButton').disabled = true;
	document.getElementById('saveButton').disabled = true;
	
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
	
	//Asks for how many images you would like to train
	maxAmount = prompt("Warning: If the page is black: KEEP the site, but leave your browser, then return back in.\nOlder versions of Chrome, Firefox, and Safari may not be compatible with Tensorflow.js\n\nThis is website trains objects in your browser, before we start enter how many objects you would like to train:");
	maxAmount = maxAmount.match(/\d/g);
	if (maxAmount == null)
	{
		maxAmount = 2;
	}
	else
	{
		maxAmount = maxAmount.join("");
		Number(maxAmount);
		if (maxAmount < 2)
		{
			// Can't get away with training negative, 0, or 1 images
			maxAmount = 2;
		}
	}
	
	document.getElementById('maxAmount').innerHTML = maxAmount;
	document.getElementById('currentAmount').innerHTML = currentAmount;
	
	// Gets the 'MobileNet' model featureExtractor libraries from ml5 ready
	model = ml5.featureExtractor('mobilenet', modelReady);
	model.numClasses = maxAmount;
	
	//alert("Warning: If the page is black: KEEP the site, but leave your browser, then return back in.\nWarning: Older versions of Chrome, Firefox, and Safari may not be compatible with Tensorflow.js\nPress the 'Instructions' button for instructions");
	
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
	
	document.getElementById('upperText').innerHTML = "No Images Trained";
	
	// Enables the buttons
	able(false);
}

// Starts or Stops predicting
function togglePredicting() {
	
	// If this was false you would not have trained any images to test
	if (trained == false)
	{
		document.getElementById('upperInfo').innerHTML = "Press the 'Info' button for instructions";
	}
	else
	{
		// Checks if it is predicting
		if (isPredicting == false)
		{
			// It is not predicting
			
			// Turns predicting to true
			isPredicting = true;
			
			// Changes the predict button to "Stop"
			document.getElementById('toggleButton').innerHTML = "<i class='fas fa-stop'></i> Stop";
			
			// Disables all buttons except the 'camButton', 'toggleButton', & 'instrButton'
			document.getElementById('addButton').disabled = true;
			document.getElementById('trainButton').disabled = true;
			document.getElementById('saveButton').disabled = true;
			
			console.log("Starting predicting...");
			
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
			
			// Enables all buttons except the 'camButton', 'toggleButton', & 'instrButton'
			document.getElementById('addButton').disabled = false;
			document.getElementById('trainButton').disabled = false;
			document.getElementById('saveButton').disabled = false;
			
			if (trainAble)
			{
				document.getElementById('trainButton').disabled = false;
			}
			
			// Clears previous predictions
			document.getElementById('upperText').innerHTML = "...";
			
			console.log("Stopping predicting...");
		}
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
// Adding Data
// Training
/*******************************/

//Stops adding images
function stopRepeat() {
	
	clearTimeout(timeout);
}

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
		// This will check if you have not pressed the button multiple times with the same name
		if (preStr != str)
		{
			countStr = 0;
			preStr = str;
			
			// Checks if this is an already added image
			if (namesData.includes(str) == false)
			{
				// Did not find the name in the namesData
				
				namesData.push(str);
				//console.log(namesData);
				
				// Prints your currentAmount
				currentAmount++;
				document.getElementById('currentAmount').innerHTML = currentAmount;
			}
		}
		
		// Adds 1 to how many times you press the Add Image button with the same string
		countStr++;
		
		if (des == '' || des == 'description')
		{
			// In case you just want to add more images without changing the description
			// Just make the description box '' or 'description'
			//console.log("The description was not changed");
			
			des = '(description was not changed)';
		}
		else
		{
			// Adds the description to desData
			addDesData(str, des);
		}
		
		// Makes the table with all the info of the new object
		document.getElementById('table').innerHTML = `<center><table class='infoTable'><tr><th class='infoTh' style='width: 4em;'>Count</th><th class='infoTh' style='width: 8em;'>Name</th><th class='infoTh'>Description</th></tr><tr><td class='infoTd' style='width: 4em;'>${countStr}</td><td class='infoTd' style='width: 8em;'>${str}</td><td class='infoTd'>${des}</td></tr></table></center>`;
		
		// Adds the image to our model
		classifier.addImage(str, function() 
		{
			//console.log("Took an image!");
			
			// If you have reached your maxAmount of images
			if (currentAmount == maxAmount) 
			{
				// You can now train
				trainAble = true;
				document.getElementById('trainButton').disabled = false;
			}
			
			timeout = setTimeout(modelAddImage, 100);
		});
	}
}

// Adds an description to the 
function addDesData(s, d) {
	
	// Creates the fullText and description format
	var fullText = 'N_' + s + ': D_' + d;
	
	// The first time this goes throught it will always error because there is nothing in the array
	if (desData.length == 0)
	{
		// Adds the data to the array
		desData.push(fullText);
		
		//console.log("desData[0]: " + desData[0]);
	}
	else
	{
		// Searches for a atring in the array
		var idx = searchStringInArray(s, desData);
		
		if (idx == 0)
		{
			// Found, but the first one
			
			// Sets it for the first one
			desData[idx] = fullText;
			
			//console.log("Replaced first one");
		}
		else if (idx == -1)
		{
			// Not found
			
			// Adds the data to the array
			desData.push(fullText);
			
			var last = desData.length - 1;
			//console.log("Pushed one in: " + desData[last]);
		}
		else
		{
			// Found in a position other than 0
			
			// Sets it
			desData[idx] = fullText;
			
			//console.log("Replaced desData[" + idx + "]: " + desData[idx]);
		}
	}
}

// Trains the model
function modelTrain() {
	
	// Disables the buttons
	able(true);
	
	// Start training
	document.getElementById('upperText').innerHTML = "Starting Training...";
	console.log("Starting training...");
	
	// Trains the model, this will loop
	classifier.train(function(lossValue) 
	{
		// Checks if finshed training
		if (lossValue == null)
		{
			// Done training
			document.getElementById('upperText').innerHTML = "Done Training!";
			console.log("Done training!");
			
			// You have trained
			trained = true;
			
			// Enables the buttons
			able(false);
		}
		else
		{
			// Still training
			document.getElementById('upperText').innerHTML = "Still Training, Loss: " + lossValue;
		}
	});
}

/*******************************/
// Saving
// Downloading
/*******************************/

// Saves the model to your Downloads
function modelSave() {
	
	if (trained == false)
	{
		document.getElementById('upperInfo').innerHTML = "Press the 'Info' button for instructions";
	}
	else
	{
		console.log("Saving txt data: " + desData);
		
		// Saves the description file, with the desData
		var blob = new Blob([desData], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "model.descriptions.txt");
		
		// Saves the model & weights
		classifier.save(function()
		{
			console.log("Model was saved!");
		});
	}
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
	
	if (trainAble)
	{
		document.getElementById('trainButton').disabled = bool;
		document.getElementById('saveButton').disabled = bool;
	}
}

function goTo(toLink) {
	
	location.href = toLink;
}

function goBack() {
	
	location.href = "../index.html";
}

