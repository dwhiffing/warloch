export class Button extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, label, callback) {
    super(scene, x, y, 'tiles', 'bar.png')
    this.scene = scene

    this.setScale(5).setInteractive().on('pointerdown', callback)

    this.scene.add
      .text(x, y, label, { color: 'black', fontFamily: 'sans-serif' })
      .setOrigin(0.5)
      .setDepth(10)
  }
}
