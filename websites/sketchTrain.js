/*****************************/
// Ethan R Feldman
// Platt Tech NASA HUNCH TEAM
/*****************************/

// Inital variables //

let model;
let classifier;
let camera;
let canvas;

var cameraOptions = {
	video: 
	{
		facingMode: "environment"
	}
};

var w;
var h;
var isPredicting;
var desData;

var countStr;
var preStr;
var maxAmount;
var currentAmount;
var trainAble;
var trained;
var training;

var namesData;
var timeout;

// Begining Alert
//Asks for how many images you would like to train
maxAmount = prompt("This is website trains objects in your browser, before we start enter how many objects you would like to train:");

if (maxAmount == null)
{
	// passes a dumby answer
	maxAmount = "jgu2";
}
// extracts the digits from the answer
maxAmount = maxAmount.match(/\d/g);
if (maxAmount == null)
{
	// If no digits were found, default 2
	maxAmount = 2;
}
else
{
	// If digits were found it will join the numbers
	maxAmount = maxAmount.join("");
	// Changes the number to an interger
	Number(maxAmount);
	
	// you need to train atleast 2 images
	if (maxAmount < 2)
	{
		// Can't get away with training negative, 0, or 1 images
		maxAmount = 2;
	}
}
// Debugging maxAmount
console.log("maxAmount: " + maxAmount);


/*******************************/
// Setup and Draw
/*******************************/

function setup() {
	
	// Disables the buttons
	able(true);
	document.getElementById('trainButton').disabled = true;
	document.getElementById('saveButton').disabled = true;
	
	isPredicting = false;
	desData = [];
	countStr = 0;
	preStr = "";
	currentAmount = 0;
	trainAble = false;
	trained = false;
	namesData = [];
	
	document.getElementById('maxAmount').innerHTML = maxAmount;
	document.getElementById('currentAmount').innerHTML = currentAmount;
	
	// Creates the canvas to draw everything on
	w = window.innerWidth * 0.98;
	h = window.innerHeight * 0.96;
	canvas = createCanvas(w, h);
	
	// Debugging cameraOptions
	console.log("cameraOptions: " + cameraOptions);

	// Creates the capture using cameraOptions
	// With playsinline, autoplay, and muted
	camera = createCapture(cameraOptions, function() {
		
		camera.elt.setAttribute('playsinline', true);
		camera.elt.setAttribute('autoplay', true);
		camera.elt.setAttribute('muted', true);
		
		// Hides the camera, so that it can be used on the canvas instead
		camera.hide();
		
		// Debugs when camera was set
		console.log("Camera was just set!");
		
		// Uses camera
		next(camera);
	});
}

// Creates the model with a parameter
function next(mode) {
	
	// Gets the 'MobileNet' model featureExtractor libraries from ml5 ready
	model = ml5.featureExtractor('mobilenet', function() {
		
		// Sets how many classes you can train
		model.numClasses = maxAmount;
		
		// Debugs when the model was loaded
		console.log("Model was loaded!!!");
		
		// Gets the camera ready for object classification
		classifier = model.classification(mode, cameraReady);
	});
}

// Called after the camera is loaded
function cameraReady() {
	
	// Debugs when the camera was loaded
	console.log("Camera was loaded!!!");
	
	document.getElementById('upperText').innerHTML = "No Images Trained";
	
	// Enables the buttons
	able(false);
	
	// resizes the page just in case
	windowResized();
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
			document.getElementById('toggleButton').style.filter = "invert(1)";
			
			// Disables all buttons except the 'camButton', 'toggleButton', & 'instrButton'
			document.getElementById('addButton').disabled = true;
			document.getElementById('trainButton').disabled = true;
			document.getElementById('saveButton').disabled = true;
			
			console.log("Starting predicting...");
			
			// Actual predicting
			classify();
		}
		else
		{
			// It is predicting
			
			// Turns predicting to false
			isPredicting = false;
			
			// Changes the predict button to "Predict"
			document.getElementById('toggleButton').innerHTML = "<i class='fas fa-play'></i> Predict";
			document.getElementById('toggleButton').style.filter = "invert(0)";
			
			// Enables all buttons except the 'camButton', 'toggleButton', & 'instrButton'
			document.getElementById('addButton').disabled = false;
			document.getElementById('trainButton').disabled = false;
			document.getElementById('saveButton').disabled = false;
			
			// If still trainable that means you did not train it, so this won't get disabled
			if (trainAble)
			{
				document.getElementById('trainButton').disabled = false;
			}
			
			// Clears previous predictions
			document.getElementById('upperText').innerHTML = "...";
			document.getElementById('upperInfo').innerHTML = "...";
			
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
			
			// Finds the result in the database
			findData(res);
			
			// Predicts again
			classify();
		}
	}
}

// Function for classifying
function classify() {
	
	//Actual classifying
	classifier.classify(gotResult);
}

// Draws the camera to the canvas
function draw() {
	
	// Draws the camera to the canvas
	image(camera, 0, 0, w, h);
	fill(255);
}


/*******************************/
// Finding Data
/*******************************/

// Find the data from desData by the res from gotResult
function findData(r) {

	// Puts into lowercase
	r = r.toLowerCase();
	
	// Finds the index of the result
	var index = searchStringInArray(r, desData);
	//console.log(index);
	
	// If found
	if (index != -1)
	{
		// Was found
		
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
		// Was not found
		
		// Displays no description
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
			
			des = '(nothing changed)';
		}
		else
		{
			// Adds the description to desData
			addDesData(str, des);
		}
		
		// Makes the table with all the info of the new object
		document.getElementById('table').innerHTML = `<center><table id='littleTable' class='infoTable'><tr><th class='infoTh' style='width: 4em;'>Count</th><th class='infoTh' style='width: 8em;'>Name</th><th class='infoTh'>Description</th></tr><tr><td class='infoTd' style='width: 4em;'>${countStr}</td><td class='infoTd' style='width: 8em;'>${str}</td><td class='infoTd'>${des}</td></tr></table></center>`;
		windowResized();
		
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
			
			//var last = desData.length - 1;
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
	
	// You are training
	training = true;
	
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
			training = false;
			
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
	
	// Checks if you have trained already
	if (trained == false)
	{
		// You did not
		
		document.getElementById('upperInfo').innerHTML = "Press the 'Info' button for instructions";
	}
	else
	{
		// You did
		
		// Debugs a previe of your database
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

// Intructions button
function alertInstr() {
	
	alert("1) Start training the model by entering the 'name' & 'description' of the object, then press the '+' button.\n2) To train another object, just simply change the 'name' & 'description' and take pictures of the new object.\n3) Try to have roughly the same amount of images for each of your pictures.\n4) When ready, tap the 'Train' button to train the model, wait until it says 'Done Training'.\n5) Once done, you can press the 'Predict' button to start or stop predicting objects.\n6) You can download the model to your computer's Downloads folder with the 'Download' button.\n7) The top-left button will take you to the demo page.");
}

// This will call when the window is resized
function windowResized() {
	
	// Gets new width and height
	w = window.innerWidth * 0.98;
	h = window.innerHeight * 0.96;
	
	// Resizes the layout when the user tilts the screen
	if (w > h)
	{
		// Lanscape mode
		resizeCanvas(w*0.6, h);
		canvas.position(w*0.4, 5);
		canvas.elt.style.zIndex = -1;
		
		// Changes the font sizes to around half size
		for (button of document.body.getElementsByTagName("button")) 
		{
			button.style.fontSize = "0.7em";
		}
		for (p of document.body.getElementsByTagName("p"))
		{
			p.style.fontSize = "0.7em";
		}
		document.getElementById("upperText").style.fontSize = "1.3em";
		document.getElementById("upperInfo").style.fontSize = "1em";
		document.getElementById("currentAmount").style.fontSize = "0.8em";
		document.getElementById("maxAmount").style.fontSize = "0.8em";
		document.getElementById("addIcon").style.fontSize = "2em";
		document.getElementById("inputText").style.height = "0.8em";
		document.getElementById("inputInfo").style.height = "0.8em";
		document.getElementById("inputText").style.fontSize = "0.7em";
		document.getElementById("inputInfo").style.fontSize = "0.7em";
		document.getElementById("addTableHeight").style.height = "2em";
		if (document.getElementById("littleTable") != null)
		{
			document.getElementById("littleTable").style.fontSize = "0.7em";
		}
		
		// Moves all the content to the right
		document.getElementById("upperDiv").style.width = "36%";
		document.getElementById("content").style.width = "39%";
		
		// Moves buttons down
		moveUpperButtons('down');
	}
	else if (w <= h)
	{
		// Portrait mode
		resizeCanvas(w, h);
		canvas.position(0, 5);
		canvas.elt.style.zIndex = -1;
		
		// Changes the font sizes to regular
		for (button of document.body.getElementsByTagName("button")) 
		{
			button.style.fontSize = "1em";
		}
		for (p of document.body.getElementsByTagName("p"))
		{
			p.style.fontSize = "1em";
		}
		document.getElementById("upperText").style.fontSize = "2em";
		document.getElementById("upperInfo").style.fontSize = "1.5em";
		document.getElementById("currentAmount").style.fontSize = "1.2em";
		document.getElementById("maxAmount").style.fontSize = "1.2em";
		document.getElementById("addIcon").style.fontSize = "3em";
		document.getElementById("inputText").style.height = "1em";
		document.getElementById("inputInfo").style.height = "1em";
		document.getElementById("inputText").style.fontSize = "1em";
		document.getElementById("inputInfo").style.fontSize = "1em";
		document.getElementById("addTableHeight").style.height = "4em";
		if (document.getElementById("littleTable") != null)
		{
			document.getElementById("littleTable").style.fontSize = "1em";
		}
		
		// Makes the content full width
		document.getElementById("upperDiv").style.width = "100%";
		document.getElementById("content").style.width = "100%";
		
		// Moves buttons up
		moveUpperButtons('up');
	}
	
	//console.log("Window was resized, W: " + w + "H: " + h);
}

// Moves the uppper (top) buttons
// Needs either "up" or "down"
function moveUpperButtons(dirrection) {
	
	// gets the state of the buttons
	var zoomState = document.getElementById("zoomButton").disabled;
	var instrState = document.getElementById("instrButton").disabled;
	var toggleState = document.getElementById("toggleButton").disabled;
	var trainState = document.getElementById("trainButton").disabled;
	var saveState = document.getElementById("saveButton").disabled;
	
	if (dirrection == "down")
	{
		// Lanscape mode
		
		if (isPredicting)
		{
			// It is predicting
			
			// Clears the upper buttons
			document.getElementById("topButtons1").innerHTML = "";
			document.getElementById("topButtons3").innerHTML = "";
			
			// locates the buttons to the buttom
			document.getElementById("topButtons2").innerHTML = '<button id="trainButton" onClick="modelTrain()"><i class="fas fa-cogs"></i> Train</button><button id="saveButton" onClick="modelSave()"><i class="fas fa-download"></i> Dnld</button><button id="zoomButton" onClick="alertZoom()"><i class="fas fa-search"></i><i class="fas fa-question"></i></button><button id="instrButton" onClick="alertInstr()"><i class="fas fa-info-circle"></i> Info</button><button id="toggleButton" onClick="togglePredicting()"><i class="fas fa-stop"></i> Stop</button>'
			document.getElementById('toggleButton').style.filter = "invert(1)";
		}
		else
		{
			// It is not
			
			// Clears the upper buttons
			document.getElementById("topButtons1").innerHTML = "";
			document.getElementById("topButtons3").innerHTML = "";
			
			// locates the buttons to the buttom
			document.getElementById("topButtons2").innerHTML = '<button id="trainButton" onClick="modelTrain()"><i class="fas fa-cogs"></i> Train</button><button id="saveButton" onClick="modelSave()"><i class="fas fa-download"></i> Dnld</button><button id="zoomButton" onClick="alertZoom()"><i class="fas fa-search"></i><i class="fas fa-question"></i></button><button id="instrButton" onClick="alertInstr()"><i class="fas fa-info-circle"></i> Info</button><button id="toggleButton" onClick="togglePredicting()"><i class="fas fa-play"></i> Predict</button>'
			document.getElementById('toggleButton').style.filter = "invert(0)";
		}
	}
	else if (dirrection == "up")
	{
		// Portrait mode
		
		if (isPredicting)
		{
			// It is predicting
			
			// Clears the upper buttons
			document.getElementById("topButtons2").innerHTML = "";
			
			// locates the buttons to the buttom
			document.getElementById("topButtons1").innerHTML = '<button id="zoomButton" onClick="alertZoom()"><i class="fas fa-search"></i><i class="fas fa-question"></i></button><button id="instrButton" onClick="alertInstr()"><i class="fas fa-info-circle"></i> Info</button><button id="toggleButton" onClick="togglePredicting()"><i class="fas fa-stop"></i> Stop</button>'
			document.getElementById('toggleButton').style.filter = "invert(1)";
			
			// Puts the other buttons on the bottom
			document.getElementById("topButtons3").innerHTML = '<button id="trainButton" onClick="modelTrain()"><i class="fas fa-cogs"></i> Train</button><button id="saveButton" onClick="modelSave()"><i class="fas fa-download"></i> Download Model</button>';
		}
		else
		{
			// It is not
			
			// Clears the upper buttons
			document.getElementById("topButtons2").innerHTML = "";
			
			// locates the buttons to the buttom
			document.getElementById("topButtons1").innerHTML = '<button id="zoomButton" onClick="alertZoom()"><i class="fas fa-search"></i><i class="fas fa-question"></i></button><button id="instrButton" onClick="alertInstr()"><i class="fas fa-info-circle"></i> Info</button><button id="toggleButton" onClick="togglePredicting()"><i class="fas fa-play"></i> Predict</button>'
			document.getElementById('toggleButton').style.filter = "invert(0)";
			
			// Puts the other buttons on the bottom
			document.getElementById("topButtons3").innerHTML = '<button id="trainButton" onClick="modelTrain()"><i class="fas fa-cogs"></i> Train</button><button id="saveButton" onClick="modelSave()"><i class="fas fa-download"></i> Download Model</button>';
		}
	}
	else
	{
		console.log("The 'dirrection' is not right!");
	}
	
	
	// If it was disabled before, it will stay disabled nd visa versa
	document.getElementById("zoomButton").disabled = zoomState;
	document.getElementById("instrButton").disabled = instrState;
	document.getElementById("toggleButton").disabled = toggleState;
	document.getElementById("trainButton").disabled = trainState;
	document.getElementById("saveButton").disabled = saveState;
}

// Becuase I disable and enable the buttons alot
function able(bool) {
	
	// Toggles all the buttons
	document.getElementById("zoomButton").disabled = bool;
	document.getElementById('instrButton').disabled = bool;
	document.getElementById('toggleButton').disabled = bool;
	document.getElementById('addButton').disabled = bool;
	
	// Specially toggles te train and save buttons
	if (trainAble)
	{
		document.getElementById('trainButton').disabled = bool;
		document.getElementById('saveButton').disabled = bool;
	}
}

// Shows how to maximize or minimize
function alertZoom() {
	
	alert("If on a desktop/computer/laptop, Not Mobile, it is suggested to use your browser's zoom feature to maxmize to 175%.\nOn Chrome make your way to triple-dots on the upper top of the page, bellow the [X], and maximize or minimize.");
}

// Used to go to another page
function goTo(toLink) {
	
	location.href = toLink;
}

