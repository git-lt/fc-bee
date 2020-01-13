import Phaser from 'phaser';
import Bullet from './Bullet';

export default class AlaxingBullet extends Bullet {
  constructor(scene: Phaser.Scene) {
    super(scene, 'alaxing-bullet', [9, 9], 5000, 5);
  }
}
