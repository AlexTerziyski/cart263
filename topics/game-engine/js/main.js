"use strict";
// Default setup config in main.js for Phaser
let config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 1500,
    physics: {
        default: `arcade`
    },
    scene: [Boot, Play]
};

let game = new Phaser.Game(config);