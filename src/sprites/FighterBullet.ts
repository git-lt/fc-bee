import Phaser from 'phaser';
import Bullet from './Bullet';

export default class FighterBullet extends Bullet {
  constructor(scene: Phaser.Scene) {
    super(scene, 'bullet', [6, 36], 1800, 10);
  }
}
