/**
 * Final Project
 * Alexander Terziyski
 * 
 * This project utilizes the p5.js library and Mediapipe Hands model to interact with hand gestures captured via webcam. 
 * It synthesizes speech based on hand movements, mapping hand position to pitch and utilizing different voices.
 */

"use strict";

// Initialize speech synthesizer
const speechSynthesizer = new p5.Speech();

// Initialize variables for webcam, hand tracking, and sound data
let mic;
let startMillis;
let soundData = [];

// Get reference to video element
const videoElement = document.getElementById(`webcam`);

// Initialize Mediapipe Hands model
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

// Set options for the hands model
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Callback function for hands detection results
function onResults(results) {
    handResults = results;
}

// Initialize camera using webcam video element and hands model
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({
            image: videoElement
        });
    },
    width: 1280,
    height: 720
});

// Start camera
camera.start();

// Initialize variables for hand results and webcam
let handResults = undefined;
let webcam = undefined;

function setup() {
    createCanvas(640, 360); // Create canvas for drawing
    webcam = select(`#webcam`); // Select webcam video element
}

function draw() {
    background(0); // Set background color
    image(webcam, 0, 0, width, height); // Display webcam feed
    displayHands(handResults); // Display hand landmarks
}

// Function to display hand landmarks
function displayHands(results) {
    if (!results) return;

    if (results.multiHandLandmarks) {
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            let landmarks = results.multiHandLandmarks[i];
            let handY = landmarks[0].y * height;

            let pitch = mapHandToPitch(handY); // Map hand position to pitch

            speechSynthesizer.setPitch(pitch); // Set synthesizer pitch
            speechSynthesizer.setVoice(voices[i]); // Set synthesizer voice

            speechSynthesizer.speak('oooooooooooooooooo'); // Speak synthesized speech

            // Display hand landmarks
            for (let j = 0; j < landmarks.length; j++) {
                let x = landmarks[j].x * width;
                let y = landmarks[j].y * height;
                fill(random(255)); // Random color for each landmark
                noStroke();
                ellipse(x, y, 20); // Draw landmark as ellipse
            }
        }
    }
}

// Function to map hand position to pitch
function mapHandToPitch(y) {
    let pitch = map(y, 0, height, 0, 2); // Map hand position to pitch range
    return constrain(pitch, 0, 2); // Constrain pitch within range
}

// Array to store synthesizer voices
let voices = ['Google UK English Female', 'Google UK English Male'];
