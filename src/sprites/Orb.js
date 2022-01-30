export class Orb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles', 'xp2.png')

    this.scene.physics.world.enableBody(this, 0)

    this.setScale(1).setDepth(0)
    this.resize()
  }

  spawn(x, y, value = 1) {
    this.collected = false
    this.sucking = false
    this.setVelocity(0)
    this.setPosition(x, y)

    this.setTint(0xea3333).setFrame('xp2.png')
    if (value < 100) this.setTint(0x82fefb).setFrame('xp2.png')
    if (value < 50) this.setTint(0xfd4b54).setFrame('xp1.png')
    if (value < 25) this.setTint(0xffc218).setFrame('xp1.png')
    if (value <= 10) this.setTint(0x00bbff).setFrame('xp1.png')

    this.setActive(true).setVisible(true)
    this.value = value
  }

  hit() {
    if (this.collected) return
    this.collected = true
    const angle = Phaser.Math.Angle.BetweenPoints(this, this.scene.player)
    const v = this.scene.physics.velocityFromAngle(angle, 20)
    this.scene.physics.moveTo(this, v.x, v.y, 80)
    this.scene.time.delayedCall(200, this.suck)
  }

  resize() {
    this.setSize(this.scene.player.pickupRange, this.scene.player.pickupRange)
  }

  update() {
    if (this.sucking) {
      const dist = Phaser.Math.Distance.BetweenPoints(this, this.scene.player)
      if (dist < 3) this.die()
      this.scene.physics.moveTo(
        this,
        this.scene.player.x,
        this.scene.player.y,
        80,
      )
    }
  }

  suck = () => {
    this.sucking = true
    this.scene.time.delayedCall(600, this.die)
  }

  die = () => {
    if (!this.active) return
    this.scene.player.xp += this.value * this.scene.player.xpRate
    this.x = -99999
    this.y = -99999
    this.setActive(false).setVisible(false)
  }
}
