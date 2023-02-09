import Ball from './Ball';
import Sprite from './Sprite';
import Bricks from './Bricks';
import GameLabel from './GameLabel';

class Game {
  canvas: any // Revisit
  ctx: any // Revisit
  ballRadius: number
  paddleHeight: number
  paddleWidth: number
  brickRowCount: number
  brickColumnCount: number
  brickWidth: number
  brickHeight: number
  brickPadding: number
  offsetTop: number
  offsetLeft: number
  paddleXStart: number
  paddleYStart: number
  color: string
  ball: Ball
  paddle: Sprite
  bricks: Bricks
  scoreLabel: GameLabel
  livesLabel: GameLabel
  rightPressed: boolean
  leftPressed: boolean


  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId); // reference to canvas obj
    this.ctx = this.canvas.getContext('2d'); // create context to paint canvas

    this.ballRadius = 10;
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.brickRowCount = 5;
    this.brickColumnCount = 3;
    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.offsetTop = 30;
    this.offsetLeft = 30;
    this.paddleXStart = (this.canvas.width - this.paddleWidth) / 2;
    this.paddleYStart = this.canvas.height - this.paddleHeight;
    this.color = '#0095DD';

    this.ball = new Ball(0, 0, 2, -2, this.ballRadius, this.color);
    this.paddle = new Sprite(
      this.paddleXStart, this.paddleYStart, this.paddleWidth, this.paddleHeight, this.color);
    // this.bricks = new Bricks(this.brickColumnCount, this.brickRowCount);
    this.bricks = new Bricks({
      cols: this.brickColumnCount,
      rows: this.brickRowCount,
      width: this.brickWidth,
      height: this.brickHeight,
      padding: this.brickPadding,
      offsetLeft: this.offsetLeft,
      offsetTop: this.offsetTop,
      color: this.color,
    });
    this.scoreLabel = new GameLabel('Score: ', 8, 20, this.color);
    this.livesLabel = new GameLabel('Lives: ', this.canvas.width - 65, 20, this.color);

    this.rightPressed = false;
    this.leftPressed = false;

    this.setup();

    this.draw();
  }

  setup() {
    console.log("*****THIS IS SETUP!!!!******")
    this.livesLabel.value = 3;
    this.resetBallAndPaddle();
    document.addEventListener('keydown', (e) => {
      this.keyDownHandler(e);
    }, false);
    document.addEventListener('keyup', (e) => {
      this.keyUpHandler(e);
    }, false);
    document.addEventListener('mousemove', (e) => {
      console.log('mouse move!');
      this.mouseMoveHandler(e);
    }, false);
  }

  resetBallAndPaddle() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 30;
    this.ball.dx = 2;
    this.ball.dy = -2;
    this.paddle.x = this.paddleXStart;
  }

  collisionDetection() {
    for (let c = 0; c < this.bricks.cols; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const brick = this.bricks.bricks[c][r];
        // change ball direction on ball/brick collision
        if (brick.status === 1) {
          if (this.ball.x > brick.x
            && this.ball.x < brick.x + this.brickWidth
            && this.ball.y > brick.y
            && this.ball.y < brick.y + this.brickHeight) {
            this.ball.dy = -this.ball.dy;
            brick.status = 0;
            this.scoreLabel.value += 1; // award point each hit
            // game win logic
            if (this.scoreLabel.value === this.bricks.rows * this.bricks.cols) {
              alert('YOU WIN, CONGRATS!');
              document.location.reload();
            }
          }
        }
      }
    }
  }

  movePaddle() {
    if (this.rightPressed && this.paddle.x < this.canvas.width - this.paddle.width) {
      this.paddle.moveBy(7, 0);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.moveBy(-7, 0);
    }
  }

  collisionsWithCanvasAndPaddle() {
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        this.ball.dy = -this.ball.dy * 1.1; // '* 1.1' increases dy by 10% each paddle hit
      } else { // game loss logic
        this.livesLabel.value -= 1;
        if (this.livesLabel.value < 1) {
          alert(`GAME OVER! TOTAL SCORE: ${this.scoreLabel.value}!`);
          document.location.reload();
        } else {
          this.resetBallAndPaddle();
        }
      }
    }
    if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius
      || this.ball.x + this.ball.dx < this.ball.radius) {
      this.ball.dx = -this.ball.dx;
    }
  }

  keyDownHandler(e: KeyboardEvent) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e: KeyboardEvent) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e: MouseEvent) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    console.log(relativeX)
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.moveTo(relativeX - this.paddle.width / 2, this.paddleYStart);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // call drawball fxn
    this.ball.render(this.ctx);
    // call drawpaddle fxn
    this.paddle.render(this.ctx);
    // call drawscore fxn
    this.scoreLabel.render(this.ctx);
    // call collisiondetection fxn
    this.collisionDetection();
    // call canvas/paddle collision fxn
    this.collisionsWithCanvasAndPaddle();
    // call drawbricks fxn
    this.bricks.render(this.ctx);
    // call drawlives fxn
    this.livesLabel.render(this.ctx);
    // call moveball fxn
    this.ball.move();
    // call movepaddle fxn
    this.movePaddle();
    // redraw the screen
    // requestAnimationFrame(this.draw.bind(this)); method 1 - use .bind(this)
    requestAnimationFrame(() => {
      this.draw();
    });
  }
}

export default Game;
