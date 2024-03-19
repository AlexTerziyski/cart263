class Play extends Phaser.Scene {
    constructor() {
        super({
            key: `play`
        });
    }

    create() {
        let style = {
            fontFamily: `sans-serif`,
            fontSize: `40px`,
            color: `#ffffff`
        };
        let gameDescription = `Think of a number... wrong!`;
        this.add.text(100, 200, gameDescription, style);
    }

    update() {
        console.log(`Play scene updated`);
    }
}