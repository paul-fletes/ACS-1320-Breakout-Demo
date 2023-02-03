/* eslint-disable max-classes-per-file */
const canvas = document.getElementById('myCanvas'); // reference to canvas obj
const ctx = canvas.getContext('2d'); // create context to paint canvas
// declare ball radius for collision calcs
const ballRadius = 10;
const PI2 = Math.PI * 2;
// declare object color
const color = '#0095DD';
// declare paddle variables
const paddleHeight = 10;
const paddleWidth = 75;
const paddleXStart = (canvas.width - paddleWidth) / 2;
const paddleYStart = canvas.height - paddleHeight;
// let paddleX = paddleXStart;
// declare keypress variables
let rightPressed = false;
let leftPressed = false;
// declare brick variables
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

class Ball {
  constructor(x = 0, y = 0, dx = 2, dy = -2, radius = 10, color = 'red') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  // define a fxn that draws a ball using the context methods
  render(ctx) {
    // draw a ball
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.status = 1;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

// Bricks
class Bricks {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.bricks = [];
    this.init();
  }

  init() {
    for (let c = 0; c < this.cols; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        this.bricks[c][r] = new Brick(brickX, brickY, brickWidth, brickHeight, color);
      }
    }
  }

  render(ctx) {
    for (let c = 0; c < this.cols; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        const brick = this.bricks[c][r];
        if (brick.status === 1) {
          brick.render(ctx);
        }
      }
    }
  }
}

const bricks = new Bricks(brickColumnCount, brickRowCount)
// Paddle
class Paddle {
  constructor(x, y, width, height, color = 'red') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

const paddle = new Paddle(paddleXStart, paddleYStart, paddleWidth, paddleHeight, color);

// Score
// Lives

class GameLabel {
  constructor(text, x, y, color, font = '16px Arial') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.value = 0;
    this.font = font;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`${this.text} ${this.value}`, this.x, this.y);
  }
}

const scoreLabel = new GameLabel('Score: ', 8, 20);
const livesLabel = new GameLabel('Lives: ', canvas.width - 65, 20);
livesLabel.value = 3;

// Game - owns the draw and runs game loop

let ball = new Ball(0, 0, 2, -2, ballRadius, color);

resetBallAndPaddle();

// define fxns that handle key down/up events
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.moveTo(relativeX - paddle.width / 2, paddleYStart)
  }
}

// set event listeners for keypress
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

// define a fxn that detects ball/brick collision
function collisionDetection() {
  for (let c = 0; c < bricks.cols; c += 1) {
    for (let r = 0; r < bricks.rows; r += 1) {
      const brick = bricks.bricks[c][r];
      // change ball direction on ball/brick collision
      if (brick.status === 1) {
        if (ball.x > brick.x
          && ball.x < brick.x + brickWidth
          && ball.y > brick.y
          && ball.y < brick.y + brickHeight) {
          ball.dy = -ball.dy;
          brick.status = 0;
          scoreLabel.value += 1; // award point each hit
          // game win logic
          if (scoreLabel.value === bricks.rows * bricks.cols) {
            alert(`YOU WIN, CONGRATS! TOTAL SCORE: ${score}!`);
            document.location.reload();
          }
        }
      }
    }
  }
}

// define a fxn that detects canvas/paddle collision
function collisionsWithCanvasAndPaddle() {
  // check for top/bottom wall/paddle collision
  if (ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy * 1.1; // '* 1.1' increases dy by 10% each paddle hit
    } else { // game loss logic
      livesLabel.value -= 1;
      if (livesLabel.value < 1) {
        alert(`GAME OVER! TOTAL SCORE: ${scoreLabel.value}!`);
        document.location.reload();
      } else {
        resetBallAndPaddle();
      }
    }
  }
  // check for left/right wall collision
  if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
  }
}

// define a fxn to reset ball and paddle
function resetBallAndPaddle() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 2;
  ball.dy = -2;
  paddle.x = paddleXStart;
}

// define a function that updates paddle mvmts with right/left press
function movePaddle() {
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.moveBy(7, 0);
  } else if (leftPressed && paddle.x > 0) {
    paddle.moveBy(-7, 0);
  }
}

// define a function that covers all drawings on canvas using context methods
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // call drawball fxn
  ball.render(ctx);
  // call drawpaddle fxn
  paddle.render(ctx);
  // call drawscore fxn
  scoreLabel.render(ctx);
  // call collisiondetection fxn
  collisionDetection();
  // call canvas/paddle collision fxn
  collisionsWithCanvasAndPaddle();
  // call drawbricks fxn
  bricks.render(ctx);
  // call drawlives fxn
  livesLabel.render(ctx);
  // call moveball fxn
  ball.move();
  // call movepaddle fxn
  movePaddle();
  // redraw the screen
  requestAnimationFrame(draw);
}

draw();
