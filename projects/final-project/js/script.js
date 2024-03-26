/**
 * Final Project
 * Alexander Terziyski
 * 
 * 
*/

"use strict";

const speechSynthesizer = new p5.Speech();

let mic;
let startMillis;
let soundData = [];

const videoElement = document.getElementById(`webcam`);

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

function onResults(results) {
    handResults = results;
}

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({
            image: videoElement
        });
    },
    width: 1280,
    height: 720
});

camera.start();

let handResults = undefined;
let webcam = undefined;

function setup() {
    createCanvas(640, 360);
    webcam = select(`#webcam`);

    setTimeout(() => {
        speechSynthesizer.speak('');
    }, 1000);
}

function draw() {
    background(0);
    image(webcam, 0, 0, width, height);
    displayHands(handResults);
}

function displayHands(results) {
    if (!results) return;

    if (results.multiHandLandmarks) {
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            let landmarks = results.multiHandLandmarks[i];
            let handY = landmarks[0].y * height;

            let pitch = mapHandToPitch(handY);

            speechSynthesizer.setPitch(pitch);
            speechSynthesizer.setVoice(voices[i]);

            speechSynthesizer.speak('oooooooooooooooooo');

            for (let j = 0; j < landmarks.length; j++) {
                let x = landmarks[j].x * width;
                let y = landmarks[j].y * height;
                fill(random(255));
                noStroke();
                ellipse(x, y, 20);
            }
        }
    }
}

// Function to map hand position to pitch
function mapHandToPitch(y) {
    let pitch = map(y, 0, height, 0, 2);
    return constrain(pitch, 0, 2);
}

// Array to store synthesizer voices
let voices = ['Google UK English Female', 'Google UK English Male'];