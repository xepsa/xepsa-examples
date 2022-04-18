function preload() {}

class Mover {
    constructor(pos, vel, acc, radius, mass) {
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;

        this.radius = radius;
        this.mass = mass;
    }

    applyForce(force) {
        let f = force.copy().div(this.mass);
        this.acc.add(f);
    }

    update() {
        this.vel = this.vel.add(this.acc);
        this.pos = this.pos.add(this.vel);
        this.acc = this.acc.mult(0);
    }

    render() {
        stroke(0);
        fill(255);
        circle(this.pos.x, this.pos.y, this.radius);
    }
}

//-----------------------------------------------------------------------------

// Gravity
//
const calculateGravity = (entity) => {
    let gravity = createVector(0, GRAVITY);
    gravity = gravity.mult(entity.mass);
    return gravity;
};

const applyEnergyLoss = (entity) => {
    let loss = createVector(1, 0.6);
    entity.vel.mult(loss);
};

//-----------------------------------------------------------------------------

const BG_COLOR = 50;
const CANVAS_W = 1000;
const CANVAS_H = 500;

const GRAVITY = 0.02;
const RADIUS_01 = 20;
const MASS_01 = RADIUS_01;
const RADIUS_02 = 10;
const MASS_02 = RADIUS_02;

let entities = [];
let forces = [];

function setup() {
    createCanvas(CANVAS_W, CANVAS_H);

    for (let element of document.getElementsByClassName('p5Canvas')) {
        element.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    const e1 = new Mover(
        createVector(width * 0.25, -RADIUS),
        createVector(0, 0),
        createVector(0, 0),
        RADIUS_02,
        MASS_02
    );
    entities.push(e1);

    const e2 = new Mover(createVector(width / 2, -RADIUS), createVector(0, 0), createVector(0, 0), RADIUS_01, MASS_01);
    entities.push(e2);

    const e3 = new Mover(
        createVector(width * 0.75, -RADIUS),
        createVector(0, 0),
        createVector(0, 0),
        RADIUS_02,
        MASS_02
    );
    entities.push(e3);
}

function applyUniversalConstraints(entity) {
    // Top - Open
    // Right - Wall
    if (entity.pos.x + entity.radius / 2 > width) {
        entity.pos.x = width - entity.radius / 2;
        entity.vel.x = -entity.vel.x;
    }
    // Bottom - Ground
    if (entity.pos.y + entity.radius / 2 > height) {
        entity.pos.y = height - entity.radius / 2;
        entity.vel.y = -entity.vel.y;
        applyEnergyLoss(entity);
    }
    // Left - Wall
    if (entity.pos.x - entity.radius / 2 < 0) {
        entity.pos.x = 0 + entity.radius / 2;
        entity.vel.x = -entity.vel.x;
    }
}

function draw() {
    background(BG_COLOR);

    for (let i = 0; i < entities.length; i++) {
        // Gravity
        let gravity = calculateGravity(entities[i]);
        entities[i].applyForce(gravity);

        // // Friction - NB: This add universal friction to an entity. Even when not touching.
        // let friction = calculateFriction(entities[i]);
        // entities[i].applyForce(friction);

        applyUniversalConstraints(entities[i]);

        // entities[i].applyConstraints();
        entities[i].update();
        entities[i].render();
    }

    for (let i = 0; i < forces.length; i++) {
        forces[i].render();
    }
    forces = [];
}
