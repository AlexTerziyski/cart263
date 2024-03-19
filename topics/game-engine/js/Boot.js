class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: 'boot'
        });
    }

    preload() {
        // Loads the images/sprites needed for the game
        this.load.image('arrow', 'assets/images/arrow.png');
        this.load.image('bow', 'assets/images/bow.png');
        this.load.image('bag', 'assets/images/bag.png');
        this.load.image('bg', 'assets/images/bg.png');
    }

    create() {
        // Once assets are preloaded, start the Play scene
        this.scene.start('play');
    }
}
