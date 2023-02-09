import Sprite from './Sprite';

class Brick extends Sprite {
  status: number
  constructor(x: number, y: number, width: number, height: number, color: string) {
    super(x, y, width, height, color);
    this.status = 1;
  }
}

export default Brick;
