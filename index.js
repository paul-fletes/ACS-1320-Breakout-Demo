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
let paddleX = paddleXStart;
// declare x/y coordinates of ball, and speed of ball with dx/dy
// let x = canvas.width / 2;
// let y = canvas.height - 30;
// let dx = 2;
// let dy = -2;
let ball = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
};
resetBallAndPaddle();
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
// declare a score variable
let score = 0;
// declare a variable to track lives
let lives = 3;
// declare an array to hold brick field
const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

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
    paddleX = relativeX - paddleWidth / 2;
  }
}

// set event listeners for keypress
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

// // define a fxn that returns a random hex color value
// function randColor() {
//   return (
//     `#${(Math.floor(Math.random() * 0x1000000) + 0x1000000)
//       .toString(16).substring(1)}`
//   );
// }

// define a fxn that detects ball/brick collision
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r];
      // change ball direction on ball/brick collision
      if (brick.status === 1) {
        if (ball.x > brick.x
          && ball.x < brick.x + brickWidth
          && ball.y > brick.y
          && ball.y < brick.y + brickHeight) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score += 1; // award point each hit
          // game win logic
          if (score === brickRowCount * brickColumnCount) {
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
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      ball.dy = -ball.dy * 1.1; // '* 1.1' increases dy by 10% each paddle hit
    } else { // game loss logic
      lives -= 1;
      if (!lives) {
        alert(`GAME OVER! TOTAL SCORE: ${score}!`);
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
  paddleX = paddleXStart;
}

// define a function to update score
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = color;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// define a function to update lives
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = color;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// define a fxn that draws a ball using the context methods
function drawBall() {
  // draw a ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, PI2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// define a fxn that draws a paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// define a fxn that draws the brick field
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// define a function that updates x/y with dx/dy to move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// define a function that updates paddle mvmts with right/left press
function movePaddle() {
  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }
}

// define a function that covers all drawings on canvas using context methods
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // call drawball fxn
  drawBall();
  // call drawpaddle fxn
  drawPaddle();
  // call drawscore fxn
  drawScore();
  // call collisiondetection fxn
  collisionDetection();
  // call canvas/paddle collision fxn
  collisionsWithCanvasAndPaddle();
  // call drawbricks fxn
  drawBricks();
  // call drawlives fxn
  drawLives();
  // call moveball fxn
  moveBall();
  // call movepaddle fxn
  movePaddle();
  // redraw the screen
  requestAnimationFrame(draw);
}

draw();
