/**
 * AI-Jam
 * Alex Terziyski
 * 
 * Rock, Paper, Scissors Game with Hand Gesture Recognition
 * Using p5.js and ml5.js Handpose Model
 * 
 * This interactive game uses your webcam to recognize hand gestures for playing Rock, Paper, Scissors against the computer.
 * Make sure your hand is visible to the webcam. Press the space bar to start the game after positioning your hand gesture.
 * The game features a 3-second countdown before each round to allow time for changing gestures. Press Spacebar again to fight the computer!
 */

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

/**
 * Draws keypoints detected by the handpose model on the canvas.
 */
function drawKeypoints() {
    for (let i = 0; i < predictions.length; i++) {
        const prediction = predictions[i];
        for (let j = 0; j < prediction.landmarks.length; j++) {
            const keypoint = prediction.landmarks[j];
            fill(0, 255, 0);
            noStroke();
            ellipse(keypoint[0], keypoint[1], 10, 10);
        }
    }
}

/**
 * Function for random gesture the computer will use.
 */
function randomGesture() {
    const gestures = ["Rock", "Paper", "Scissors"];
    const index = Math.floor(Math.random() * gestures.length);
    return gestures[index];
}

/**
 * Compares the player's gesture against the computer's to determine the round's winner.
 * Implements the classic rules of Rock, Paper, Scissors to evaluate the outcome.
 */
function determineWinner(player, computer) {
    if (player === computer) {
        return `Draw! Both chose ${player}`;
    } else if ((player === "Rock" && computer === "Scissors") ||
        (player === "Scissors" && computer === "Paper") ||
        (player === "Paper" && computer === "Rock")) {
        return `You win! ${player} beats ${computer}`;
    } else {
        return `You lose! ${computer} beats ${player}`;
    }
}

/**
 * Analyzes the current hand pose to determine the gesture being made by the player.
 * Checks the extension of each finger to classify the gesture as Rock, Paper, or Scissors.
 */
function determineGesture() {
    if (predictions.length > 0) {
        let hand = predictions[0];
        let fingers = ['thumb', 'indexFinger', 'middleFinger', 'ringFinger', 'pinky'];
        let extendedFingers = fingers.map(finger => {
            let tipY = hand.annotations[finger][3][1];
            let baseY = hand.annotations[finger][0][1];
            // Check if the finger is extended by comparing tip to base Y position
            return tipY < baseY - someThreshold;
        });

        let extendedCount = extendedFingers.filter(isExtended => isExtended).length;
        if (extendedCount === 0) {
            return "Rock";
        } else if (extendedCount === 5) {
            return "Paper";
        } else {
            let indexExtended = extendedFingers[1]; // Index finger extended
            let middleExtended = extendedFingers[2]; // Middle finger extended
            let otherFingersNotExtended = !extendedFingers[0] && !extendedFingers[3] && !extendedFingers[4]; // Other fingers not extended

            if (indexExtended && middleExtended && otherFingersNotExtended) {
                return "Scissors";
            }
        }
    }
    return "UNKNOWN";
}



