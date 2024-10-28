// Confetti button event
document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.confetti');  

  button.addEventListener('click', function() {
    const rect = button.getBoundingClientRect();
    
    // Calculate the button's center for confetti origin (as percentage of window)
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const confettiSettings = {
      particleCount: 300,
      spread: 80,
      origin: { x: x, y: y }
    };

    confetti(confettiSettings);
  });
});

// Animation setup for fade-in and fade-out on scroll
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, {
    threshold: 0.5  // Trigger when 50% of section is visible
  });

  sections.forEach(section => {
    observer.observe(section);
  });
});


// flappy rammo section
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let birdY = canvas.height / 2;
let birdVelocity = 0;
const gravity = 0.5;
const jumpHeight = -10;
let score = 0;

const bird = new Image();
bird.src = "../website/tota.png "; // Replace with bird image path

// Load pipe images once
const pipeTop = new Image();
pipeTop.src = "../website/toppipe.png";
const pipeBottom = new Image();
pipeBottom.src = "../website/bottompipe.png";

const obstacles = [];
const obstacleWidth = 60;
const gapHeight = 200;
let obstacleSpeed = 2;

function drawBird() {
  ctx.drawImage(bird, 60, birdY, 60, 55); // Adjust width and height values here
}


function createObstacle() {
    const heightTop = Math.random() * (canvas.height - gapHeight - 100) + 50;
    obstacles.push({
        x: canvas.width,
        y: 0,
        width: obstacleWidth,
        heightTop: heightTop,
        heightBottom: canvas.height - heightTop - gapHeight,
    });
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
      ctx.drawImage(pipeTop, obstacle.x, obstacle.y, obstacle.width, obstacle.heightTop);
      ctx.drawImage(
          pipeBottom,
          obstacle.x,
          canvas.height - obstacle.heightBottom,
          obstacle.width,
          obstacle.heightBottom
      );
  });
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            document.getElementById("score").textContent = score;
        }

        if (
            (50 < obstacle.x + obstacle.width && 50 + 40 > obstacle.x &&
            (birdY < obstacle.heightTop || birdY + 30 > canvas.height - obstacle.heightBottom))
        ) {
            resetGame();
        }
    });
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        createObstacle();
    }
}

function resetGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    score = 0;
    document.getElementById("score").textContent = score;
    obstacles.length = 0;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    birdVelocity += gravity;
    birdY += birdVelocity;

    if (birdY + 30 > canvas.height) resetGame();

    drawBird();
    updateObstacles();
    drawObstacles();

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", () => {
    birdVelocity = jumpHeight;
});

gameLoop();
