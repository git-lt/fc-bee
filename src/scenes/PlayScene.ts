import Phaser from 'phaser';
import FighterBullet from '../sprites/FighterBullet';
import AlaxingBullet from '../sprites/AlaxingBullet';
import Explode from '../sprites/Explode';

export default class PlayScene extends Phaser.Scene {
  // 背景
  bg: Phaser.GameObjects.TileSprite;
  // 飞机
  fighter: Phaser.Physics.Arcade.Sprite;
  // 蜜蜂
  galaxingGroups: Phaser.Physics.Arcade.Group[];

  // 得分
  score: number;
  // 飞机生命值
  lives: number;
  // 限制蜜蜂发射子弹频率
  alaxingShootTime: number;
  // 飞机移动速度
  fighterVelocity: number;

  // 爆炸效果
  explodes: Phaser.GameObjects.Group;
  // 蜜蜂子弹组
  galaxingBullets: Phaser.Physics.Arcade.Group;

  moveKeys: any;
  canvasW: number;
  canvasH: number;

  scoreTxt: Phaser.GameObjects.Text;
  liveTxt: Phaser.GameObjects.Text;

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    super({ key: 'PlayScene' });
    this.fighterVelocity = 200;
  }

  init() {
    this.lives = 5;
    this.score = 0;
    this.alaxingShootTime = 0;
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    // 获取画布大小
    this.canvasW = this.game.canvas.width;
    this.canvasH = this.game.canvas.height;
    this.explodes = this.add.group({ classType: Explode, maxSize: 35 });

    // 监听键盘事件
    this.moveKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // 初始化动画
    this._initAnimations();
    // 背景
    this._createBg();
    // 飞机
    this._createFighter();
    // 蜜蜂
    this._createGalaxing();
    // 文本
    this._createText();

    this.physics.world.setBoundsCollision(true, true, true, true);
  }

  // 每帧更新
  update() {
    // 背景滚动
    this.bg.tilePositionY -= 2;
    this.alaxingShootTime += 10;

    if (this.alaxingShootTime % 1000 === 0) {
      // 蜜蜂 随机开枪
      this.galaxingGroups.forEach(v => {
        const arr = v.getChildren();
        if (!arr.length) return;
        const randomIdx = arr.length > 2 ? Phaser.Math.Between(0, arr.length - 1) : 0;
        const curr = arr[randomIdx];
        const bullet = this.galaxingBullets
          .get()
          .setActive(true)
          .setVisible(true);
        // 开枪
        curr && bullet && bullet.fire(curr, this.fighter);

        // 碰撞检测
        this.physics.add.collider(bullet, this.fighter, this._onHitFighter);
      });
    }

    // 飞机移动
    this.fighter.setVelocity(0);
    if (this.cursors.left.isDown) {
      return this.fighter.setVelocityX(-this.fighterVelocity);
    } else if (this.cursors.right.isDown) {
      return this.fighter.setVelocityX(this.fighterVelocity);
    }

    if (this.cursors.up.isDown) {
      return this.fighter.setVelocityY(-this.fighterVelocity);
    } else if (this.cursors.down.isDown) {
      return this.fighter.setVelocityY(this.fighterVelocity);
    }
  }

  // 创建背景
  _createBg() {
    this.bg = this.add.tileSprite(this.canvasW / 2, this.canvasH / 2, this.canvasW, this.canvasH, 'background');
  }

  // 创建文本
  _createText() {
    const fontOptions = { font: '26px FC', align: 'center', fill: '#ffffff' };
    this.add.text(20, 30, 'SCORE :', fontOptions);
    this.scoreTxt = this.add.text(150, 30, String(this.score), fontOptions);
    this.add.text(this.canvasW - 170, 30, 'LIVES:', fontOptions);
    this.liveTxt = this.add.text(this.canvasW - 60, 30, String(this.lives), fontOptions);
  }
  a;
  // 创建战斗机
  _createFighter() {
    this.fighter = this.physics.add.sprite(this.canvasW / 2, this.canvasH - 120, 'airplane');
    this.fighter.setCollideWorldBounds(true);

    const fighterBullets = this.physics.add.group({
      classType: FighterBullet,
      runChildUpdate: true
    });

    this.input.keyboard.on('keyup_SPACE', () => {
      const bullet = fighterBullets
        .get()
        .setActive(true)
        .setVisible(true);
      // 开枪
      bullet && bullet.fire(this.fighter, { x: this.fighter.x, y: 0 });

      // 碰撞检测
      this.physics.add.collider(bullet, this.galaxingGroups[2], this._onHitAlaxing);
      this.physics.add.collider(bullet, this.galaxingGroups[1], this._onHitAlaxing);
      this.physics.add.collider(bullet, this.galaxingGroups[0], this._onHitAlaxing);
    });
  }

  // 子弹撞蜜蜂
  _onHitAlaxing = (bullet: FighterBullet, alaxing: Phaser.Physics.Arcade.Sprite) => {
    const { x, y } = alaxing;
    alaxing.destroy();
    bullet.destroy();
    // 放特效
    this.explodes.get().show(x, y);
    // 加分
    this.score += 100;
    this.scoreTxt.setText(this.score + '');

    this._checkVictory();
  };

  // 子弹撞飞机
  _onHitFighter = (bullet: AlaxingBullet, fighter: Phaser.Physics.Arcade.Sprite) => {
    bullet.destroy();
    const { x, y } = fighter;
    // 减分
    this.lives--;
    this.liveTxt.setText(this.lives + '');
    // 放特效
    this.explodes.get().show(x, y);
    this._checkDefeat();
  };

  _checkDefeat = () => {
    // 检测失败
    if (this.lives === 0) {
      // 转到 失败场景 (跨场景传参)
      this.scene.start('DefeatScene');
    }
  };

  // 判断是否 胜利
  _checkVictory = () => {
    // 赢得胜利
    const isVictory = this.galaxingGroups.every(v => {
      return v.getChildren().length === 0;
    });

    //判断游戏是否结束
    if (isVictory) {
      // 转到 胜利场景 (跨场景传参)
      this.scene.start('VictoryScene', { score: this.score });
    }
  };

  // 创建小蜜蜂
  _createGalaxing() {
    const groupsConfig = [
      [{ frame: 4, y: 0 }],
      [{ frame: 2, y: 80 }],
      [
        { frame: 0, y: 2 * 80 },
        { frame: 0, y: 3 * 80 },
        { frame: 0, y: 4 * 80 }
      ]
    ];

    let groups: Phaser.Physics.Arcade.Group[] = [];
    groupsConfig.forEach((v, i) => {
      const g = v.map(v => ({
        key: 'galaxing-anim',
        frame: v.frame,
        repeat: 5,
        setXY: { x: 0, y: 200 + v.y, stepX: 80 }
      }));
      const group = this.physics.add.group(g);
      groups.push(group);
    });

    groups[0].playAnimation('fly3');
    groups[1].playAnimation('fly2');
    groups[2].playAnimation('fly1');

    groups.forEach(v => {
      const children = v.getChildren();
      Phaser.Actions.IncX(children, 50);
      children.forEach(c => {
        this.tweens.add({
          targets: c,
          duration: 2000,
          x: c.x + 250,
          delay: 0,
          ease: 'Sine.easeInOut',
          repeat: -1,
          yoyo: true
        });
      });
    });

    this.galaxingBullets = this.physics.add.group({
      classType: AlaxingBullet,
      runChildUpdate: true
    });

    this.galaxingGroups = groups;
  }

  // -------------------------- 动画
  _initAnimations() {
    const config = [
      { key: 'fly1', start: 0, end: 1 },
      { key: 'fly2', start: 2, end: 3 },
      { key: 'fly3', start: 4, end: 5 }
    ];

    config.forEach((v, i) => {
      this.anims.create({
        key: v.key,
        frames: this.anims.generateFrameNames('galaxing-anim', { start: v.start, end: v.end }),
        frameRate: 2,
        yoyo: true,
        repeat: -1
      });
    });

    this.anims.create({
      key: 'kaboom',
      frames: this.anims.generateFrameNames('explode', { start: 0, end: 15 }),
      frameRate: 30,
      repeat: 0
    });
  }
}

// this.input.keyboard.on('keydown_A', this._moveLeft);
// this.input.keyboard.on('keydown_D', this._moveRight);
// this.input.keyboard.on('keydown_W', this._moveUp);
// this.input.keyboard.on('keydown_S', this._moveDown);

// this.input.keyboard.on('keyup_A', this._stopMove(true));
// this.input.keyboard.on('keyup_D', this._stopMove(true));
// this.input.keyboard.on('keyup_W', this._stopMove(false));
// this.input.keyboard.on('keyup_S', this._stopMove(false));
// -------------------------- 事件
// _moveUp = () => {
//   this.fighter.setVelocityY(-160);
// };
// _moveDown = () => {
//   this.fighter.setVelocityY(160);
// };

// _moveLeft = () => {
//   this.fighter.setVelocityX(-160);
// };

// _moveRight = () => {
//   this.fighter.setVelocityX(160);
// };

// _stopMove = (isHorizontal: boolean) => () => {
//   if (isHorizontal) {
//     if (this.moveKeys['left'].isUp && this.moveKeys['right'].isUp) {
//       this.fighter.setVelocityX(0);
//     }
//   } else if (this.moveKeys['up'].isUp && this.moveKeys['down'].isUp) {
//     this.fighter.setVelocityY(0);
//   }
// };
