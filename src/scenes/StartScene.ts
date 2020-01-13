import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  bg: Phaser.GameObjects.TileSprite;
  constructor() {
    super({ key: 'StartScene', active: true });
  }

  preload() {
    // 进度条
    const progress = this.add.graphics();
    this.load.on('progress', v => {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, this.game.canvas.height / 2 - 2, 750 * v, 4);
    });
    this.load.on('complete', () => progress.destroy());

    // 加载
    this.load.image('background', require('../images/galaxing_bg.png'));
    this.load.image('airplane', require('../images/airplane.png'));
    this.load.image('bullet', require('../images/bullet.png'));
    this.load.image('alaxing-bullet', require('../images/enemy-bullet.png'));
    this.load.spritesheet('explode', require('../images/explode.png'), {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('galaxing-anim', require('../images/galaxing.png'), {
      frameWidth: 60,
      frameHeight: 40
    });
  }

  create() {
    const canvasW = this.scale.width;
    const canvasH = this.scale.height;

    // 图片居中，图片的锚点默认在 中心点 (将图片的中心点与画布中心点对齐)
    this.bg = this.add.tileSprite(canvasW / 2, canvasH / 2, canvasW, canvasH, 'background');

    // 文本居中
    const progressText = this.add.text(canvasW / 2, canvasH / 2, ' TAP TO START', {
      font: '58px FC',
      align: 'center',
      fill: '#ffffff'
    });
    // 文本的锚点默认在左上角，设置到中心，方便定位
    progressText.setOrigin(0.5, 0.5);

    // 注册事件之前，必须先激活为 可交互对象！！
    progressText.setInteractive();
    // 注册点击事件
    progressText.on('pointerdown', () => {
      progressText.setTint(0xff0000);
    });
    progressText.on('pointerup', () => {
      progressText.clearTint();
      // 切换为游戏场景
      this.scene.start('PlayScene');
    });
  }

  update() {
    // 背景滚动
    this.bg.tilePositionY -= 2;
  }
}

// 将资源随机放到画布上
// randomShowInScene(){
//   const keys = this.textures.getTextureKeys();
//   keys.forEach(v => {
//     const x = Phaser.Math.Between(0, 750);
//     const y = Phaser.Math.Between(0, 1000);
//     this.add.image(x, y, v);
//   });
// }
