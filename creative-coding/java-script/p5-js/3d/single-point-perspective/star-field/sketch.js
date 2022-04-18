class Star {
    // Random position from center point.
    x = random(-width / 2, width / 2);
    y = random(-height / 2, height / 2);
    z = random(CANVAS_DEPTH / 4, CANVAS_DEPTH);
    r = STAR_SIZE;

    // Previous 'z' for streaking behaviour.
    pz = 0;

    constructor(x, y, z, r) {
        if (x || x === 0) {
            this.x = x;
        }
        if (y || y === 0) {
            this.y = y;
        }
        if (z || z === 0) {
            this.z = z;
        }
        if (r || r === 0) {
            this.r = r;
        }
    }

    update = () => {
        // Move the z-index toward the viewport.
        this.pz = this.z;
        this.z = this.z - velocity;
    };

    render = () => {
        // Reset stars that have proceeded to in front of the viewport
        //
        if (this.z < 1) {
            this.reset();
        }

        // 2.5 3D Transform from center perspective point.
        //
        // We do not alter the position of x, y. They are fixed.
        // We calculate the ratio of 'x' and 'y' w.r.t 'z'.
        // So the smaller the value of 'z', the closer the item is to the viewport and
        // the more it is translated along it's axis point.
        // This will cause the vector to move slowly to begin with then appear to accelerate.
        //
        //
        // 1a. Calculate the ratio of 'x' w.r.t 'z' to produce a value between [0..1].
        // 1b. Calculate the ratio of 'x' w.r.t 'z' to produce a value between [0..1].
        // 2a. Map this ratio to [0, viewport-width] for 'x'.
        // 2b. Map this ration to [0, viewport-height] for 'y'.
        const sx = map(this.x / this.z, 0, 1, 0, width);
        const sy = map(this.y / this.z, 0, 1, 0, height);
        if (DEBUG) {
            console.log(`x: ${this.x}, y: ${this.y}`);
            console.log(`z: ${this.z}`);
            console.log(`sx: ${sx}, sy: ${sy}`);
        }

        // Draw Star
        //
        if (IsShowStars) {
            // Stars appear smaller the further away they are. (Deeper into the canvas).
            const size = map(this.z, 0, CANVAS_DEPTH, this.r, 0);
            fill(255);
            noStroke();
            ellipse(sx, sy, size, size);
        }

        // Draw Start Streak
        //
        if (IsShowStarStreaks) {
            const psx = map(this.x / this.pz, 0, 1, 0, width);
            const psy = map(this.y / this.pz, 0, 1, 0, height);
            stroke(255);
            line(psx, psy, sx, sy);
        }

        this.update();
    };

    reset = () => {
        this.x = random(-width / 2, width / 2);
        this.y = random(-height / 2, height / 2);
        this.z = random(CANVAS_DEPTH / 4, CANVAS_DEPTH);
        this.pz = 0;
    };
}

// Canvas Configuration
//
const DEBUG = false;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const CANVAS_DEPTH = 400;
const CANVAS_BACKGROUND = 50;

// Stars Configuration
//
const NUM_STARS = 500;
const STAR_SIZE = 5;
const SHOW_STARS = false;
let IsShowStars = SHOW_STARS;
let showStarsCheckbox;
const handleShowStarsCtrlEvent = () => {
    IsShowStars = showStarsCheckbox.checked();
};
const stars = [];

// Star Steaks Configuration
//
const SHOW_STAR_STREAKS = true;
let IsShowStarStreaks = SHOW_STAR_STREAKS;
let showStarStreaksCheckbox;
const handleShowStarStreaksCtrlEvent = () => {
    IsShowStarStreaks = showStarStreaksCheckbox.checked();
};

// Star z-axis Velocity Configuration
//
const MIN_VELOCITY = 0;
const MAX_VELOCITY = 10;
const MOUSE_VELOCITY_CTRL = false;
let IsMouseVelocityCtrlEnabled = MOUSE_VELOCITY_CTRL;
let velocity = (MAX_VELOCITY - MIN_VELOCITY) / 2;
let enableVelocityCtrlCheckbox;
const handleEnableVelocityCtrlEvent = () => {
    IsMouseVelocityCtrlEnabled = enableVelocityCtrlCheckbox.checked();
};

// Viewport Origin
//
const CANVAS_ORIGIN = 'canvas';
const NORMALISED_ORIGIN = 'normalised';
const ORIGIN_TYPE = NORMALISED_ORIGIN;
let originCtrlRadio;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let i = 0; i < NUM_STARS; i++) {
        stars.push(new Star());
    }

    showStarsCheckbox = createCheckbox('Show Stars', IsShowStars);
    showStarsCheckbox.changed(handleShowStarsCtrlEvent);

    showStarStreaksCheckbox = createCheckbox('Show Star Streaks', IsShowStarStreaks);
    showStarStreaksCheckbox.changed(handleShowStarStreaksCtrlEvent);

    enableVelocityCtrlCheckbox = createCheckbox('Velocity Control', IsMouseVelocityCtrlEnabled);
    enableVelocityCtrlCheckbox.changed(handleEnableVelocityCtrlEvent);

    originCtrlRadio = createRadio();
    originCtrlRadio.option(CANVAS_ORIGIN, CANVAS_ORIGIN);
    originCtrlRadio.option(NORMALISED_ORIGIN, NORMALISED_ORIGIN);
    originCtrlRadio.selected(ORIGIN_TYPE);
}

function draw() {
    background(CANVAS_BACKGROUND);
    // Move the origin of all co-ordinates from the top left to the center.
    // This is where we want the perspective origin to be.
    // Invert the y-axis to get a WebGL based co-ordinate system.
    if (originCtrlRadio.value() === NORMALISED_ORIGIN) {
        translate(width / 2, height / 2);
        scale(1, -1);
    }

    if (IsMouseVelocityCtrlEnabled) {
        velocity = map(mouseX, 0, width, MIN_VELOCITY, MAX_VELOCITY);
    }

    stars.forEach((star) => {
        star.render();
    });
}
