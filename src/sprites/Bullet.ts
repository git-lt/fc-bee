import Phaser from 'phaser';

// 子弹类
export default class Bullet extends Phaser.GameObjects.Image {
  speed: number;
  born: number;
  direction: number;
  xSpeed: number;
  ySpeed: number;
  recoveryTime: number;
  // 加速度
  velocity: number;

  constructor(scene: Phaser.Scene, spriteName: string, size: [number, number], recoveryTime: number, velocity?: number) {
    super(scene, 0, 0, spriteName);
    this.speed = 1;
    this.born = 0;
    this.direction = 0;
    this.velocity = velocity || 10;
    this.setSize(...size); //[6, 20]
  }

  fire(shooter, target) {
    this.setPosition(shooter.x, shooter.y);
    this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

    if (target.y >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction);
      this.ySpeed = this.speed * Math.cos(this.direction);
    } else {
      this.xSpeed = -this.speed * Math.sin(this.direction);
      this.ySpeed = -this.speed * Math.cos(this.direction);
    }

    this.rotation = shooter.rotation;
    this.born = 0;
  }

  update(time, delta) {
    this.x += this.xSpeed * this.velocity;
    this.y += this.ySpeed * this.velocity;

    this.born += delta;
    // 在多久之后，回收子弹
    if (this.born > this.recoveryTime) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
