import Phaser from 'phaser';
import StartScene from './scenes/StartScene';
import PlayScene from './scenes/PlayScene';
import DefeatScene from './scenes/DefeatScene';
import VictoryScene from './scenes/VictoryScene';

// Phaser.Scale.CENTER_HORIZONTALLY
const app = new Phaser.Game({
  type: Phaser.AUTO,
  autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  backgroundColor: '#000',
  width: 750,
  height: 1206,
  scene: [StartScene, PlayScene, DefeatScene, VictoryScene],

  // 配置物理引擎
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
});

export default app;
