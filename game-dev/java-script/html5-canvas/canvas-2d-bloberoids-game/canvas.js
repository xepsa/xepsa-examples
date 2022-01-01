console.log('Loading canvas...');

var canvas = document.querySelector('canvas');

var resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas, false);

var ctx = canvas.getContext('2d');

// 2D Vector ------------------------------------------------------------------
//
class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
// Player ---------------------------------------------------------------------
//
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
    }
}

// Projectile -----------------------------------------------------------------
//
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// Game Loop ------------------------------------------------------------------

const player = new Player(canvas.width / 2, canvas.height / 2, 20, 'blue');

const projectiles = [];

function tick() {
    requestAnimationFrame(tick);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    projectiles.forEach((p) => {
        p.update();
    });
}
tick();

// Event Listeners ------------------------------------------------------------
//

addEventListener('click', (e) => {
    // Calculate velocity for projectile.
    const y = e.clientY - canvas.height / 2;
    const x = e.clientX - canvas.width / 2;
    const angle = Math.atan2(y, x); // NB: 'y' comes first for 'atan2'!
    const velocity = new Vec2D(Math.cos(angle), Math.sin(angle));

    const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', velocity);
    projectiles.push(projectile);
});
