/**
Prototype: Voices Jam
Alexander Terziyski

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

const speechSynthesizer = new p5.Speech();
const speechRecognizer = new p5.SpeechRec();
let showSubtitle = false;
let toSay = `Simon says`;
let backgroundColor = `black`;
// Defines the set sequence of colors.
let colorSequence = ["green", "red", "red", "green", "yellow", "blue", "blue", "blue", "red", "yellow"];
// Marker for current position in color sequence
let currentColorIndex = 0;


/**
Description of setup
*/
function setup() {
    createCanvas(500, 500);

    // Synthesis settings
    speechSynthesizer.setPitch(1);
    speechSynthesizer.setRate(1);
    speechSynthesizer.setVoice('Google UK English Male');

    speechSynthesizer.onStart = () => {
        showSubtitle = true;
    };
    speechSynthesizer.onEnd = () => {
        showSubtitle = false;
        speechRecognizer.start(); // Keeps the recognizer running.
    };

    speechRecognizer.onResult = handleSpeechInput;
    speechRecognizer.continuous = true;
    speechRecognizer.interimResults = true;
    speechRecognizer.start();

}


/**
Description of draw()
*/
function draw() {
    background(backgroundColor);

    if (showSubtitle) {
        textSize(36);
        text(toSay, 100, 100);
    }
}

function mousePressed() {
    // Say something
    speechSynthesizer.speak(toSay);

    // Updates to say the next color in the sequence.
    if (currentColorIndex < colorSequence.length) {
        let colorToSay = colorSequence[currentColorIndex];
        toSay = `Simon says ${colorToSay}`;
        speechSynthesizer.speak(toSay);
    }
}

function speechStarted() {
    showSubtitle = true;
}

function speechEnded() {
    showSubtitle = false;
}

function handleSpeechInput() {
    backgroundColor = speechRecognizer.resultString;
}