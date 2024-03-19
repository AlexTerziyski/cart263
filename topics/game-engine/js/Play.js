

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
        console.log(this.shot); // Log the initial state of shot variable

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
            console.log('asdasd'); // Log pointer down event
            this.createArrow(); // Call method to create arrow
        });
        this.input.on('pointerup', (pointer) => { // Event listener for pointer up
            this.shootArrow(); // Call method to shoot arrow
        });
    }

}