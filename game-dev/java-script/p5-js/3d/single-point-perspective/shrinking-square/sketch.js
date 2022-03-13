// Canvas Configuration
//
const DEBUG = false;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const CANVAS_DEPTH = 400;
const CANVAS_BACKGROUND = 50;

function preload() {}

var r = 5; // Point radius
var cd = 40; // Cube dimension
var pd = 1; // Perspective Divisor

var spp; // Single Point Perspective position
var p1, p2, p3, p4;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    spp = createVector(0, 0);

    const w = width / 2;
    const h = height / 2;

    p1 = createVector(w - cd, h);
    p2 = createVector(w, h);
    p3 = createVector(w, h - cd);
    p4 = createVector(w - cd, h - cd);
}

function draw() {
    background(CANVAS_BACKGROUND);

    translate(width / 2, height / 2);
    scale(1, -1);

    fill('red');
    circle(spp.x, spp.y, r);

    fill('white');
    circle(p1.x / pd, p1.y / pd, r);
    circle(p2.x / pd, p2.y / pd, r);
    circle(p3.x / pd, p3.y / pd, r);
    circle(p4.x / pd, p4.y / pd, r);

    pd = pd + 0.01;
}
