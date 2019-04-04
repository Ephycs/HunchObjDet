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

// Begining Alert //

alert("Warning: If the page is black: KEEP the site, but leave your browser, then return back in.\nOlder versions of Chrome, Firefox, and Safari may not be compatible with Tensorflow.js\n\nPress the 'Info' button for instructions");


/*******************************/
// Core Features
/*******************************/

function setup() {
	
	// Disables the buttons
	able(true);
	
	isPredicting = false;
	desData = [];
	
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
		
		// Gets the 'MobileNet' model through ml5
		// Gets the model classification libraries from ml5 and will use the camera
		model = ml5.imageClassifier('mobilenet', camera, modelReady);
	});
}

function modelReady() {
	
	// Debug when the mode is loaded
	console.log("MobileNet was loaded!!!");
	
	// Gets the descriptions
	preLoad();
	
	// resizes the page just in case
	windowResized();
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
				// Everything following the load must go here
				
				// Gets the data
                var data = this.responseText;
				
				// Puts into the desData
				// This will overwrite perious data in the webpage's session
				desData = data.split(",");
				
				// debugs the contents of the database
				console.log("Preload txt:");
				console.log(desData);
				
				// Heads up
				document.getElementById("upperText").innerHTML = "MobileNet loaded!";
				
				// Enables the buttons
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
		document.getElementById('toggleButton').innerHTML = "<i class='fas fa-stop'></i> Stop";
		document.getElementById('toggleButton').style.filter = "invert(1)";
		
		console.log("Starting predicting...");
		
		// Actual predicting
		predict();
	}
	else
	{
		// It is predicting
		
		// Turns predicting to false
		isPredicting = false;
		
		// Changes the predict button to "Predict"
		document.getElementById('toggleButton').innerHTML = "<i class='fas fa-play'></i> Predict";
		document.getElementById('toggleButton').style.filter = "invert(0)";
		
		// Clears previous predictions
		document.getElementById('upperText').innerHTML = "...";
		document.getElementById('upperInfo').innerHTML = "...";
		
		console.log("Stopping predicting...");
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
			// Debugs top result
			//console.log(res[0].className);
			
			// Gets the top result
			document.getElementById('upperText').innerHTML = res[0].className;
			
			// Finds the result in the database
			findData(res[0].className);
			
			// Predicts again
			predict();
		}
	}
}

// Predicting 
function predict() {
	
	//Actual predicting
	model.predict(gotResult);
}

// draws the camera to the canvas
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
// Extra
/*******************************/

// Intructions button
function alertInstr() {
	
	alert("1) Press the 'Predict' button to start or stop predicting objects.");
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
			button.style.fontSize = "0.8em";
		}
		for (p of document.body.getElementsByTagName("p"))
		{
			p.style.fontSize = "0.8em";
		}
		document.getElementById("upperText").style.fontSize = "1.3em";
		document.getElementById("upperInfo").style.fontSize = "1em";
		
		// Moves all the content to the right
		document.getElementById("upperDiv").style.width = "35%";
		document.getElementById("content").style.width = "35%";
		
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
	
	if (dirrection == "down")
	{
		if (isPredicting)
		{
			// It is predicting
			
			// Clears the upper buttons
			document.getElementById("topButtons1").innerHTML = "";
			
			// locates the buttons to the buttom
			document.getElementById("topButtons2").innerHTML = '<button id="instrButton" onClick="alertInstr()"><i class="fas fa-info-circle"></i> Info</button><button id="toggleButton" onClick="togglePredicting()"><i class="fas fa-play"></i> Predict</button>'
			
			// Changes the predict button to "Stop"
			document.getElementById('toggleButton').innerHTML = "<i class='fas fa-stop'></i> Stop";
			document.getElementById('toggleButton').style.filter = "invert(1)";
		}
		else
		{
			// It is not
			
			// Clears the upper buttons
			document.getElementById("topButtons1").innerHTML = "";
			
			// locates the buttons to the buttom
			document.getElementById("topButtons2").innerHTML = '<button id="instrButton" onClick="alertInstr()"><i class="fas fa-info-circle"></i> Info</button><button id="toggleButton" onClick="togglePredicting()"><i class="fas fa-play"></i> Predict</button>'
			document.getElementById('toggleButton').style.filter = "invert(0)";
		}
	}
	else if (dirrection == "up")
	{
		if (isPredicting)
		{
			// It is predicting
			
			// Clears the upper buttons
			document.getElementById("topButtons2").innerHTML = "";
			
			// locates the buttons to the buttom
			document.getElementById("topButtons1").innerHTML = '<button id="instrButton" onClick="alertInstr()"><i class="fas fa-info-circle"></i> Info</button><button id="toggleButton" onClick="togglePredicting()"><i class="fas fa-play"></i> Predict</button>'
			
			// Changes the predict button to "Stop"
			document.getElementById('toggleButton').innerHTML = "<i class='fas fa-stop'></i> Stop";
			document.getElementById('toggleButton').style.filter = "invert(1)";
		}
		else
		{
			// It is not
			
			// Clears the upper buttons
			document.getElementById("topButtons2").innerHTML = "";
			
			// locates the buttons to the buttom
			document.getElementById("topButtons1").innerHTML = '<button id="instrButton" onClick="alertInstr()"><i class="fas fa-info-circle"></i> Info</button><button id="toggleButton" onClick="togglePredicting()"><i class="fas fa-play"></i> Predict</button>'
			document.getElementById('toggleButton').style.filter = "invert(0)";
		}
	}
	else
	{
		console.log("The 'dirrection' is not right!");
	}
}

// Becuase I disable and enable the buttons alot
function able(bool) {
	
	document.getElementById('instrButton').disabled = bool;
	document.getElementById('toggleButton').disabled = bool;
}

// Used to go to another page
function goTo(toLink) {
	
	location.href = toLink;
}

