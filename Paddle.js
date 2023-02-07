import Sprite from './Sprite.js';

class Paddle extends Sprite {
  constructor(x, y, width, height, color = 'red') {
    super(x, y, width, height, color);
  }
}

export default Paddle;
