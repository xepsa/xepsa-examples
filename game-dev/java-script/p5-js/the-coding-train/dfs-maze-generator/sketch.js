class Cell {
    current = false;
    visited = false;
    start = false;
    finished = false;

    // TRBL - [Top, Right, Bottom, Left]
    walls = [true, true, true, true];

    constructor(col, row, size) {
        this.col = col;
        this.row = row;
        this.size = size;
    }

    isDeadEnd = () => {
        const closed = this.walls.filter((wall) => wall);
        return closed.length === 3;
    };

    draw = () => {
        const cs = this.size;
        const px = this.col * cs;
        const py = this.row * cs;

        // Draw Cell
        const color = this._getCellColor();
        fill(color);
        noStroke();
        square(px, py, cs);

        // Draw Cell Walls
        //
        stroke(CANVAS_PRIMARY);
        // Top
        if (this.walls[0]) {
            line(px, py, px + cs, py);
        }
        // Right
        if (this.walls[1]) {
            line(px + cs, py, px + cs, py + cs);
        }
        // Bottom
        if (this.walls[2]) {
            line(px + cs, py + cs, px, py + cs);
        }
        // Left
        if (this.walls[3]) {
            line(px, py + cs, px, py);
        }
    };

    _getCellColor = () => {
        let color = this.visited ? props.cells.visited : props.cells.unvisited;
        if (this.finished) {
            color = props.cells.finished;
        }
        if (this.isDeadEnd()) {
            color = props.cells.end;
        }
        if (this.current) {
            color = props.cells.current;
        }
        if (this.start) {
            color = props.cells.start;
        }
        return color;
    };
}

class Grid {
    constructor(cols, rows, cellSize) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.cells = [];
        for (let j = 0; j < cols; j++) {
            for (let i = 0; i < rows; i++) {
                this.cells.push(new Cell(i, j, cellSize));
            }
        }
    }

    getCellIndex = (x, y) => {
        return y * this.rows + x;
    };

    getCell = (x, y) => {
        let cell;
        // Edges - Do not wrap. Return undefined.
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            const idx = this.getCellIndex(x, y);
            cell = this.cells[idx];
        }
        return cell;
    };

    getAllUnvisitedNeighbours = (cell) => {
        const unvisited = [];
        const tc = this.getCell(cell.col, cell.row - 1);
        const rc = this.getCell(cell.col + 1, cell.row);
        const bc = this.getCell(cell.col, cell.row + 1);
        const lc = this.getCell(cell.col - 1, cell.row);
        if (tc && !tc.visited) {
            unvisited.push(tc);
        }
        if (rc && !rc.visited) {
            unvisited.push(rc);
        }
        if (bc && !bc.visited) {
            unvisited.push(bc);
        }
        if (lc && !lc.visited) {
            unvisited.push(lc);
        }
        return unvisited;
    };

    countUnvisitedNeighbours = (cell) => {
        return this.getAllUnvisitedNeighbours(cell).length;
    };

    hasUnvisitedNeighbours = (cell) => {
        return this.countUnvisitedNeighbour(cell) > 0;
    };

    getRandomUnvisitedNeighbour = (cell) => {
        let selected;
        let unvisited = this.getAllUnvisitedNeighbours(cell);
        if (unvisited.length > 0) {
            selected = unvisited[Math.floor(random(0, unvisited.length))];
        }
        return selected;
    };

    tunnel = (fromCell, toCell) => {
        this._removeWalls(fromCell, toCell);
        this._move(fromCell, toCell);
    };

    _removeWalls = (fromCell, toCell) => {
        const colDiff = fromCell.col - toCell.col;
        const rowDiff = fromCell.row - toCell.row;
        if (colDiff > 0) {
            // RIGHT
            fromCell.walls[3] = false;
            toCell.walls[1] = false;
        }
        if (colDiff < 0) {
            // LEFT
            fromCell.walls[1] = false;
            toCell.walls[3] = false;
        }
        if (rowDiff > 0) {
            // TOP
            fromCell.walls[0] = false;
            toCell.walls[2] = false;
        }
        if (rowDiff < 0) {
            // BOTTOM.
            fromCell.walls[2] = false;
            toCell.walls[0] = false;
        }
    };

    _move = (fromCell, toCell) => {
        fromCell.current = false;
        toCell.current = true;
        toCell.visited = true;
    };

    draw = () => {
        this.cells.forEach((cell) => {
            cell.draw();
        });
    };
}

class RandomizedDFSGenerator {
    constructor(cols, rows, cellSize) {
        // Create Grid
        this.grid = new Grid(cols, rows, cellSize);
        this.stack = [];
        // Initialise
        const currentCell = this.grid.getCell(Math.floor(cols / 2), Math.floor(rows / 2));
        currentCell.start = true;
        currentCell.visited = true;
        this.stack.push(currentCell);
    }

    generateNext = () => {
        if (this.stack.length > 0) {
            const currentCell = this.stack.pop();
            const nextCell = this.grid.getRandomUnvisitedNeighbour(currentCell);
            if (nextCell) {
                this.stack.push(currentCell);
                this.grid.tunnel(currentCell, nextCell);
                this.stack.push(nextCell);
            } else {
                currentCell.current = false;
                currentCell.finished = true;
            }
        }
    };

    generateMaze = () => {
        while (this.stack.length > 0) {
            this.generateNext();
        }
    };
}

// Canvas Configuration ---------------------------------------------------------------------------
//
const DEBUG = false;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const CANVAS_DEPTH = 400;
const CANVAS_BACKGROUND = 50;
const CANVAS_PRIMARY = 0;

// p5 Instance ------------------------------------------------------------------------------------
//

function preload() {}

// Clear Button.
let clearButton;
function clearMaze() {
    generator = new RandomizedDFSGenerator(cols, rows, cellSize);
}
// Generate Button.
let generateButton;
function genMaze() {
    generator = new RandomizedDFSGenerator(cols, rows, cellSize);
    if (!animate) {
        generator.generateMaze();
    }
}
// Animate Toggle.
let animateToggle;
let animate = false;
function updateAnimate() {
    animate = animateToggle.checked();
}

// let rows = 40;
// let cols = 40;
// let rows = 80;
// let cols = 80;
let rows = 100;
let cols = 100;
let cellSize = Math.floor(CANVAS_WIDTH / cols);

const props = {};
let generator;

// TODO
// * Generation: static or animated. Done.
// * Render - Static / Animated toggle
// * Clear, New, Solve, Pause buttons.
// * RGB Pallette
// * Solvers

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    // Clear Button.
    clearButton = createButton('Clear');
    clearButton.mousePressed(clearMaze);
    // Generate Button.
    generateButton = createButton('Generate');
    generateButton.mousePressed(genMaze);
    // Animate Toggle.
    animateToggle = createCheckbox('animate', false);
    animateToggle.changed(updateAnimate);

    // Pink Pallette
    // const r = 255;
    // const g = 128;
    // const b = 255;
    const r = 0;
    const g = 256;
    const b = 0;
    const a = 1;
    props.cells = {
        unvisited: CANVAS_BACKGROUND,
        current: color('rgba(255, 0, 0, 0.75)'),
        start: color(`rgba(${r}, ${g}, ${b}, ${a})`),
        visited: color(`rgba(${r}, ${g}, ${b}, ${a - 0.4})`),
        finished: color(`rgba(${r}, ${g}, ${b}, ${a - 0.6})`),
        end: color(`rgba(${r}, ${g}, ${b}, ${a - 0.8})`),
    };

    generator = new RandomizedDFSGenerator(cols, rows, cellSize);
    if (!animate) {
        generator.generateMaze();
    }
}

function draw() {
    background(CANVAS_BACKGROUND);
    if (animate) {
        generator.generateNext();
    }
    generator.grid.draw();
}
