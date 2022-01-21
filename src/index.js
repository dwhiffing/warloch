import Phaser from 'phaser'
import GameScene from './scenes/Game'
import BootScene from './scenes/Boot'

new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#c0c0c0',
  parent: 'phaser',
  width: 500,
  height: 350,
  // scale: { mode: Phaser.Scale.RESIZE },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  zoom: 2,
  scene: [BootScene, GameScene],
  pixelArt: true,
  roundPixels: true,
})
