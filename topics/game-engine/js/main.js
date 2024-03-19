"use strict";

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