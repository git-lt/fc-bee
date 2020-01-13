import Phaser from 'phaser';

export default class DefeatScene extends Phaser.Scene {
  bg: Phaser.GameObjects.TileSprite;
  score: number;
  constructor() {
    super({ key: 'DefeatScene' });
  }

  create() {
    // 获取画布大小
    const canvasW = this.game.canvas.width;
    const canvasH = this.game.canvas.height;
    const centerW = canvasW / 2;
    const centerH = canvasH / 2;
    this.bg = this.add.tileSprite(centerW, centerW, canvasW, canvasH, 'background');

    const winText = this.add.text(centerW, centerH - 120, 'YOU DIED', {
      font: '58px FC',
      align: 'center',
      fill: '#ffffff'
    });

    const winScore = this.add.text(centerW, centerH - 30, 'LOSE ALL SOULS', {
      font: '26px FC',
      align: 'center',
      fill: '#ffffff'
    });

    const restartText = this.add.text(centerW, centerH + 100, 'TAP TO RESTART ', {
      font: '40px FC',
      align: 'center',
      fill: '#ffffff'
    });

    // 设置锚点
    winText.setOrigin(0.5, 0.5);
    winScore.setOrigin(0.5, 0.5);
    restartText.setOrigin(0.5, 0.5);

    restartText.setInteractive();

    // 注册点击事件
    restartText.on('pointerdown', () => {
      restartText.setTint(0xff0000);
    });
    restartText.on('pointerup', () => {
      restartText.clearTint();
      // 切换为游戏场景
      this.scene.start('PlayScene');
    });
  }
  update() {
    // 背景滚动
    this.bg.tilePositionY -= 2;
  }
}
