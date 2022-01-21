import Phaser from 'phaser'
import GameScene from './scenes/Game'
import BootScene from './scenes/Boot'

new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#c0c0c0',
  parent: 'phaser',
  // scale: { mode: Phaser.Scale.RESIZE },
  zoom: 2,
  scene: [BootScene, GameScene],
  pixelArt: true,
  roundPixels: true,
})
