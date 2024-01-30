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
let backgroundColor = `blue`;

/**
Description of preload
*/
function preload() {

}


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