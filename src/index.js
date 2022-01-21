import Phaser from 'phaser'
import GameScene from './scenes/Game'
import UpgradeScene from './scenes/Upgrade'
import MenuScene from './scenes/Menu'
import BootScene from './scenes/Boot'

new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#c0c0c0',
  parent: 'phaser',
  width: 500,
  height: 270,
  scale: { mode: Phaser.Scale.FIT, autoCenter: true },
  physics: { default: 'arcade', arcade: { debug: false } },
  zoom: 2,
  scene: [BootScene, MenuScene, GameScene, UpgradeScene],
  pixelArt: true,
})
