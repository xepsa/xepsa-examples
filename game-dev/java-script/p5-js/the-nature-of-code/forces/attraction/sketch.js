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
        force.copy().div(this.mass);
        this.acc.add(force);
    }

    applyConstraints() {
        if (this.vel.y > 20) {
            this.vel.y = 20;
        }
    }

    update() {
        this.vel = this.vel.add(this.acc);
        // this.applyConstraints();
        this.pos = this.pos.add(this.vel);
        this.acc = this.acc.mult(0);
    }

    render() {
        stroke(0);
        fill(255);
        circle(this.pos.x, this.pos.y, this.radius);
    }
}

class Attractor {
    constructor(attractor, entity) {
        this.attractor = attractor;
        this.entity = entity;
    }

    createForce = () => {
        let force = this.entity.copy().sub(this.attractor);
        force.normalize();
        return force;
    };

    render() {
        push();
        line(this.entity.x, this.entity.y, this.attractor.x, this.attractor.y);
        fill(255, 0, 0);
        circle(this.entity.x, this.entity.y, 5);
        fill(0, 255, 0);
        circle(this.attractor.x, this.attractor.y, 5);
        pop();
    }
}

class Repeller {
    constructor(repeller, entity) {
        this.repeller = repeller;
        this.entity = entity;
    }

    createForce = () => {
        let force = this.entity.copy().sub(this.repeller).mult(-1);
        force.normalize();
        return force;
    };

    render() {
        push();
        line(this.entity.x, this.entity.y, this.repeller.x, this.repeller.y);
        fill(0, 255, 0);
        circle(this.entity.x, this.entity.y, 5);
        fill(255, 0, 0);
        circle(this.repeller.x, this.repeller.y, 5);
        pop();
    }
}

class Fluid {
    constructor() {}
}

//-----------------------------------------------------------------------------

// Gravity
//
const calculateGravity = (entity) => {
    let gravity = createVector(0, GRAVITY);
    gravity = gravity.mult(entity.mass);
    return gravity;
};

// Friction
//
// https://en.wikipedia.org/wiki/Friction
// https://simple.wikipedia.org/wiki/Coefficient_of_friction
const calculateFriction = (entity) => {
    // friction = -(vel * normal * coefficient of friction)
    const coefficientOfFriction = 0.05; // Mu [0..1]
    const frictionNormal = 1; // TODO: calculate w.r.t to angle of collision.
    const frictionFactor = coefficientOfFriction * frictionNormal;
    let friction = entity.vel.copy();
    friction.normalize();
    friction.mult(-1);
    friction.mult(frictionFactor);
    return friction;
};

// Drag
//
// https://en.wikipedia.org/wiki/Drag_(physics)
const calculateDrag = (entity) => {
    // drag = -(||vel| ^ 2 * coefficient of drag)
    const coefficientOfDrag = 0.001;
    const speed = entity.vel.mag();
    const dragFactor = speed * speed * coefficientOfDrag;
    let drag = entity.vel.copy();
    drag.normalize();
    drag.mult(-1);
    drag.mult(dragFactor);
    return drag;
};

//-----------------------------------------------------------------------------

const BG_COLOR = 50;
const CANVAS_W = 1000;
const CANVAS_H = 500;

const GRAVITY = 0.01;
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

        // // Friction - NB: This add universal friction to an entity.
        let friction = calculateFriction(entities[i]);
        entities[i].applyForce(friction);

        // Drag
        // let drag = calculateDrag(entities[i]);
        // entities[i].applyForce(drag);

        // Wind
        if (mouseIsPressed) {
            let entity = entities[i].pos.copy();
            let mouse = createVector(mouseX, mouseY);
            if (mouseButton === LEFT) {
                let mouseAttractor = new Attractor(entity, mouse);
                entities[i].applyForce(mouseAttractor.createForce());
                // mouseAttractor.render();
                forces.push(mouseAttractor);
            }
            if (mouseButton === RIGHT) {
                let mouseRepeller = new Repeller(entity, mouse);
                entities[i].applyForce(mouseRepeller.createForce());
                // mouseRepeller.render();
                forces.push(mouseRepeller);
            }
        }

        applyUniversalConstraints(entities[i]);

        entities[i].applyConstraints();

        entities[i].update();
        entities[i].render();
    }

    for (let i = 0; i < forces.length; i++) {
        forces[i].render();
    }
    forces = [];
}
x;
