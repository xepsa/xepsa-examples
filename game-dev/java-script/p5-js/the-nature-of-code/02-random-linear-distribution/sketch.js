class BarChart {
    constructor(origin, cols, colWidth, dataHeight) {
        this.origin = origin;
        this.cols = cols;
        this.colWidth = colWidth;
        this.dataHeight = dataHeight;
        this.data = [];
        for (let i = 0; i < cols; i++) {
            this.data[i] = 0;
        }
    }

    // Interface

    update = () => {};

    draw = () => {
        for (let i = 0; i < this.cols; i++) {
            rect(i * this.colWidth, this.origin.y, this.colWidth, -this.dataHeight * this.data[i]);
        }
    };

    // Methods

    addTo = (col) => {
        this.data[col] += this.dataHeight;
    };
}

const BG_COLOR = 50;
const CANVAS_W = 1000;
const CANVAS_H = 500;

let barChart;
const isRound = false;

function preload() {}

function setup() {
    createCanvas(CANVAS_W, CANVAS_H);
    background(BG_COLOR);
    const origin = { x: 0, y: height };
    const cols = 100;
    const colWidth = width / cols;
    const dataHeight = 2;
    barChart = new BarChart(origin, cols, colWidth, dataHeight);
    barChart.draw();
}

function draw() {
    background(BG_COLOR);

    const chartCol = isRound ? Math.round(random(0, barChart.cols - 1)) : Math.floor(random(0, barChart.cols));

    barChart.addTo(chartCol);
    barChart.update();
    barChart.draw();
}
