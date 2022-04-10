class Cell {
    current = false;
    visited = false;
    start = false;
    finished = false;
    ingress = false;
    egress = false;

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
        if (this.ingress) {
            color = props.cells.ingress;
        }
        if (this.egress) {
            color = props.cells.egress;
        }
        if (this.solution) {
            color = 'yellow';
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

    findStart = () => {
        return this.cells.filter((c) => c.ingress);
    };

    getAllNeighbours = (cell) => {
        const neighbours = [];
        const tc = this.getCell(cell.col, cell.row - 1);
        const rc = this.getCell(cell.col + 1, cell.row);
        const bc = this.getCell(cell.col, cell.row + 1);
        const lc = this.getCell(cell.col - 1, cell.row);
        if (tc) {
            neighbours.push(tc);
        }
        if (rc) {
            neighbours.push(rc);
        }
        if (bc) {
            neighbours.push(bc);
        }
        if (lc) {
            neighbours.push(lc);
        }
        return neighbours;
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

    move = (fromCell, toCell) => {
        fromCell.current = false;
        toCell.current = true;
        toCell.visited = true;
    };

    tunnel = (fromCell, toCell) => {
        this._removeWalls(fromCell, toCell);
        this.move(fromCell, toCell);
    };

    addBegin = () => {
        const begin = this.getCell(Math.floor(random(0, this.cols)), this.rows - 1);
        begin.walls[2] = false;
        begin.ingress = true;
        return begin;
    };

    addFinish = () => {
        const finish = this.getCell(Math.floor(random(0, this.cols)), 0);
        finish.walls[0] = false;
        finish.egress = true;
        return finish;
    };

    hasWall = (fromCell, toCell) => {
        const colDiff = fromCell.col - toCell.col;
        const rowDiff = fromCell.row - toCell.row;
        if (colDiff > 0) {
            // RIGHT
            return fromCell.walls[3] || toCell.walls[1];
        }
        if (colDiff < 0) {
            // LEFT
            return fromCell.walls[1] || toCell.walls[3];
        }
        if (rowDiff > 0) {
            // TOP
            return fromCell.walls[0] || toCell.walls[2];
        }
        if (rowDiff < 0) {
            // BOTTOM
            return fromCell.walls[2] || toCell.walls[0];
        }
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

    generateAll = () => {
        while (this.stack.length > 0) {
            this.generateNext();
        }
    };

    done = () => {
        return this.stack.length === 0;
    };
}

class RandomizedDFSSolver {
    constructor(grid) {
        // Create Solver
        // const maze = new Grid(grid.cols, grid.rows, grid.cellSize);
        // this.grid = maze;
        // this.begin = maze.addBegin();
        // this.finish = maze.addFinish();
        this.grid = grid;
        this.begin = this.grid.addBegin();
        this.finish = this.grid.addFinish();

        for (let j = 0; j < this.grid.cols; j++) {
            for (let i = 0; i < this.grid.rows; i++) {
                // this.cells.push(new Cell(i, j, cellSize));
                const cell = this.grid.getCell(i, j);
                cell.visited = false;
                this.finished = false;
            }
        }

        // Initialise
        this.stack = [];
        this.begin.start = true;
        this.begin.visited = true;
        this.stack.push(this.begin);
        this.solved = false;
    }

    solveNext = () => {
        if (this.stack.length > 0 && !this.solved) {
            const currentCell = this.stack.pop();

            const neighbours = this.grid.getAllNeighbours(currentCell);
            const reachable = neighbours.filter((toNeighbour) => {
                return !this.grid.hasWall(currentCell, toNeighbour);
            });
            const unvisited = reachable.filter((candidate) => {
                if (!candidate.visited) {
                    return candidate;
                }
            });
            // Could randomly select the next cell?
            const nextCell = unvisited[0];

            if (nextCell) {
                if (nextCell === this.finish) {
                    this.solved = true;
                    this.stack.push(currentCell);
                    this.stack.forEach((cell) => (cell.solution = true));
                    // console.log('Finished! Solved the maze');
                } else {
                    this.stack.push(currentCell);
                    this.grid.move(currentCell, nextCell);
                    this.stack.push(nextCell);
                }
            } else {
                // currentCell.current = false;
                // currentCell.finished = true;
            }
        }
    };

    solveAll = () => {};
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

let animate = false;

// let rows = 40;
// let cols = 40;
let rows = 10;
let cols = 10;
let cellSize = Math.floor(CANVAS_WIDTH / cols);

let generator;
let solver;
const props = {};

const createPalette = (hexCol) => {
    const r = parseInt(hexCol.slice(1, 3), 16);
    const g = parseInt(hexCol.slice(3, 5), 16);
    const b = parseInt(hexCol.slice(5), 16);
    const a = 1;
    props.cells = {
        unvisited: CANVAS_BACKGROUND,
        current: color('rgba(255, 0, 0, 0.75)'),
        start: color(`rgba(${r}, ${g}, ${b}, ${a})`),
        visited: color(`rgba(${r}, ${g}, ${b}, ${a - 0.4})`),
        finished: color(`rgba(${r}, ${g}, ${b}, ${a - 0.6})`),
        end: color(`rgba(${r}, ${g}, ${b}, ${a - 0.8})`),
        ingress: 'blue',
        egress: 'red',
    };
};

const clearMaze = () => {
    generator = new RandomizedDFSGenerator(cols, rows, cellSize);
};

const generateMaze = () => {
    generator = new RandomizedDFSGenerator(cols, rows, cellSize);
    if (!animate) {
        generator.generateAll();
    }
};

// TODO
// * Generation: static or animated. Done.
// * Render - Static / Animated toggle
// * Clear, New, Solve, Pause buttons.
// * RGB Pallette
// * Solvers

function setup() {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('sketch-container');

    // Maze grid size controller.
    const gridSizeSelect = document.getElementById('grid-size');
    gridSizeSelect.onchange = (e) => {
        const parts = e.target.value.split('x');
        cols = parts[0];
        rows = parts[1];
        cellSize = Math.floor(CANVAS_WIDTH / cols);
        generator = new RandomizedDFSGenerator(cols, rows, cellSize);
        solver = null;
    };

    // Maze colour controller.
    const mazeColorSelect = document.getElementById('maze-color');
    mazeColorSelect.onchange = (e) => {
        const newHexCol = e.target.value;
        createPalette(newHexCol);
    };
    createPalette(mazeColorSelect.value);

    // Maze generation animation controller.
    const animateCheckbox = document.getElementById('animate-maze-gen');
    animateCheckbox.onchange = (e) => {
        animate = e.target.checked;
    };

    // Maze generator button.
    const generateMazeBtn = document.getElementById('generate-maze-btn');
    generateMazeBtn.onclick = () => {
        generateMaze();
        solver = null;
    };

    // Maze Generator
    generator = new RandomizedDFSGenerator(cols, rows, cellSize);
    if (!animate) {
        generator.generateAll();
    }
}

function draw() {
    background(CANVAS_BACKGROUND);

    // Generate Maze
    //
    if (animate) {
        generator.generateNext();
    }
    generator.grid.draw();

    // Solve Maze
    //
    if (generator.done()) {
        if (!solver) {
            solver = new RandomizedDFSSolver(generator.grid);
        }
        if (animate) {
            solver.solveNext();
        }
    }
}
