// Canvas Configuration
//
const DEBUG = false;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const CANVAS_DEPTH = 400;
const CANVAS_BACKGROUND = 50;

/**
 * Define a simple 3D cube as an array of 8 3D coordinates using a RH coordinate system.
 *
 * The first 4 coordinates define the 'front face', starting at the 'top-left' and progressing in
 * a 'clockwise' fashion.
 *
 * The last 4 coordinates define the 'back face', starting at the 'top-left' and progressing in a
 * 'clockwise fashion.
 *
 * The render function uses a single perspective point (defined at the center of the screen), to
 * calculate the 'projected cube' coordinates. This based on the 'field of view' and 'z-coordinate'
 * of the cube vertices.
 */
class Cube {
    // Construct a cube around the specified 'position'.
    // The size of cube is specified by the 'dimension' (in pixels).
    constructor(pos, dim) {
        const hd = dim / 2;
        this.points = [
            // Front Face
            // Defined clockwise from 'top-left'.
            createVector(pos.x - hd, pos.y + hd, pos.z - hd),
            createVector(pos.x + hd, pos.y + hd, pos.z - hd),
            createVector(pos.x + hd, pos.y - hd, pos.z - hd),
            createVector(pos.x - hd, pos.y - hd, pos.z - hd),
            // Back Face
            // Defined clockwise from 'top-left'.
            createVector(pos.x - hd, pos.y + hd, pos.z + hd),
            createVector(pos.x + hd, pos.y + hd, pos.z + hd),
            createVector(pos.x + hd, pos.y - hd, pos.z + hd),
            createVector(pos.x - hd, pos.y - hd, pos.z + hd),
        ];
    }

    move = (v) => {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].add(v);
        }
    };

    render = () => {
        // Projection - Calculate the 'projected' set of cube vertices/
        //
        const projected = this._calculateProjection();

        // Render - Edges
        if (showEdges) {
            this._renderEdges(projected);
        }

        // Render - Faces
        if (showFaces) {
            this._renderFaces(projected);
        }

        // Render - Vertices
        if (showVertices) {
            this._renderVertices(projected);
        }

        // Render - Perspective
        if (showPerspective) {
            this._renderPerspective(projected);
        }
    };

    _calculateProjection = () => {
        // Calculate SPP scale distance.
        //
        const w = width; // Projection plane horizontal width. Canvas width.
        const d = (w / 2) * Math.tan((fov * (Math.PI / 180)) / 2); // e.g. {fov: 117, width: 400} => d ~ 300
        if (DEBUG) {
            console.log('perspective depth distance ratio - d : ', d);
        }

        // Calculate projection
        //
        const projected = [];
        for (let i = 0; i < this.points.length; i++) {
            const z = this.points[i].z / d;
            const v = createVector(this.points[i].x / z, this.points[i].y / z);
            if (DEBUG) {
                console.log(`Original  : {x: ${this.points[i].x}, y: ${this.points[i].y}, z: ${this.points[i].z}}`);
                console.log(`Projected : {x: ${v.x}, y: ${v.y}}`);
                console.log(`z Factor  : ${z}}`);
            }
            projected.push(v);
        }

        return projected;
    };

    // Draw the 12 edges of the projected cube.
    //
    // Front Face
    //
    // line(t[0].x, t[0].y, t[1].x, t[1].y);
    // line(t[1].x, t[1].y, t[2].x, t[2].y);
    // line(t[2].x, t[2].y, t[3].x, t[3].y);
    // line(t[3].x, t[3].y, t[0].x, t[0].y);
    //
    // Back Face
    //
    // line(t[4].x, t[4].y, t[5].x, t[5].y);
    // line(t[5].x, t[5].y, t[6].x, t[6].y);
    // line(t[6].x, t[6].y, t[7].x, t[7].y);
    // line(t[7].x, t[7].y, t[4].x, t[4].y);
    //
    // Joining Edges
    //
    // line(t[0].x, t[0].y, t[4].x, t[4].y);
    // line(t[1].x, t[1].y, t[5].x, t[5].y);
    // line(t[2].x, t[2].y, t[6].x, t[6].y);
    // line(t[3].x, t[3].y, t[7].x, t[7].y);
    //
    _renderEdges = (projected) => {
        const p = projected;
        for (let i = 0, j = 1; i < 4; i++, j++) {
            const v1 = i % 4;
            const v2 = j % 4;
            line(p[v1].x, p[v1].y, p[v2].x, p[v2].y); // FF
            line(p[v1 + 4].x, p[v1 + 4].y, p[v2 + 4].x, p[v2 + 4].y); // BF
            line(p[i].x, p[i].y, p[i + 4].x, p[i + 4].y); // JE
        }
    };

    // Render a cube with 6 coloured faces.
    //
    _renderFaces = (projected) => {
        const p = projected;
        // NB: I think there is a better way to calculate these!
        const front = [p[0], p[1], p[2], p[3]];
        const back = [p[4], p[5], p[6], p[7]];
        const top = [p[4], p[5], p[1], p[0]];
        const bottom = [p[6], p[7], p[3], p[2]];
        const left = [p[4], p[0], p[3], p[7]];
        const right = [p[1], p[5], p[6], p[2]];
        this._renderFace(front, 'green');
        this._renderFace(back, 'blue');
        this._renderFace(top, 'pink');
        this._renderFace(bottom, 'cyan');
        this._renderFace(left, 'red');
        this._renderFace(right, 'yellow');
    };

    // Render a cube face.
    //
    _renderFace = (face, color) => {
        const p = face;
        push();
        stroke(color);
        // Draw cross-diagonals
        line(p[0].x, p[0].y, p[2].x, p[2].y);
        line(p[1].x, p[1].y, p[3].x, p[3].y);
        // Draw sides
        for (let i = 0, j = 1; i < 4; i++, j++) {
            const v1 = i % 4;
            const v2 = j % 4;
            line(p[v1].x, p[v1].y, p[v2].x, p[v2].y);
        }
        pop();
    };

    // Draw the 8 points of the projected cube.
    //
    _renderVertices = (projected) => {
        const p = projected;
        for (let i = 0; i < p.length; i++) {
            // FrontFace vertices and BackFace vertices have different colours.
            const c = i < 4 ? vertexFFColor : vertexBFColor;
            fill(c);
            circle(p[i].x, p[i].y, vertexRadius);
        }
    };

    // Draw the perspective point and rails for the cube.
    //
    _renderPerspective = (points) => {
        push();
        // Perspective Point
        fill(sppColor);
        circle(spp.x, spp.y, vertexRadius);
        // Perspective Rails
        drawingContext.setLineDash([2, 4]);
        strokeWeight(1);
        stroke('white');
        points.forEach((p) => {
            line(p.x, p.y, spp.x, spp.y);
        });
        pop();
    };
}

// Perspective
//
let fov = 117; // Horizontal 'Field of View' in degrees.
let spp; // Single Point Perspective position
let sppColor = 'red';

// Cube
//
let cube; // The cube.
let cubeDim = 40; // Cube dimension
let vertexRadius = 5;
let vertexFFColor = 'green'; // Front-Face
let vertexBFColor = 'blue'; // Back-Face
let showEdges = true;
let showVertices = false;
let showFaces = false;
let showPerspective = false;
function keyTyped() {
    if (key === 'e') {
        showEdges = !showEdges;
    }
    if (key === 'v') {
        showVertices = !showVertices;
    }
    if (key === 'f') {
        showFaces = !showFaces;
    }
    if (key === 'p') {
        showPerspective = !showPerspective;
    }
    if (key === 'c') {
        cube = new Cube(createVector(0, 0, CANVAS_DEPTH / 2), cubeDim);
    }
    // Prevent any default behavior.
    return false;
}

// Cube Movement System
//
let handleInput = () => {
    const d = 5; // Movement speed (in canvas pixels)
    if (!keyIsDown(SHIFT) && keyIsDown(UP_ARROW)) {
        cube.move(createVector(0, d, 0));
    }
    if (!keyIsDown(SHIFT) && keyIsDown(DOWN_ARROW)) {
        cube.move(createVector(0, -d, 0));
    }
    if (keyIsDown(LEFT_ARROW)) {
        cube.move(createVector(-d, 0, 0));
    }
    if (keyIsDown(RIGHT_ARROW)) {
        cube.move(createVector(d, 0, 0));
    }
    if (keyIsDown(SHIFT) && keyIsDown(UP_ARROW)) {
        cube.move(createVector(0, 0, d));
    }
    if (keyIsDown(SHIFT) && keyIsDown(DOWN_ARROW)) {
        cube.move(createVector(0, 0, -d));
    }
};

// Legend
//
var displayLegend = false;
let toggleLegend = () => {
    let title = document.getElementById('sketch-legend-btn');
    let table = document.getElementById('sketch-legend-table');
    displayLegend = !displayLegend;
    if (displayLegend) {
        title.style.display = 'none';
        table.style.display = 'block';
    } else {
        title.style.display = 'block';
        table.style.display = 'none';
    }
};

function setup() {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('sketch-container');

    spp = createVector(0, 0);
    cube = new Cube(createVector(0, 0, CANVAS_DEPTH / 2), cubeDim);
}

function draw() {
    background(CANVAS_BACKGROUND);

    // Move origin to center and invert the y-axis.
    translate(width / 2, height / 2);
    scale(1, -1);

    handleInput();

    cube.render();
}
