const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    color: 'blue',
    bullets: [],
    speed: 5,
    shoot: function() {
        this.bullets.push({
            x: this.x + this.width / 2,
            y: this.y,
            width: 5,
            height: 10,
            speed: 7
        });
    }
};

let zombies = [];
const zombieInterval = 1000;
let lastZombieTime = 0;

function createZombie() {
    zombies.push({
        x: Math.random() * (canvas.width - 40),
        y: 0,
        width: 40,
        height: 40,
        color: 'green',
        speed: 2
    });
}

function updateBullets() {
    player.bullets = player.bullets.filter(bullet => bullet.y > 0);
    player.bullets.forEach(bullet => bullet.y -= bullet.speed);
}

function updateZombies() {
    zombies.forEach(zombie => zombie.y += zombie.speed);
    zombies = zombies.filter(zombie => zombie.y < canvas.height);
}

function checkCollisions() {
    player.bullets.forEach((bullet, bulletIndex) => {
        zombies.forEach((zombie, zombieIndex) => {
            if (bullet.x < zombie.x + zombie.width &&
                bullet.x + bullet.width > zombie.x &&
                bullet.y < zombie.y + zombie.height &&
                bullet.height + bullet.y > zombie.y) {
                player.bullets.splice(bulletIndex, 1);
                zombies.splice(zombieIndex, 1);
            }
        });
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    player.bullets.forEach(bullet => {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawZombies() {
    zombies.forEach(zombie => {
        ctx.fillStyle = zombie.color;
        ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawZombies();
    updateBullets();
    updateZombies();
    checkCollisions();

    if (Date.now() - lastZombieTime > zombieInterval) {
        createZombie();
        lastZombieTime = Date.now();
    }

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    }
    if (event.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (event.key === ' ') {
        player.shoot();
    }
});

update();
