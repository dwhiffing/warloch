import Phaser from 'phaser'
import GameScene from './scenes/Game'
import UpgradeScene from './scenes/Upgrade'
import MenuScene from './scenes/Menu'
import BootScene from './scenes/Boot'

new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#0377C2',
  parent: 'phaser',
  width: 500,
  height: 270,
  scale: { mode: Phaser.Scale.FIT, autoCenter: true },
  physics: { default: 'arcade', arcade: { debug: true } },
  zoom: 2,
  scene: [BootScene, MenuScene, GameScene, UpgradeScene],
  pixelArt: true,
})
