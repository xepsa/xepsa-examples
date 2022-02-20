class Splat {
    constructor(x, y, w, h, palette) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.splots = [];
        for (let i = 0; i < 360; i++) {
            let theta = (i * Math.PI) / 180;
            let mag = floor(randomGaussian(0, 20));
            this.splots.push({ x: this.x + Math.sin(theta) * mag, y: this.y + Math.cos(theta) * mag });
        }

        let mag = floor(randomGaussian(0, 20));

        let r, g, b;
        if (palette) {
            // Gaussian color palette, assume one of RGB is not fixed.
            r = palette?.r ? palette.r : Math.round(randomGaussian(0, 255));
            g = palette?.g ? palette.g : Math.round(randomGaussian(0, 255));
            b = palette?.b ? palette.b : Math.round(randomGaussian(0, 255));
        } else {
            r = Math.round(random(0, 255));
            g = Math.round(random(0, 255));
            b = Math.round(random(0, 255));
        }
        this.color = color(r, g, b);
    }

    // Interface

    update = () => {};

    draw = () => {
        ellipse(this.x, this.y, this.w, this.h);
        for (let i = 0; i < this.splots.length; i++) {
            stroke(this.color);
            line(this.x, this.y, this.splots[i].x, this.splots[i].y);
        }
    };
}

const splats = [];
const gaussianPalette = false;
const palette = gaussianPalette ? { r: 128, g: 128 } : undefined;

function mousePressed() {
    const x = mouseX;
    const y = mouseY;
    const r = 5;
    splats.push(new Splat(x, y, r, r, palette));
}

const BG_COLOR = 50;
const CANVAS_W = 1000;
const CANVAS_H = 500;

function preload() {}

function setup() {
    createCanvas(CANVAS_W, CANVAS_H);
    background(BG_COLOR);
}

function draw() {
    if (clear) {
        background(BG_COLOR);
    }

    for (let i = 0; i < splats.length; i++) {
        splats[i].update();
        splats[i].draw();
    }
}
