

"use strict";

// Initializes the handpose model and webcam video capture
let handpose;
let video;
// Stores the predictions from the handpose model
let predictions = [];

// Threshold for determining if a finger is extended
let someThreshold = 50;

// Game state variables
let countdown = 3;
let countdownActive = false;
let lastUpdateTime = 0;
let playerGesture = "";
let computerGesture = "";
let resultText = "";

/**
 * Sets up the canvas, initializes webcam capture, handpose model, and prepares for game start.
 */
function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);

    handpose = ml5.handpose(video, () => console.log('Model loaded'));
    handpose.on("predict", results => predictions = results);
    video.hide();

    lastUpdateTime = millis();
}

/**
 * Main game loop: updates the game state, handles the countdown, and displays the game interface.
 */
function draw() {
    image(video, 0, 0, width, height);
    drawKeypoints();

    // Always determine and display the current gesture
    let currentGesture = determineGesture(); // Determine the current gesture
    fill(255); // White color for text
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Your Gesture: ${currentGesture}`, 10, 10); // Display current gesture at the top left

    // Handles countdown
    if (countdownActive) {
        let currentTime = millis();
        if (currentTime - lastUpdateTime >= 1000) { // 1000 milliseconds = 1 second
            countdown -= 1;
            lastUpdateTime = currentTime;
        }

        if (countdown <= 0) {
            // Countdown finished, compare the gesture at the moment the countdown finished
            playerGesture = currentGesture; // Use the last detected gesture as the player's gesture
            computerGesture = randomGesture();
            resultText = determineWinner(playerGesture, computerGesture);
            countdownActive = false; // Stop the countdown
            countdown = 3; // Reset for next time
        }
    }

    // Display the countdown or result
    textSize(32);
    textAlign(CENTER, CENTER);
    if (countdownActive) {
        text(countdown.toString(), width / 2, height / 2);
    } else {
        text(resultText, width / 2, height / 2 + 20);
    }
}

/**
 * Handles key press events to start the game and manage game flow.
 */
function keyPressed() {
    if (key === ' ' && !countdownActive) { // Space bar to start
        countdownActive = true;
        lastUpdateTime = millis(); // Reset timer
        resultText = ""; // Clear previous result
    }
}





