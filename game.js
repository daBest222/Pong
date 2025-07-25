const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 15, paddleHeight = 100;
const ballRadius = 10;

let leftPaddle = { x: 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
let rightPaddle = { x: canvas.width - 20 - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: 5 * (Math.random() > 0.5 ? 1 : -1),
  dy: 3 * (Math.random() > 0.5 ? 1 : -1)
};
let scoreLeft = 0, scoreRight = 0;

function drawRect(x, y, w, h, color="#fff") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color="#fff") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  drawRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
  drawRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);

  // Draw ball
  drawBall(ball.x, ball.y, ballRadius);

  // Draw center line
  ctx.strokeStyle = "#fff";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function update() {
  // Move paddles
  leftPaddle.y += leftPaddle.dy;
  leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddle.y));

  // AI for right paddle
  if (ball.y < rightPaddle.y + paddleHeight/2) rightPaddle.dy = -4;
  else if (ball.y > rightPaddle.y + paddleHeight/2) rightPaddle.dy = 4;
  else rightPaddle.dy = 0;
  rightPaddle.y += rightPaddle.dy;
  rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y));

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Collisions with top/bottom walls
  if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
    ball.dy *= -1;
  }

  // Collisions with paddles
  // Left paddle
  if (
    ball.x - ballRadius < leftPaddle.x + paddleWidth &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + paddleHeight
  ) {
    ball.dx = Math.abs(ball.dx);
    // Add some deflection based on where it hit
    let impact = ball.y - (leftPaddle.y + paddleHeight/2);
    ball.dy = impact * 0.15;
  }
  // Right paddle
  if (
    ball.x + ballRadius > rightPaddle.x &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + paddleHeight
  ) {
    ball.dx = -Math.abs(ball.dx);
    let impact = ball.y - (rightPaddle.y + paddleHeight/2);
    ball.dy = impact * 0.15;
  }

  // Score
  if (ball.x < 0) {
    scoreRight++;
    resetBall();
  }
  if (ball.x > canvas.width) {
    scoreLeft++;
    resetBall();
  }

  document.getElementById('score-left').textContent = scoreLeft;
  document.getElementById('score-right').textContent = scoreRight;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") leftPaddle.dy = -6;
  if (e.key === "ArrowDown") leftPaddle.dy = 6;
});
document.addEventListener('keyup', (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") leftPaddle.dy = 0;
});
// Mouse controls
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - paddleHeight/2;
  leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddle.y));
});

gameLoop();