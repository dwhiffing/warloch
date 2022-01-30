export class Button extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, label, callback) {
    super(scene, x, y, 'tiles', 'bar_mid.png')
    this.scene = scene

    const width = 100
    const height = 27

    this.setDisplaySize(width, height)
      .setInteractive()
      .on('pointerdown', callback)
      .setTint(0x22449f)
      .setOrigin(0.5)

    this.left = this.scene.add
      .sprite(x - width / 2, y, 'tiles', 'bar_left.png')
      .setInteractive()
      .on('pointerdown', callback)
      .setTint(0x22449f)
      .setOrigin(1, 0.5)
      .setDisplaySize(6, height)

    this.right = this.scene.add
      .sprite(x + width / 2, y, 'tiles', 'bar_right.png')
      .setInteractive()
      .on('pointerdown', callback)
      .setTint(0x22449f)
      .setOrigin(0, 0.5)
      .setDisplaySize(6, height)

    this.text = this.scene.add
      .bitmapText(x, y, 'gem', label)
      .setScale(0.5)
      .setOrigin(0.5)
      .setDepth(10)
  }

  setText = (val) => {
    this.text.setText(val)
  }

  setAlpha = (val) => {
    super.setAlpha(val)
    this.left.setAlpha(val)
    this.right.setAlpha(val)
  }
}
