/**
Prototype: Voices Jam
Alexander Terziyski

When you're ready, click on the screen to start. A British man named Simon (Simon says) will prompt you with colors.
You must repeat them in the correct order to move on in the sequence. The circles enlarge as visual indicators to what you said.
Recommended to use headphones when entering the program.
*/

"use strict";

// Initializing variables for the program
const speechSynthesizer = new p5.Speech();
const speechRecognizer = new p5.SpeechRec();

let toSay = `test123`; // Placeholder for now
let backgroundColor = `black`;

// Defines the set sequence of colors.
let colorSequence = ["green", "red", "red", "green", "yellow", "blue", "blue", "blue", "red", "yellow"];
// Marker for current position in color sequence
let currentColorIndex = 0;

// This array will hold the current expected sequence 
let expectedSequence = [];

// Circles with set properties
let circles = [
    { color: 'blue', x: 100, y: 250, size: 50, defaultSize: 50 },
    { color: 'green', x: 200, y: 250, size: 50, defaultSize: 50 },
    { color: 'red', x: 300, y: 250, size: 50, defaultSize: 50 },
    { color: 'yellow', x: 400, y: 250, size: 50, defaultSize: 50 }
];

// Current gameState is title
let gameState = 'title';


/**
 * setup()
 * This function sets up the canvas, initializes the speech synthesizer and recognizer,
 * and prepares the game to start by announcing the first color in the sequence.
 *
*/
function setup() {
    createCanvas(500, 500);

    // Synthesis settings (Simon)
    speechSynthesizer.setPitch(1);
    speechSynthesizer.setRate(1);
    speechSynthesizer.setVoice('Google UK English Male');


    speechRecognizer.onResult = handleSpeechInput;
    speechRecognizer.continuous = true;
    speechRecognizer.interimResults = true;
    speechRecognizer.start();

    expectedSequence.push(colorSequence[currentColorIndex]); // Initializes with the first color
    setTimeout(() => { // Gives a brief delay before starting
        speechSynthesizer.speak(`Simon says ${expectedSequence.join(", ")}`);
    }, 1000);
}


/**
 * draw()
 * Continuously updates the game's visuals based on its current state.
 * Displays the title screen with instructions before the game starts, and the gameplay screen with colored circles during the game.
 */
function draw() {
    if (gameState === 'title') {
        background(0); // Set a background color for the title screen
        fill(255); // Set text color
        textSize(24); // Set text size
        textAlign(CENTER, CENTER);
        text("Welcome to 'Simon Says'", width / 2, height / 3);
        textSize(16);
        text("When you're ready, click on the screen to start.\nA voice will prompt you with colors.\n You must repeat them in the correct order\n to move on in the sequence.\n\n*Use headphones when entering the program.*", width / 2, height / 2);
    } else if (gameState === 'gameplay') {
        background(backgroundColor);

        // Draw circles
        circles.forEach(circle => {
            fill(circle.color);
            ellipse(circle.x, circle.y, circle.size);
        });
    }
}

/**
 * mousePressed()
 * Handles mouse press events to transition game states and interact within the game.
 * On the title screen, a press starts the game. 
 * 
 * (During gameplay, it can trigger speech synthesis to announce the next color sequence just in case, although its not needed)
 */
function mousePressed() {
    if (gameState === 'title') {
        gameState = 'gameplay'; // Change the game state to start the gameplay
        setTimeout(() => { // Give a brief delay before starting
            speechSynthesizer.speak(`Simon says ${expectedSequence.join(", ")}`);
        }, 1000);
    } else {
        // Say something
        speechSynthesizer.speak(toSay);

        // Updates to say the next color in the sequence.
        if (currentColorIndex < colorSequence.length) {
            let colorToSay = colorSequence[currentColorIndex];
            toSay = `Simon says ${colorToSay}`;
            speechSynthesizer.speak(toSay);
        }
    }
}

/**
 * handleSpeechInput()
 * Processes speech recognition results to interact with game elements.
 * Enlarges the circle corresponding to the last recognized spoken word, visually indicating player interaction.
 */
function handleSpeechInput() {
    if (speechRecognizer.resultValue) {
        let spokenWord = speechRecognizer.resultString.toLowerCase().split(/\s+/).pop(); // Gets the last word recognized
    }
}







