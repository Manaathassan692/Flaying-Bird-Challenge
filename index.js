const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird;
let obstacles;
let score;
let gameRunning = false;

const obstacleWidth = 50;
const gap = 200;
let obstacleSpeed = 5;

function resetGame() {
    bird = {
        x: 50,
        y: canvas.height / 2,
        size: 20,
        gravity: 2,
        lift: -20,
        velocity: 0,
        color: 'yellow',
    };

    obstacles = [];
    score = 0;
    gameRunning = true;
    gameLoop();
}

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.fillStyle = bird.color;
    ctx.fill();
    ctx.closePath();
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'green';
        ctx.fillRect(obstacle.x, 0, obstacleWidth, obstacle.topHeight);
        ctx.fillRect(obstacle.x, canvas.height - obstacle.bottomHeight, obstacleWidth, obstacle.bottomHeight);
    });
}

function updateObstacles() {
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300) {
        const topHeight = Math.random() * (canvas.height - gap - 100) + 50;
        const bottomHeight = canvas.height - gap - topHeight;

        obstacles.push({ x: canvas.width, topHeight, bottomHeight });
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;

        if (obstacle.x + obstacleWidth < 0) {
            obstacles.splice(index, 1);
            score++;
        }
    });
}

function detectCollision() {
    for (const obstacle of obstacles) {
        if (
            bird.x + bird.size > obstacle.x &&
            bird.x - bird.size < obstacle.x + obstacleWidth &&
            (bird.y - bird.size < obstacle.topHeight || bird.y + bird.size > canvas.height - obstacle.bottomHeight)
        ) {
            gameRunning = false;
            showRestartMessage();
        }
    }

    if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) {
        gameRunning = false;
        showRestartMessage();
    }
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.size) {
        bird.y = canvas.height - bird.size;
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function showRestartMessage() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Tap to Restart', canvas.width / 2, canvas.height / 2 + 20);
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawObstacles();
    updateObstacles();
    detectCollision();
    updateBird();
    drawScore();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', () => {
    if (gameRunning) {
        bird.velocity = bird.lift;
    }
});

canvas.addEventListener('click', () => {
    if (!gameRunning) {
        resetGame();
    } else {
        bird.velocity = bird.lift;
    }
});

resetGame();
