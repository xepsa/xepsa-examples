console.log('Loading canvas...');

var canvas = document.querySelector('canvas');

var resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas, false);

var context = canvas.getContext('2d');

function tick() {
    // Better to do this
    // resizeCanvas();
    requestAnimationFrame(tick);
}
tick();
