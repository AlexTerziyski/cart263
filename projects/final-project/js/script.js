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

// Initialize variables to store ellipse positions
let ellipse1X, ellipse1Y; // Top left corner
let ellipse2X, ellipse2Y; // Bottom left corner
let ellipse3X, ellipse3Y; // Top right corner
let ellipse4X, ellipse4Y; // Bottom right corner

// Initialize variable to store user input word
let inputWord = '';
let inputField;

// Initialize variable to store right index finger position
let rightIndexX = 0;
let rightIndexY = 0;

// Initialize variable to store left index finger position
let leftIndexX = 0;
let leftIndexY = 0;

// Initialize variable to store whether the word should be repeated
let repeatWord = false;

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
hands.onResults(onResults);

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
    createCanvas(640, 360);  // Create canvas for drawing
    webcam = select(`#webcam`); // Select webcam video element

    // Define positions of the four ellipses
    let margin = 50;
    ellipse1X = margin;
    ellipse1Y = margin;
    ellipse2X = margin;
    ellipse2Y = height - margin;
    ellipse3X = width - margin;
    ellipse3Y = margin;
    ellipse4X = width - margin;
    ellipse4Y = height - margin;

    // Create input field
    inputField = createInput();
    inputField.position(width / 2 - 100, height / 2);
    inputField.size(200, 20);
    inputField.attribute('placeholder', 'Type your word');
    inputField.changed(startRepeating); // Call startRepeating when enter is pressed
}

function draw() {
    background(0); // Set background color
    image(webcam, 0, 0, width, height); // Display webcam feed
    displayHands(handResults); // Display hand landmarks

    // Display four ellipses
    // Ellipse 1 (Top left corner)
    fill(255, 0, 0); // Red color
    ellipse(ellipse1X, ellipse1Y, 60, 60); // Larger ellipse
    fill(255); // White text color
    textSize(12); // Text size
    textAlign(CENTER, TOP); // Text alignment
    text("High Pitch", ellipse1X, ellipse1Y + 40); // Text below ellipse

    // Ellipse 2 (Bottom left corner)
    fill(0, 255, 0); // Green color
    ellipse(ellipse2X, ellipse2Y, 60, 60); // Larger ellipse
    fill(255); // White text color
    textSize(12); // Text size
    textAlign(CENTER, TOP); // Text alignment
    text("Low Pitch", ellipse2X, ellipse2Y - 40); // Text above ellipse

    // Ellipse 3 (Top right corner)
    fill(0, 0, 255); // Blue color
    ellipse(ellipse3X, ellipse3Y, 60, 60); // Larger ellipse
    fill(255); // White text color
    textSize(12); // Text size
    textAlign(CENTER, TOP); // Text alignment
    text("Faster Pronunciation", ellipse3X, ellipse3Y + 40); // Text below ellipse

    // Ellipse 4 (Bottom right corner)
    fill(255, 255, 0); // Yellow color
    ellipse(ellipse4X, ellipse4Y, 60, 60); // Larger ellipse
    fill(255); // White text color
    textSize(12); // Text size
    textAlign(CENTER, TOP); // Text alignment
    text("Slower Pronunciation", ellipse4X, ellipse4Y - 40); // Text above ellipse

    repeatTypedWord(); // Call function to repeatedly speak the typed word
}

// Function to check if the left index finger is within the bounding box of each ellipse
function checkLeftIndexFingerPosition(x, y) {
    // Check Ellipse 1
    if (dist(x, y, ellipse1X, ellipse1Y) < 30) {
        // Perform high pitch effect
        speechSynthesizer.setPitch(2); // Set high pitch
    }
    // Check Ellipse 2
    else if (dist(x, y, ellipse2X, ellipse2Y) < 30) {
        // Perform low pitch effect
        speechSynthesizer.setPitch(0.5); // Set low pitch
    }
    // Check Ellipse 3
    else if (dist(x, y, ellipse3X, ellipse3Y) < 30) {
        // Perform faster pronunciation effect
        speechSynthesizer.setRate(1.5); // Set faster rate
    }
    // Check Ellipse 4
    else if (dist(x, y, ellipse4X, ellipse4Y) < 30) {
        // Perform slower pronunciation effect
        speechSynthesizer.setRate(0.5); // Set slower rate
    }
    else {
        // Reset synthesizer parameters if not touching any ellipse
        speechSynthesizer.setPitch(1); // Reset pitch
        speechSynthesizer.setRate(1); // Reset rate
    }
}

// Update displayHands function to include checking left index finger position
function displayHands(results) {
    if (!results) return;

    if (results.multiHandLandmarks) {
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            let landmarks = results.multiHandLandmarks[i];
            let handY = landmarks[0].y * height;

            let pitch = mapHandToPitch(handY); // Map hand position to pitch

            speechSynthesizer.setPitch(pitch); // Set synthesizer pitch
            speechSynthesizer.setVoice(voices[i]); // Set synthesizer voice

            // Call function to check left index finger position
            checkLeftIndexFingerPosition(landmarks[8].x * width, landmarks[8].y * height);

            // Display typed word with effects based on its position
            let style = getWordStyle(landmarks[8].x * width, landmarks[8].y * height);
            displayStyledWord(inputWord, leftIndexX, leftIndexY, style);

            for (let j = 0; j < landmarks.length; j++) {
                let x = landmarks[j].x * width;
                let y = landmarks[j].y * height;
                fill(random(255)); // Random color for each landmark
                noStroke();
                ellipse(x, y, 20); // Draw landmark as ellipse

                // Store the position of the right index finger
                if (j === 8 && i === 1) {
                    rightIndexX = x;
                    rightIndexY = y;
                }

                // Store the position of the left index finger
                if (j === 8 && i === 0) {
                    leftIndexX = x;
                    leftIndexY = y;
                }
            }
        }
    }
}

// Function to map hand position to pitch
function mapHandToPitch(y) {
    let pitch = map(y, 0, height, 0, 2); // Map hand position to pitch range
    return constrain(pitch, 0, 2); // Constrain pitch within range
}

// Function to determine the style of the word based on its position
function getWordStyle(x, y) {
    let style = {
        fontSize: 24,
        textStyle: BOLD,
        textColor: color(255),
        rotation: 0
    };

    // Calculate distance from center to determine quadrant
    let centerX = width / 2;
    let centerY = height / 2;
    let distance = dist(x, y, centerX, centerY);

    // Vary the style based on the quadrant and distance from center
    if (x < centerX && y < centerY) { // Top-left quadrant
        style.fontSize = map(distance, 0, centerX, 24, 36);
        style.textStyle = BOLD;
        style.textColor = color(random(255), random(255), random(255));
        style.rotation = random(-PI / 4, PI / 4);
    } else if (x < centerX && y > centerY) { // Bottom-left quadrant
        style.fontSize = map(distance, 0, centerX, 24, 36);
        style.textStyle = NORMAL;
        style.textColor = color(random(255), random(255), random(255));
        style.rotation = random(-PI / 4, PI / 4);
    } else if (x > centerX && y < centerY) { // Top-right quadrant
        style.fontSize = map(distance, 0, centerX, 24, 36);
        style.textStyle = BOLD;
        style.textColor = color(random(255), random(255), random(255));
        style.rotation = random(PI / 4, 3 * PI / 4);
    } else { // Bottom-right quadrant
        style.fontSize = map(distance, 0, centerX, 24, 36);
        style.textStyle = NORMAL;
        style.textColor = color(random(255), random(255), random(255));
        style.rotation = random(PI / 4, 3 * PI / 4);
    }

    return style;
}

// Function to display the word with specified style
function displayStyledWord(word, x, y, style) {
    push();
    translate(x, y);
    rotate(style.rotation);
    textAlign(CENTER, CENTER);
    textSize(style.fontSize);
    textStyle(style.textStyle);
    fill(style.textColor);
    text(word, 0, 0);
    pop();
}

// Function to speak the typed word repeatedly
function startRepeating() {
    inputWord = inputField.value(); // Get the typed word
    repeatWord = true; // Set repeatWord to true
    speechSynthesizer.speak(inputWord); // Speak the typed word initially
}

// Function to repeatedly speak the typed word
function repeatTypedWord() {
    if (repeatWord) {
        speechSynthesizer.speak(inputWord); // Speak the typed word
    }
}



// Array to store synthesizer voices
let voices = ['Google UK English Female', 'Google UK English Male'];