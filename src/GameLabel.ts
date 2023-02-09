import Sprite from './Sprite';

class GameLabel extends Sprite {
  text: string
  value: number
  font: string

  constructor(text: string, x: number, y: number, color: string, font: string = '16px Arial') {
    super(x, y, 0, 0, color);
    this.text = text;
    this.value = 0;
    this.font = font;
  }

  render(ctx: any) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`${this.text} ${this.value}`, this.x, this.y);
  }
}

export default GameLabel;
