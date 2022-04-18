console.log('Loading canvas...');

var canvas = document.querySelector('canvas');

var resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas, false);
canvas.style.background = 'black';

var ctx = canvas.getContext('2d');

var x = 10;
var y = 10;

var cellSize = 10;

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    //

    ctx.save();

    // We should translate the origin here first, then, draw the line from the center?
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 4);

    for (var xa = 0; xa < canvas.width; xa += cellSize) {
        ctx.beginPath();
        ctx.moveTo(xa, 0);
        ctx.lineTo(xa, canvas.height);
        ctx.closePath();
        ctx.strokeStyle = 'green';
        ctx.stroke();
    }

    for (var ya = 0; ya < canvas.height; ya += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, ya);
        ctx.lineTo(canvas.width, ya);
        ctx.closePath();
        ctx.strokeStyle = 'green';
        ctx.stroke();
    }

    ctx.restore();

    // Circle
    //
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'purple';
    ctx.fill();
    x += 1;
    y += 1;

    requestAnimationFrame(tick);
}
tick();
