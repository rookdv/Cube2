const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bird = {
    x: 50,
    y: canvas.height / 2,
    velocity: 0,
    gravity: 0.4,
    jumpPower: 6,
    width: 40,
    height: 40,
};

const pipeWidth = 60;
const pipeGap = 100;
const pipes = [];
let score = 0;
let gameStarted = false;
let isJumping = false;

// Handle key press to start the game and make the bird jump
document.addEventListener("keydown", function (event) {
    if (!gameStarted) {
        gameStarted = true;
        startGame();
    }

    if (event.key === " " && !isJumping) {
        bird.velocity = -bird.jumpPower;
        isJumping = true;
    }
});

// Handle key release to allow for another jump
document.addEventListener("keyup", function (event) {
    if (event.key === " ") {
        isJumping = false;
    }
});

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(x, height) {
    ctx.fillStyle = "green";
    ctx.fillRect(x, 0, pipeWidth, height);
    ctx.fillRect(x, height + pipeGap, pipeWidth, canvas.height - (height + pipeGap));
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
        return; // Don't update the game if it hasn't started yet
    }

    // Update bird position
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Draw bird
    drawBird();

    // Generate and draw pipes
    if (frameCount % 90 === 0) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, height: pipeHeight });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        drawPipe(pipes[i].x, pipes[i].height);

        pipes[i].x -= 2;

        // Remove pipes that are out of the canvas
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }

        // Check for collisions
        if (
            bird.x + bird.width > pipes[i].x &&
            bird.x < pipes[i].x + pipeWidth &&
            (bird.y < pipes[i].height || bird.y + bird.height > pipes[i].height + pipeGap)
        ) {
            // Game over
            alert("Game over. Your score: " + score);
            location.reload();
        }

        // Update score
        if (bird.x > pipes[i].x + pipeWidth && !pipes[i].scored) {
            score++;
            pipes[i].scored = true;
        }
    }

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 20, 40);

    requestAnimationFrame(draw);
    frameCount++;
}

let frameCount = 0;

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    draw();
}
