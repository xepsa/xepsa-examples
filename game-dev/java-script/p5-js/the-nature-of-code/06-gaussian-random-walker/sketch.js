class Walker {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // Interface

    update = () => {
        this._step();
    };

    draw = () => {
        ellipse(this.x, this.y, this.w, this.h);
    };

    // Methods

    _step = () => {
        this.x += (this._montecarlo() * this.w) / 4;
        this.y += (this._montecarlo() * this.h) / 4;
    };

    _montecarlo = () => {
        // We do this “forever” until we find a qualifying random value.
        while (true) {
            // Pick a random value.
            let r1 = random(0, 1);
            // Assign a probability.
            let probability = Math.pow(1.0 - r1, 2);

            // Pick a second random value.
            let r2 = random(0, 1);

            //[full] Does it qualify?  If so, we’re done!
            if (r2 < probability) {
                return random(0, 1) > 0.5 ? r1 : -r1;
            }
        }
    };
}

const BG_COLOR = 50;
const CANVAS_W = 1000;
const CANVAS_H = 500;

let walker;
const clear = false;

function preload() {}

function setup() {
    createCanvas(CANVAS_W, CANVAS_H);
    background(BG_COLOR);
    const pos = { x: width / 2, y: height / 2 };
    const dim = { w: 20, h: 20 };
    walker = new Walker(pos.x, pos.y, dim.w, dim.h);
}

function draw() {
    if (clear) {
        background(BG_COLOR);
    }
    walker.update();
    walker.draw();
}
