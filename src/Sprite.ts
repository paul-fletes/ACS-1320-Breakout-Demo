class Sprite {
  x: number
  y: number
  width: number
  height: number
  color: string

  constructor(x = 0, y = 0, width = 10, height = 10, color = '#red') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  moveBy(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  render(ctx: any) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export default Sprite;
