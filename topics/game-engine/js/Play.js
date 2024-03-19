

class Play extends Phaser.Scene {
    constructor() {
        super({
            key: `play`
        });
        this.shot = false;
        this.bow = null;
        this.bag = null;
        this.arrow = null;
        this.angle = null;
        this.newArrow = null;
        this.score = 0;
        this.x = null;
        this.y = null;
        this.oldx = null;
        this.oldy = null;
        this.xVel = null;
        this.yVel = null;
        this.g = 0.25;
        this.sb = null;
        this.arrowCreated = false;
    }

}