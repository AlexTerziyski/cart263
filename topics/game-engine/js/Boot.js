class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: `boot`
        });
    }

    create() {
        let style = {
            fontFamily: `sans-serif`,
            fontSize: `40px`,
            color: `#ffffff`
        };
        let loadingString = `Loading...`;
        this.add.text(100, 200, loadingString, style);

        this.scene.start(`play`);
    }

    update() {

    }
}