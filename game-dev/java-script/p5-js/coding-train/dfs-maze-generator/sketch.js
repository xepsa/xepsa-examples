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
        //
        let color = this.visited ? VisitedCellColor : NotVisitedCellColor;
        if (this.finished) {
            color = FinishedCellColor;
        }
        if (this.isDeadEnd()) {
            color = DeadEndCellColor;
        }
        if (this.current) {
            color = CurrentCellColor;
        }
        if (this.start) {
            color = StartCellColor;
        }
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
        return this.countUnvisitedNeighbour() > 0;
    };

    getRandomUnvisitedNeighbour = (cell) => {
        let selected;
        let unvisited = grid.getAllUnvisitedNeighbours(cell);
        if (unvisited.length > 0) {
            selected = unvisited[Math.floor(random(0, unvisited.length))];
        }
        return selected;
    };

    tunnel = (fromCell, toCell) => {
        this.removeWalls(fromCell, toCell);
        this.move(fromCell, toCell);
    };

    removeWalls = (fromCell, toCell) => {
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

    move = (fromCell, toCell) => {
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

let grid;
let rows = 40;
let cols = 40;
let cellSize = Math.floor(CANVAS_WIDTH / cols);

const stack = [];

let CurrentCellColor;
let StartCellColor;
let VisitedCellColor;
let NotVisitedCellColor = CANVAS_BACKGROUND;
let FinishedCellColor;
let DeadEndCellColor;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    CurrentCellColor = color('rgba(255, 0, 0, 0.75)');

    StartCellColor = color('rgba(0, 255, 0, 1)');
    VisitedCellColor = color('rgba(0, 255, 0, 0.6)');
    FinishedCellColor = color('rgba(0, 255, 0, 0.4)');
    DeadEndCellColor = color('rgba(0, 255, 0, 0.2)');

    grid = new Grid(cols, rows, cellSize);

    const currentCell = grid.getCell(20, 20);
    currentCell.start = true;
    currentCell.visited = true;
    stack.push(currentCell);
}

function draw() {
    background(CANVAS_BACKGROUND);

    if (stack.length > 0) {
        const currentCell = stack.pop();
        const nextCell = grid.getRandomUnvisitedNeighbour(currentCell);
        if (nextCell) {
            stack.push(currentCell);
            grid.tunnel(currentCell, nextCell);
            stack.push(nextCell);
        } else {
            currentCell.current = false;
            currentCell.finished = true;
        }
    }

    grid.draw();
}
