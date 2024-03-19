/**
 * Final Project
 * Alexander Terziyski
 * 
 * 
*/

"use strict";




// The webcam element taken from the webpage element
const videoElement = document.getElementById(`webcam`);

// Creating a hand detector, which includes telling it where
// to find the mediapipe data for it
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

// Setting up the hands detector, these are defaults I think
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Telling it the function to call when it (eventually) gets results
hands.onResults(onResults);

/**
Stores the most recent hand detection results in a global variable
so it's easy to get access to
*/
function onResults(results) {
    handResults = results;
}

// Creating a camera object that the hands detector will use
// to communicate with the webcam. This is the weirdest/most
// freaky bit for me personally (and the reason I haven't been
// able to more easily integrate the MediaPipe stuff into a more
// standard p5.js-looking package)
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({
            image: videoElement
        });
    },
    width: 1280,
    height: 720
});

// Start the camera/webcam
camera.start();

// The current results for hand detection
let handResults = undefined;

// A reference to the webcam for p5 to display it
let webcam = undefined;

/**
Creates the canvas, gets a reference to the webcam element
*/
function setup() {
    createCanvas(640, 360);
    webcam = select(`#webcam`);
}

/**
Displays the webcam feed and the hands
*/
function draw() {
    background(0);

    image(webcam, 0, 0, width, height);

    displayHands(handResults);
}

/**
Goes through all the data in all the hands and displays each point
as a strobing (random fill) circle
*/
function displayHands(results) {
    // Don't do anything if the results are empty (nothing detected)
    if (!results) return;

    // If there are results in the landmarks then let's go through them
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            // GO through every landmark for this hand
            for (let i = 0; i < landmarks.length; i++) {
                // Draw a circle at the landmark
                fill(random(255));
                noStroke();
                ellipse(landmarks[i].x * width, landmarks[i].y * height, 20);
            }
        }
    }

}