class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = 2;
    this.dy = -2;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  collisionCheck(canvas) {
    if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {
      color = randColor();
    }
    // check for left/right wall collision color change
    if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
      color = randColor();
    }
  }
}

export default Ball;
