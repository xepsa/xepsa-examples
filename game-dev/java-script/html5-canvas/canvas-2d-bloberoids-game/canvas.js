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

function raycast(source, destination) {
    const dx = destination.x - source.x;
    const dy = destination.y - source.y;
    const angle = Math.atan2(dy, dx); // NB: 'y' comes first for 'atan2'!
    const velocity = new Vec2D(Math.cos(angle), Math.sin(angle));
    return velocity;
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
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

// Enemy ----------------------------------------------------------------------
//
class Enemy {
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

function spawnEnemies() {
    const randomSpawnOrigin = (offset) => {
        let result;
        const spawnEdge = Math.random();
        if (spawnEdge < 0.25) {
            // Spawn Top Edge
            result = new Vec2D(Math.random() * canvas.width, 0 - offset);
        } else if (spawnEdge < 0.5) {
            // Spawn Bottom Edge
            result = new Vec2D(Math.random() * canvas.width, canvas.height + offset);
        } else if (spawnEdge < 0.75) {
            // Spawn Left Edge
            result = new Vec2D(0 - offset, Math.random() * canvas.height);
        } else {
            // Spawn Right Edge
            result = new Vec2D(canvas.width + offset, Math.random() * canvas.height);
        }
        return result;
    };

    setInterval(() => {
        const radius = randomInRange(5, 30);
        const color = 'green';
        const center = new Vec2D(canvas.width / 2, canvas.height / 2);
        const origin = randomSpawnOrigin(radius);
        const velocity = raycast(origin, center);

        enemies.push(new Enemy(origin.x, origin.y, radius, color, velocity));
    }, 1000);
}
spawnEnemies();

// Game Loop ------------------------------------------------------------------

const player = new Player(canvas.width / 2, canvas.height / 2, 20, 'blue');

const projectiles = [];

const enemies = [];

function tick() {
    requestAnimationFrame(tick); // requestAnimationFrame - calls itself as quickly as possible.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    projectiles.forEach((p) => {
        p.update();
    });
    enemies.forEach((e) => {
        e.update();
    });
}
tick();

// Event Listeners ------------------------------------------------------------
//

addEventListener('click', (e) => {
    // Calculate velocity for projectile.
    const velocity = raycast(new Vec2D(canvas.width / 2, canvas.height / 2), new Vec2D(e.clientX, e.clientY));
    const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', velocity);
    projectiles.push(projectile);
});
