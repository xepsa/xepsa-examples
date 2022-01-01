const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = document.getElementById('source');

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var tick = 0;

function update() {
    clear();

    var frame = tick % 10; // There are 10 images in the sprite sheet.
    var sx = frame * 12; // Each sprite is 13 pixels wide (13 x 13)
    ctx.drawImage(
        // Sprite sheet image.
        image,
        // Source coordinates. (x, y, w, h)
        sx,
        0,
        13,
        13,
        // Destination coordinates. (x, y, w, h)
        canvas.width / 2,
        canvas.height / 2,
        13,
        13
    );
    tick++;

    requestAnimationFrame(update);
}

update();
