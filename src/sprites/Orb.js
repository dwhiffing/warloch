export class Orb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles', 'xp2.png')

    this.scene.physics.world.enableBody(this, 0)

    this.setScale(1).setDepth(1)
    this.resize()

    var pipeline = this.scene.postFxPlugin.add(this)

    this.glowTask = this.scene.tweens.add({
      targets: pipeline,
      intensity: 0.04,
      ease: 'Quad.easeInOut',
      duration: 500,
      repeat: -1,
      yoyo: true,
    })
  }

  spawn(x, y, value = 1) {
    this.x = x
    this.y = y
    this.setTint(0xea3333).setFrame('xp2.png')
    if (value < 100) this.setTint(0x82fefb).setFrame('xp2.png')
    if (value < 50) this.setTint(0xfd4b54).setFrame('xp1.png')
    if (value < 25) this.setTint(0xffc218).setFrame('xp1.png')
    if (value <= 10) this.setTint(0x00bbff).setFrame('xp1.png')

    this.setActive(true).setVisible(true)
    this.value = value
  }

  hit() {
    this.x = -99999
    this.y = -99999
    this.die()
  }

  resize() {
    this.setSize(this.scene.player.pickupRange, this.scene.player.pickupRange)
  }

  die() {
    this.setActive(false).setVisible(false)
  }
}
