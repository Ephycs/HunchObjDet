// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image Classification using Feature Extractor with MobileNet
=== */

// Grabs all the DOM elements
var video = document.getElementById('video');
var loading = document.getElementById('loading');
var videoStatus = document.getElementById('videoStatus');
var add = document.getElementById('add');
var inputText = document.getElementById('inputText');
var inputInfo = document.getElementById('inputInfo');
var amountOfName = document.getElementById('amountOfName');
var amountOfCount = document.getElementById('amountOfCount');
var train = document.getElementById('train');
var loss = document.getElementById('loss');
var predict = document.getElementById('predict');
var result = document.getElementById('result');

// Used to tell if put multiple images of the same thing in
var preStr = "";

var isPredict = true;

// A variable to store the total loss
let totalLoss = 0;

// Create a webcam capture
// Stole from https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
.then(function(stream) {
  var video = document.querySelector('video');
  // Older browsers may not have srcObject
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    // Avoid using this in new browsers, as it is going away.
    video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function(e) {
    video.play();
  };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
// Create a new classifier using those features
const classifier = featureExtractor.classification(video, videoReady);

// A function to be called when the model has been loaded
function modelLoaded() {
	
	loading.innerText = 'Model loaded!';
}

// A function to be called when the video is finished loading
function videoReady() {
	
	videoStatus.innerText = 'Video ready!';
}

// When the add button is pressed, add the current frame
// from the video with a label of inputText to the classifier
add.onClick = function () {
	
	console.log("Took a picture");
	
	var str = inputText.value;
	str.toLowerCase();

	amountOfName.innerHTML = str;
	amountOfCount.innerText = Number(amountOfCount.innerText) + 1;
	
	// Will check if you are adding a new image to the model
	if (preStr != str)
	{
		preStr = str;
		
		amountOfCount.innerText = 0;
		
	}
	
	classifier.addImage(str);
}

// When the train button is pressed, train the classifier
// With all the new images
train.onClick = function () {
	
	classifier.train(function(lossValue) {
		
		if (lossValue) 
		{
			totalLoss = lossValue;
			loss.innerHTML = 'Loss: ' + totalLoss;
		} 
		else 
		{
			loss.innerHTML = 'Done Training! Final Loss: ' + totalLoss;
		}
	});
}

// Shows the results
function gotResults(err, res) {
	
	// Checks to see if the play button is waiting to be pressed, aka shows "Predict" on it
	if (isPredict)
	{
		// Displays any error
		if (err) 
		{
			alert(err);
		}
		else
		{
			result.innerText = res;
			classifier.classify(gotResults);
		}
	}
}

// Start predicting when the predict button is clicked
predict.onClick = function () {
	
	// The button is not predicting
	if (isPredict == true)
	{
		// Changes the button to a Stop button
		isPredict = false;
		predict.innerHTML = "Stop";
		
		// Starts predicts
		classifier.classify(gotResults);
	}
	// The button is predicting
	else
	{
		// Changes the button to a Predict button
		isPredict = false;
		predict.innerHTML = "Predict";
		
		// Clears results
		result.innerHTML = "";
	}
}