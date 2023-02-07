import Sprite from './Sprite.js'

class Brick extends Sprite {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);
    this.status = 1;
  }
}

export default Brick;
