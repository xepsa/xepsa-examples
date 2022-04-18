class SquareTile {
    initial = false;
    current = false;
    visited = false;
    finished = false;

    // TRBL - [Top, Right, Bottom, Left]
    walls = [true, true, true, true];

    constructor(col, row, size) {
        this.col = col;
        this.row = row;
        this.size = size;
    }

    resetSearchState = () => {
        this.initial = false;
        this.current = false;
        this.visited = false;
    };

    isDeadEnd = () => {
        const closed = this.walls.filter((wall) => wall);
        return closed.length === 3;
    };

    centroid = () => {
        const cs = this.size;
        const hcs = Math.floor(cs / 2);
        const x = this.col * cs + hcs;
        const y = this.row * cs + hcs;
        return { x, y };
    };

    draw = () => {
        const cs = this.size;
        const px = this.col * cs;
        const py = this.row * cs;

        // Draw SquareTile
        const color = this._getTileColor();
        fill(color);
        noStroke();
        square(px, py, cs);

        // Draw SquareTile Walls
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

    _getTileColor = () => {
        let color = this.visited ? props.maze.colors.visited : props.maze.colors.unvisited;
        if (this.initial) {
            color = props.maze.colors.initial;
        } else if (this.current) {
            color = props.maze.colors.current;
        } else if (this.finished) {
            color = props.maze.colors.finished;
        } else if (this.isDeadEnd()) {
            color = props.maze.colors.deadend;
        }
        return color;
    };
}

class SquareTileMaze {
    constructor(cols, rows, tileSize) {
        this.cols = cols;
        this.rows = rows;
        this.tileSize = tileSize;
        this.tiles = [];
        for (let j = 0; j < cols; j++) {
            for (let i = 0; i < rows; i++) {
                this.tiles.push(new SquareTile(i, j, tileSize));
            }
        }
    }

    getTileIndex = (x, y) => {
        return y * this.rows + x;
    };

    getTile = (x, y) => {
        let tile;
        // Edges - Do not wrap. Return undefined.
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            const idx = this.getTileIndex(x, y);
            tile = this.tiles[idx];
        }
        return tile;
    };

    findStart = () => {
        return this.tiles.filter((c) => c.start);
    };

    getAllNeighbours = (tile) => {
        const neighbours = [];
        const tc = this.getTile(tile.col, tile.row - 1);
        const rc = this.getTile(tile.col + 1, tile.row);
        const bc = this.getTile(tile.col, tile.row + 1);
        const lc = this.getTile(tile.col - 1, tile.row);
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

    getAllUnvisitedNeighbours = (tile) => {
        const unvisited = [];
        const tc = this.getTile(tile.col, tile.row - 1);
        const rc = this.getTile(tile.col + 1, tile.row);
        const bc = this.getTile(tile.col, tile.row + 1);
        const lc = this.getTile(tile.col - 1, tile.row);
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

    countUnvisitedNeighbours = (tile) => {
        return this.getAllUnvisitedNeighbours(tile).length;
    };

    hasUnvisitedNeighbours = (tile) => {
        return this.countUnvisitedNeighbour(tile) > 0;
    };

    getRandomUnvisitedNeighbour = (tile) => {
        let selected;
        let unvisited = this.getAllUnvisitedNeighbours(tile);
        if (unvisited.length > 0) {
            selected = unvisited[Math.floor(random(0, unvisited.length))];
        }
        return selected;
    };

    move = (fromTile, toTile) => {
        fromTile.current = false;
        toTile.current = true;
        toTile.visited = true;
    };

    tunnel = (fromTile, toTile) => {
        this._removeWalls(fromTile, toTile);
        this.move(fromTile, toTile);
    };

    resetSearchState = () => {
        this.tiles.forEach((tile) => tile.resetSearchState());
    };

    hasWall = (fromTile, toTile) => {
        const colDiff = fromTile.col - toTile.col;
        const rowDiff = fromTile.row - toTile.row;
        if (colDiff > 0) {
            // RIGHT
            return fromTile.walls[3] || toTile.walls[1];
        }
        if (colDiff < 0) {
            // LEFT
            return fromTile.walls[1] || toTile.walls[3];
        }
        if (rowDiff > 0) {
            // TOP
            return fromTile.walls[0] || toTile.walls[2];
        }
        if (rowDiff < 0) {
            // BOTTOM
            return fromTile.walls[2] || toTile.walls[0];
        }
    };

    createChallenge = (challengeType) => {
        const origin = this.createChallengePoint(challengeType);
        let goal = origin;
        while (goal === origin) {
            goal = this.createChallengePoint(challengeType);
        }
        return { origin, goal };
    };

    createChallengePoint = (challengeType = 'edge') => {
        let point;
        if (challengeType === 'random') {
            point = this.tiles[Math.floor(random(0, this.tiles.length - 1))];
        } else {
            const edge = Math.floor(random(0, 3));
            switch (edge) {
                case 0:
                    point = this.getTile(Math.floor(random(0, this.cols)), 0);
                    break;
                case 1:
                    point = this.getTile(this.cols - 1, Math.floor(random(0, this.rows)));
                    break;
                case 2:
                    point = this.getTile(Math.floor(random(0, this.cols)), this.rows - 1);
                    break;
                case 3:
                    point = this.getTile(0, Math.floor(random(0, this.rows)));
                    break;
            }
        }
        return point;
    };

    _removeWalls = (fromTile, toTile) => {
        const colDiff = fromTile.col - toTile.col;
        const rowDiff = fromTile.row - toTile.row;
        if (colDiff > 0) {
            // RIGHT
            fromTile.walls[3] = false;
            toTile.walls[1] = false;
        }
        if (colDiff < 0) {
            // LEFT
            fromTile.walls[1] = false;
            toTile.walls[3] = false;
        }
        if (rowDiff > 0) {
            // TOP
            fromTile.walls[0] = false;
            toTile.walls[2] = false;
        }
        if (rowDiff < 0) {
            // BOTTOM.
            fromTile.walls[2] = false;
            toTile.walls[0] = false;
        }
    };

    draw = () => {
        this.tiles.forEach((tile) => {
            tile.draw();
        });
    };
}

// Randomized depth first Search based 'SquareTileMaze' generator.
class SquareTileMazeGenerator {
    constructor(cols, rows, tileSize) {
        // Create SquareTileMaze
        this.maze = new SquareTileMaze(cols, rows, tileSize);
        this.stack = [];
        // Initialise
        const currentTile = this.maze.getTile(Math.floor(cols / 2), Math.floor(rows / 2));
        currentTile.initial = true;
        currentTile.visited = true;
        this.stack.push(currentTile);
    }

    clone = () => {
        // Create a new fresh SquareTileMaze containing only the walls of a generated maze
        // without any of the search state required to generate it.
        this.generateAll();
        const maze = new SquareTileMaze(cols, rows, tileSize);
        for (let j = 0; j < this.maze.cols; j++) {
            for (let i = 0; i < this.maze.rows; i++) {
                const tile = this.maze.getTile(i, j);
                maze.maze.getTile(i, j).walls = tile.walls;
            }
        }
        return maze;
    };

    generateNext = () => {
        if (this.stack.length > 0) {
            const currentTile = this.stack.pop();
            const nextTile = this.maze.getRandomUnvisitedNeighbour(currentTile);
            if (nextTile) {
                this.stack.push(currentTile);
                this.maze.tunnel(currentTile, nextTile);
                this.stack.push(nextTile);
            } else {
                currentTile.current = false;
                currentTile.finished = true;
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

class SquareTileMazeChallenge {
    constructor(origin, goal, solution) {
        this.origin = origin;
        this.goal = goal;
        this.solution = solution;
    }

    draw = () => {
        // Draw Challenge.
        if (this.origin) {
            const { x, y } = this.origin.centroid();
            fill(props.maze.colors.start);
            circle(x, y, this.origin.size / 2);
        }
        if (this.goal) {
            const { x, y } = this.goal.centroid();
            fill(props.maze.colors.end);
            circle(x, y, this.goal.size / 2);
        }

        // Draw Solution
        if (this.solution) {
            let previous;
            this.solution.forEach((tile) => {
                const { x: cx, y: cy } = tile.centroid();
                if (previous) {
                    const { x: px, y: py } = previous.centroid();
                    stroke(props.solution.colors.path);
                    line(cx, cy, px, py);
                }
                previous = tile;
            });
            const origin = this.solution[0];
            if (origin) {
                const { x, y } = origin.centroid();
                fill(props.maze.colors.start);
                circle(x, y, origin.size / 2);
            }
            const goal = this.solution[this.solution.length - 1];
            if (goal) {
                const { x, y } = goal.centroid();
                fill(props.maze.colors.end);
                circle(x, y, goal.size / 2);
            }
        }
    };
}
class RandomizedDFSSolver {
    constructor(maze) {
        // Create Solver
        this.maze = maze;
        this.maze.resetSearchState();

        // Create Challenge
        const { origin, goal } = this.maze.createChallenge(challengeType);
        this.challenge = new SquareTileMazeChallenge(origin, goal, this.stack);

        // Initialise
        this.stack = [];
        origin.initial = true;
        origin.visited = true;
        this.stack.push(origin);
        this.solved = false;
    }

    solveNext = () => {
        if (this.stack.length > 0 && !this.solved) {
            const currentTile = this.stack.pop();

            const neighbours = this.maze.getAllNeighbours(currentTile);
            const reachable = neighbours.filter((toNeighbour) => {
                return !this.maze.hasWall(currentTile, toNeighbour);
            });
            const unvisited = reachable.filter((candidate) => {
                if (!candidate.visited) {
                    return candidate;
                }
            });

            // Could randomly select the next tile?
            const nextTile = unvisited[0];

            if (nextTile) {
                if (nextTile === this.challenge.goal) {
                    // Complete solution.
                    this.solved = true;
                    this.stack.push(currentTile);
                    this.stack.push(this.challenge.goal);
                    // Store solution.
                    this.challenge.solution = this.stack;
                    // Finalise search state.
                    currentTile.current = false;
                    currentTile.finished = true;
                } else {
                    this.stack.push(currentTile);
                    this.maze.move(currentTile, nextTile);
                    this.stack.push(nextTile);
                }
            } else {
                currentTile.current = false;
                currentTile.finished = true;
            }
        }
    };

    solveAll = () => {
        while (!this.done()) {
            this.solveNext();
        }
    };

    done = () => {
        return this.solved;
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

let rows = 10;
let cols = 10;
let tileSize = Math.floor(CANVAS_WIDTH / cols);
let animateGenerator = false;
let generator;

let challengeType;
let animateSolver = false;
let solver;

const props = {};

function setup() {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('sketch-container');

    generatorUI();
    solverUI();

    // Maze Generator
    generator = new SquareTileMazeGenerator(cols, rows, tileSize);
    if (!animateGenerator) {
        generator.generateAll();
    }
}

function draw() {
    background(CANVAS_BACKGROUND);

    // Generate Maze
    //
    if (animateGenerator) {
        generator.generateNext();
    }
    generator.maze.draw();

    // Solve Maze
    //
    if (generator.done()) {
        if (!solver) {
            solver = new RandomizedDFSSolver(generator.maze);
        }
        if (animateSolver) {
            solver.solveNext();
        }
        if (solver.challenge) {
            solver.challenge.draw();
        }
    }
}

//-------------------------------------------------------------------------------------------------
// UI Components

const createMazePalette = (hexCol) => {
    const r = parseInt(hexCol.slice(1, 3), 16);
    const g = parseInt(hexCol.slice(3, 5), 16);
    const b = parseInt(hexCol.slice(5), 16);
    const a = 1;

    props.maze = {
        colors: {
            unvisited: CANVAS_BACKGROUND,
            initial: color(`rgba(${r}, ${g}, ${b}, ${a - 0.6})`),
            current: color('rgba(255, 0, 0, 0.75)'),
            visited: color(`rgba(${r}, ${g}, ${b}, ${a - 0.4})`),
            finished: color(`rgba(${r}, ${g}, ${b}, ${a - 0.6})`),
            deadend: color(`rgba(${r}, ${g}, ${b}, ${a - 0.8})`),
            start: color(`rgba(0, 0, 255, ${a})`),
            end: color(`rgba(255, 0, 20, ${a})`),
        },
    };
};

const clearMaze = () => {
    generator = new SquareTileMazeGenerator(cols, rows, tileSize);
};

const generateMaze = () => {
    generator = new SquareTileMazeGenerator(cols, rows, tileSize);
    if (!animateGenerator) {
        generator.generateAll();
    }
};

const generatorUI = () => {
    // Maze maze size controller.
    document.getElementById('maze-size').addEventListener('change', (e) => {
        const parts = e.target.value.split('x');
        cols = parts[0];
        rows = parts[1];
        tileSize = Math.floor(CANVAS_WIDTH / cols);
        generator = new SquareTileMazeGenerator(cols, rows, tileSize);
        solver = null;
    });

    // Maze colour controller.
    const mazeColorSelect = document.getElementById('maze-color');
    mazeColorSelect.addEventListener('change', (e) => {
        const newHexCol = e.target.value;
        createMazePalette(newHexCol);
    });
    createMazePalette(mazeColorSelect.value);

    // Maze generation animation controller.
    document.getElementById('animate-maze-gen').addEventListener('change', (e) => {
        animateGenerator = e.target.checked;
    });

    // Maze generator button.
    document.getElementById('generate-maze-btn').addEventListener('click', (e) => {
        generateMaze();
        solver = null;
    });
};

//-------------------------------------------------------------------------

const createSolutionPalette = (hexCol) => {
    const r = parseInt(hexCol.slice(1, 3), 16);
    const g = parseInt(hexCol.slice(3, 5), 16);
    const b = parseInt(hexCol.slice(5), 16);
    const a = 1;

    props.solution = {
        colors: {
            path: color(`rgba(${r}, ${g}, ${b}, ${a})`),
        },
    };
};

const clearSolution = () => {
    solution = null;
};

const generateSolution = () => {
    if (!solver) {
        solver = new RandomizedDFSSolver(generator.maze);
    }
    if (!animateSolver) {
        solver.solveAll();
    }
};

const solverUI = () => {
    // Maze maze size controller.
    document.getElementById('maze-challenge-type').addEventListener('change', (e) => {
        if (solver) {
            challengeType = e.target.value;
            solver = new RandomizedDFSSolver(generator.maze);
            solver.maze.createChallenge(challengeType);
        }
    });

    // Maze colour controller.
    const mazeSolveColorSelect = document.getElementById('solve-color');
    mazeSolveColorSelect.addEventListener('change', (e) => {
        const newHexCol = e.target.value;
        createSolutionPalette(newHexCol);
    });
    createSolutionPalette(mazeSolveColorSelect.value);

    // Maze solver animation controller.
    document.getElementById('animate-maze-sol').addEventListener('change', (e) => {
        animateSolver = e.target.checked;
    });

    // Maze solver button.
    document.getElementById('solve-maze-btn').addEventListener('click', (e) => {
        if (solver) {
            generateSolution();
        }
    });
};

// TODO?
//
// 1. Add play, pause, fast-forward controls.
// 2. Transition from one panel to another?
// 3. Add tracing colours.
