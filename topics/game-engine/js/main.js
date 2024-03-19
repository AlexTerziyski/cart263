"use strict";

let config = {
    type: Phaser.AUTO,
    width: 500,
    height: 500,
    physics: {
        default: `arcade`
    },
    scene: [Boot, Play]
};

let game = new Phaser.Game(config);