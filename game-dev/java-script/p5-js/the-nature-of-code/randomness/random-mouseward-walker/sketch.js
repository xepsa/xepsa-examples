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
        if (isMousePressed && random(0, 1) > 0.75) {
            if (mouseX > this.x) {
                this.x += this.w / 4;
            } else {
                this.x -= this.w / 4;
            }
            if (mouseY > this.y) {
                this.y += this.h / 4;
            } else {
                this.y -= this.h / 4;
            }
        } else {
            this.x += random(-this.w / 4, this.w / 4);
            this.y += random(-this.h / 4, this.h / 4);
        }
    };
}

let isMousePressed = false;
function mousePressed() {
    isMousePressed = true;
}

function mouseReleased() {
    isMousePressed = false;
}

const BG_COLOR = 50;
const CANVAS_W = 1000;
const CANVAS_H = 500;

let walker;
const clear = false;

function preload() {}

let canvas;
function setup() {
    createCanvas(CANVAS_W, CANVAS_H);
    background(BG_COLOR);
    const pos = { x: width / 2, y: height / 2 };
    const dim = { h: 20, w: 20 };
    walker = new Walker(pos.x, pos.y, dim.w, dim.h);
}

function draw() {
    if (clear) {
        background(BG_COLOR);
    }
    walker.update();
    walker.draw();
}
