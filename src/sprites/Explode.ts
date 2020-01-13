import Phaser from 'phaser';

export default class Explode extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'explode');
  }

  show(x: number, y: number) {
    this.setPosition(x, y);
    this.active = true;
    this.visible = true;
    this.play('kaboom');
    this.once('animationcomplete-kaboom', () => {
      this.active = false;
      this.visible = false;
    });
  }
}
