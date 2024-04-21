/**
 * Final Project
 * Alexander Terziyski
 * 
 * This project utilizes the p5.js library and Mediapipe Hands model to interact with hand gestures captured via webcam. 
 * It synthesizes speech based on hand movements, mapping hand position to pitch and utilizing different voices. 
 * Users can input a word by typing in the provided input field and pressing enter. The word will be repeated continuously 
 * until the user enters a new word. Users can explore different synthesizer and text effects by moving their hands in 
 * various positions relative to the detected landmarks. Different effects, such as high pitch, low pitch, faster pronunciation, 
 * and slower pronunciation, are activated by hovering the index finger over corresponding ellipses on the screen. Additionally, 
 * hovering the index finger over the "Language Randomizer" ellipse changes the voice synthesizer randomly, providing an 
 * interactive experience for users to experiment with speech synthesis using hand gestures.
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

// Initialize variable to store language ellipse position
let voiceEllipseX, voiceEllipseY;

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

    // Define position of the new ellipse
    voiceEllipseX = width / 2;
    voiceEllipseY = height - 50;

}

// Function to draw the ellipses on the screen and repeat words spoken
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

    // Display randomizer ellipse
    fill(255, 255, 0); // Yellow color
    ellipse(voiceEllipseX, voiceEllipseY, 40, 40);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("Language Randomizer", voiceEllipseX, voiceEllipseY + 30);

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

// Update displayHands function to include checking left and right index finger positions
function displayHands(results) {
    if (!results) return;

    // Separate left and right hand processing
    let leftHandFound = false;
    let rightHandFound = false;

    if (results.multiHandLandmarks) {
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            let landmarks = results.multiHandLandmarks[i];

            // Determine hand side (left or right)
            let handSide = landmarks[0].x * width < width / 2 ? 'left' : 'right';

            // Process left hand
            if (handSide === 'left') {
                leftHandFound = true;

                // Display landmarks and word effects only for the left hand
                let handY = landmarks[0].y * height;

                let pitch = mapHandToPitch(handY); // Map hand position to pitch

                speechSynthesizer.setPitch(pitch); // Set synthesizer pitch
                speechSynthesizer.setVoice(voices[i]); // Set synthesizer voice

                // Get the position of the tip of the index finger
                let indexTipX = landmarks[8].x * width;
                let indexTipY = landmarks[8].y * height;

                // Determine if the tip of the index finger is within the bounding box of each ellipse
                let leftIndexWithinEllipse1 = dist(indexTipX, indexTipY, ellipse1X, ellipse1Y) < 30;
                let leftIndexWithinEllipse2 = dist(indexTipX, indexTipY, ellipse2X, ellipse2Y) < 30;
                let leftIndexWithinEllipse3 = dist(indexTipX, indexTipY, ellipse3X, ellipse3Y) < 30;
                let leftIndexWithinEllipse4 = dist(indexTipX, indexTipY, ellipse4X, ellipse4Y) < 30;
                let voiceEllipseWithin = dist(indexTipX, indexTipY, voiceEllipseX, voiceEllipseY) < 20;

                // Set fill color based on left index finger tip position
                if (leftIndexWithinEllipse1 || leftIndexWithinEllipse2 || leftIndexWithinEllipse3 || leftIndexWithinEllipse4 || voiceEllipseWithin) {
                    fill(0, 255, 0); // Green if within ellipses or language randomizer
                } else {
                    fill(255, 0, 0); // Red otherwise
                }

                // Draw landmarks for the left hand
                for (let j = 0; j < landmarks.length; j++) {
                    let x = landmarks[j].x * width;
                    let y = landmarks[j].y * height;

                    noStroke();
                    ellipse(x, y, 20); // Draw landmark as ellipse

                    // Store the position of the left index finger
                    if (j === 8) {
                        leftIndexX = x;
                        leftIndexY = y;
                    }

                    // Randomize voice if finger is hovering over voice ellipse
                    if (voiceEllipseWithin) {
                        let randomVoiceIndex = floor(random(voices.length));
                        speechSynthesizer.setVoice(voices[randomVoiceIndex]);
                    }
                }

                // Display the typed word with effects based on its position
                let style = getWordStyle(leftIndexX, leftIndexY);
                displayStyledWord(inputWord, leftIndexX, leftIndexY, style);
            }

            // Process right hand
            if (handSide === 'right') {
                rightHandFound = true;

                // Display fingertip color changes only for the right hand
                for (let j = 0; j < landmarks.length; j++) {
                    let x = landmarks[j].x * width;
                    let y = landmarks[j].y * height;

                    // Determine if the point is within the bounding box of each ellipse
                    let rightIndexWithinEllipse1 = dist(x, y, ellipse1X, ellipse1Y) < 30;
                    let rightIndexWithinEllipse2 = dist(x, y, ellipse2X, ellipse2Y) < 30;
                    let rightIndexWithinEllipse3 = dist(x, y, ellipse3X, ellipse3Y) < 30;
                    let rightIndexWithinEllipse4 = dist(x, y, ellipse4X, ellipse4Y) < 30;
                    let voiceEllipseWithin = dist(x, y, voiceEllipseX, voiceEllipseY) < 20;

                    // Set fill color based on right index finger position
                    if (j === 8) { // Right index finger
                        if (rightIndexWithinEllipse1 || rightIndexWithinEllipse2 || rightIndexWithinEllipse3 || rightIndexWithinEllipse4 || voiceEllipseWithin) {
                            fill(0, 255, 0); // Green if within ellipses or language randomizer
                        } else {
                            fill(255, 0, 0); // Red otherwise
                        }
                    }

                    noStroke();
                    ellipse(x, y, 20); // Draw landmark as ellipse

                    // Randomize voice if finger is hovering over voice ellipse
                    if (voiceEllipseWithin) {
                        let randomVoiceIndex = floor(random(voices.length));
                        speechSynthesizer.setVoice(voices[randomVoiceIndex]);
                    }
                }
            }
        }

        // Reset text effects if left hand is not found
        if (!leftHandFound) {
            let style = getWordStyle(leftIndexX, leftIndexY); // Get default style
            displayStyledWord(inputWord, leftIndexX, leftIndexY, style); // Display word with default style
        }

        // Reset synthesizer parameters if right hand is not found
        if (!rightHandFound) {
            speechSynthesizer.setPitch(1); // Reset pitch
            speechSynthesizer.setRate(1); // Reset rate
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

// Function to speak the typed word repeatedly (Currently using repeatTypedWord();)
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
let voices = [
    'Google UK English Female', 'Google UK English Male',
    'Samantha', 'Aaron', 'Albert', 'Alice', 'Alva', 'Amélie', 'Amira', 'Anna', 'Arthur', 'Bad News',
    'Bahh', 'Bells', 'Boing', 'Bubbles', 'Carmit', 'Catherine', 'Cellos', 'Damayanti',
    'Daniel (English (United Kingdom))', 'Daniel (French (France))', 'Daria', 'Eddy (German (Germany))',
    'Eddy (English (United Kingdom))', 'Eddy (English (United States))', 'Eddy (Spanish (Spain))',
    'Eddy (Spanish (Mexico))', 'Eddy (Finnish (Finland))', 'Eddy (French (Canada))', 'Eddy (French (France))',
    'Eddy (Italian (Italy))', 'Eddy (Portuguese (Brazil))', 'Ellen', 'Flo (German (Germany))',
    'Flo (English (United Kingdom))', 'Flo (English (United States))', 'Flo (Spanish (Spain))',
    'Flo (Spanish (Mexico))', 'Flo (Finnish (Finland))', 'Flo (French (Canada))', 'Flo (French (France))',
    'Flo (Italian (Italy))', 'Flo (Portuguese (Brazil))', 'Fred', 'Good News', 'Gordon',
    'Grandma (German (Germany))', 'Grandma (English (United Kingdom))', 'Grandma (English (United States))',
    'Grandma (Spanish (Spain))', 'Grandma (Spanish (Mexico))', 'Grandma (Finnish (Finland))',
    'Grandma (French (Canada))', 'Grandma (French (France))', 'Grandma (Italian (Italy))', 'Grandma (Portuguese (Brazil))',
    'Grandpa (German (Germany))', 'Grandpa (English (United Kingdom))', 'Grandpa (English (United States))',
    'Grandpa (Spanish (Spain))', 'Grandpa (Spanish (Mexico))', 'Grandpa (Finnish (Finland))', 'Grandpa (French (Canada))',
    'Grandpa (French (France))', 'Grandpa (Italian (Italy))', 'Grandpa (Portuguese (Brazil))', 'Hattori',
    'Helena', 'Ioana', 'Jacques', 'Jester', 'Joana', 'Junior', 'Kanya', 'Karen', 'Kathy',
    'Kyoko', 'Lana', 'Laura', 'Lekha', 'Lesya', 'Li-Mu', 'Linh', 'Luciana', 'Majed', 'Marie',
    'Martha', 'Martin', 'Meijia', 'Melina', 'Milena', 'Moira', 'Montse', 'Mónica', 'Nicky', 'Nora',
    'O-Ren', 'Organ', 'Paulina', 'Ralph', 'Reed (German (Germany))', 'Reed (English (United Kingdom))',
    'Reed (English (United States))', 'Reed (Spanish (Spain))', 'Reed (Spanish (Mexico))', 'Reed (Finnish (Finland))',
    'Reed (French (Canada))', 'Reed (Italian (Italy))', 'Reed (Portuguese (Brazil))', 'Rishi', 'Rocko (German (Germany))',
    'Rocko (English (United Kingdom))', 'Rocko (English (United States))', 'Rocko (Spanish (Spain))', 'Rocko (Spanish (Mexico))',
    'Rocko (Finnish (Finland))', 'Rocko (French (Canada))', 'Rocko (French (France))', 'Rocko (Italian (Italy))', 'Rocko (Portuguese (Brazil))',
    'Sandy (German (Germany))', 'Sandy (English (United Kingdom))', 'Sandy (English (United States))', 'Sandy (Spanish (Spain))',
    'Sandy (Spanish (Mexico))', 'Sandy (Finnish (Finland))', 'Sandy (French (Canada))', 'Sandy (French (France))', 'Sandy (Italian (Italy))',
    'Sandy (Portuguese (Brazil))', 'Sara', 'Satu', 'Shelley (German (Germany))', 'Shelley (English (United Kingdom))',
    'Shelley (English (United States))', 'Shelley (Spanish (Spain))', 'Shelley (Spanish (Mexico))', 'Shelley (Finnish (Finland))',
    'Shelley (French (Canada))', 'Shelley (French (France))', 'Shelley (Italian (Italy))', 'Shelley (Portuguese (Brazil))', 'Sin-ji',
    'Tarik', 'Tessa', 'Thomas', 'Ting-Ting', 'Tom', 'Tracy', 'Vanessa', 'Vicki', 'Victoria', 'Victoria (French (Canada))',
    'Victoria (French (France))', 'Victoria (Italian (Italy))', 'Victoria (Portuguese (Brazil))', 'Vincent', 'Xander', 'Yelda',
    'Yuna', 'Yuri', 'Zosia', 'Aditi', 'Raveena', 'Ivy', 'Joey', 'Justin', 'Kendra', 'Kimberly', 'Matthew', 'Nicole', 'Russell', 'Amy', 'Brian', 'Emma', 'Joanna', 'Salli', 'Conchita', 'Enrique', 'Miguel', 'Penélope', 'Chantal', 'Céline', 'Mathieu', 'D'
];
