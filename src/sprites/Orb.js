export class Orb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles', 'xp2.png')

    this.scene.physics.world.enableBody(this, 0)

    this.setScale(1).setDepth(1)
    this.resize()
  }

  spawn(x, y, value = 1) {
    this.x = x
    this.y = y
    this.setTint(0xea3333).setFrame('xp2.png')
    if (value < 100) this.setTint(0x82fefb).setFrame('xp2.png')
    if (value < 50) this.setTint(0xf3d003).setFrame('xp1.png')
    if (value < 25) this.setTint(0x8b90cb).setFrame('xp1.png')
    if (value <= 10) this.setTint(0xdc8733).setFrame('xp1.png')

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
