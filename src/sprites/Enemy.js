import { SPRITES } from '../constants'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.scene.physics.world.enableBody(this, 0)
    this.setOrigin(0.5)
  }

  hit(bullet) {
    this.health -= bullet.damage
    this.setTintFill(0xffffff)

    this.scene.time.delayedCall(100, this.clearTint.bind(this))
    if (this.health <= 0) {
      this.die()
    }
  }

  spawn(x, y, type = 'knight') {
    this.setActive(true)
    this.setVisible(true)
    this.x = x
    this.y = y
    const { bodySize, bodyOffset, health, speed } = SPRITES[type]
    this.speed = speed
    this.health = health
    this.play(type)
      .setBodySize(...bodySize)
      .setOffset(...bodyOffset)
  }

  die() {
    this.setVisible(false)
    this.setActive(false)
  }

  update() {
    if (!this.active || this.updateTimer-- > 0) return

    this.updateTimer = 20

    this.scene.physics.moveTo(
      this,
      this.scene.player.x,
      this.scene.player.y,
      this.speed,
    )
  }
}
