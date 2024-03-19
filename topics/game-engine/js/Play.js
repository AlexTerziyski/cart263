/**
 * Game-Engine Jam
 * Alex Terziyski
 * 
 * Prototype for testing out physics some of Phaser 3 set templates, relying on mathematical calculations instead.
 * 
 * This prototype is a bow and arrow game that explores the possibility of implementing game mechanics and interactions using mathematical formulas instead of built-in physics engines.
 * Players control a bow to shoot arrows at a target bag, aiming to score points. The game features simple physics simulations for arrow trajectory and collision detection.
 * My goal was to experiment with physics interactions without necessarily using Phaser 3's gravity, velocity, physics (just to see if its possible and challenge myself). 
 * 
 * Click/Press your mouse to shoot the arrow at the bag to score points!
 */

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

    /**
     * Creates the initial scene elements and sets up event listeners.
     */
    create() {
        // Background setup
        let bg1 = this.add
            .image(0, 0, 'bg') // Add background image
            .setOrigin(0) // Set origin to top-left corner
            .setScale(1.3) // Scale the background image
            .setTint(0x3d6f9c); // Apply tint to the background

        // Player's bow and target bag setup
        this.bow = this.add.image(120, 450, 'bow'); // Add bow image
        this.bag = this.add.image(700, 450, 'bag'); // Add target bag image

        // Score display setup
        this.sb = this.add.text(600, 20, 'Score 0', { // Add score display
            fontFamily: 'Arial',
            fontSize: 30,
            color: '#ffff00'
        });

        // Title text setup
        this.add.text(60, 20, 'Game-Engine Jam', { // Add title text
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#ffff00'
        });

        // Initialize arrow
        this.createArrow(); // Call method to create arrow
        //console.log(this.shot); // Log the initial state of shot variable

        // Arrow setup
        this.arrow = this.add // Add arrow sprite
            .sprite(this.bow.x, this.bow.y, 'arrow')
            .setScale(0.5) // Scale the arrow sprite
            .setOrigin(0.5); // Set origin to the center
        this.arrow.angle = this.bow.angle; // Set initial angle of arrow
        this.x = this.oldx = this.arrow.x; // Initialize x position variables
        this.y = this.oldy = this.arrow.y; // Initialize y position variables

        // Event listeners for arrow shooting
        this.input.on('pointerdown', (pointer) => { // Event listener for pointer down
            //console.log('asdasd'); // Log pointer down event
            this.createArrow(); // Call method to create arrow
        });
        this.input.on('pointerup', (pointer) => { // Event listener for pointer up
            this.shootArrow(); // Call method to shoot arrow
        });
    }

    /**
     * Updates the game state.
     * Handles arrow visibility, movement, collision detection, and score updating.
     */
    update() {
        // If the arrow hasn't been shot yet
        if (!this.shot) {
            // Make the arrow visible
            this.arrow.setAlpha(1);
            // Calculate angle of the bow and arrow to point towards the mouse pointer
            this.angle =
                Math.atan2(
                    this.input.mousePointer.x - this.bow.x,
                    -(this.input.mousePointer.y - this.bow.y)
                ) *
                (180 / Math.PI) -
                180;
            // Apply the calculated angle to both bow and arrow
            this.bow.angle = this.arrow.angle = this.angle;
        } else { // If the arrow has been shot
            // Hide the arrow
            this.arrow.setAlpha(0);
            // Update arrow's position based on velocity and gravity
            this.x += this.xVel;
            this.y += this.yVel;
            this.yVel += this.g;
            this.newArrow.x = this.x;
            this.newArrow.y = this.y;
            // Calculate arrow's angle based on its trajectory
            this.arrowAngle =
                Math.atan2(this.x - this.oldx, -(this.y - this.oldy)) * (180 / Math.PI);
            this.newArrow.angle = this.arrowAngle;
            // Update old position variables for next update cycle
            this.oldx = this.x;
            this.oldy = this.y;
            // Check if arrow has fallen past a certain point, reset it if so
            let random = Math.random() * 80 + 500;
            if (this.newArrow.y > random) {
                this.resetArrow();
            }
            // Check if arrow has collided with the bag, update score if so
            if (this.hitTest(this.newArrow, this.bag)) {
                this.resetArrow();
                this.score = this.score + 45;
                this.sb.text = 'Score ' + this.score;
            }
        }
    }

    /**
      * Resets the arrow to its initial position and state.
      */
    resetArrow() {
        // Set shot flag to false indicating arrow is not shot
        this.shot = false;
        // Reset arrow's position to bow's position
        this.arrow.x = this.bow.x;
        this.arrow.y = this.bow.y;
        // Reset internal position variables to arrow's position
        this.x = this.oldx = this.arrow.x;
        this.y = this.oldy = this.arrow.y;
    }

    /**
     * Sets the flag indicating an arrow is created.
     */
    createArrow() {
        // Set arrowCreated flag to true
        this.arrowCreated = true;
    }

    /**
     * Handles the shooting of the arrow.
     * Creates a new arrow sprite, sets its initial properties, and calculates its velocity.
     */
    shootArrow() {
        // If arrow is not already shot
        if (!this.shot) {
            // Set shot flag to true
            this.shot = true;
            // Create a new arrow sprite at the bow's position
            this.newArrow = this.add
                .sprite(this.bow.x, this.bow.y, 'arrow')
                .setScale(0.5)
                .setOrigin(0.5)
                .setTint(0xffffff);
            // Set arrow's angle to match the bow's angle
            this.newArrow.angle = this.bow.angle;
            // Calculate arrow's velocity based on mouse pointer position relative to bow
            this.xVel = -(this.input.mousePointer.x - this.bow.x) / 6;
            this.yVel = -(this.input.mousePointer.y - this.bow.y) / 6;
        }
    }

    /**
    * Checks for collision between two objects based on their positions and sizes.
    */
    hitTest(object1, object2) {
        // Extract position and dimensions of both objects
        var left1 = parseInt(object1.x);
        var left2 = parseInt(object2.x);
        var top1 = parseInt(object1.y);
        var top2 = parseInt(object2.y);
        var width1 = parseInt(object1.displayWidth);
        var width2 = parseInt(object2.displayWidth);
        var height1 = parseInt(object1.displayHeight);
        var height2 = parseInt(object2.displayHeight);
        // Initialize horizontal and vertical collision test flags
        var horTest = false;
        var verTest = false;
        // Perform horizontal collision test
        if (
            (left1 >= left2 && left1 <= left2 + width2) ||
            (left2 >= left1 && left2 <= left1 + width1)
        ) {
            horTest = true;
        }
        // Perform vertical collision test
        if (
            (top1 >= top2 && top1 <= top2 + height2) ||
            (top2 >= top1 && top2 <= top1 + height1)
        ) {
            verTest = true;
        }
        // Return true if both horizontal and vertical tests pass, indicating collision
        return horTest && verTest;

    }
}