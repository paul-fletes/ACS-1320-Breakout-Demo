import Sprite from './Sprite';

class Ball extends Sprite {
  dx: number
  dy: number
  radius: number
  PI2: number

  constructor(x = 0, y = 0, dx = 2, dy = -2, radius = 10, color = 'red') {
    super(x, y, radius * 2, radius * 2, color);
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.PI2 = Math.PI * 2;
  }

  move() {
    this.moveBy(this.dx, this.dy);
  }

  render(ctx: any) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export default Ball;
