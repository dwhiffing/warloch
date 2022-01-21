import { SPRITES } from '../constants'
import { Bar } from '../services/Bar'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.scene.physics.world.enableBody(this, 0)
    this.setOrigin(0.5)
    this.healthBar = new Bar(scene, this.x, this.y, 15, 2, 0xff0000)
  }

  hit(bullet) {
    this.health -= bullet.damage
    this.healthBar.set(this.health)
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
    const { bodySize, bodyOffset, health, speed, xp, damage } = SPRITES[type]
    this.speed = speed
    this.damage = damage
    this.health = health
    this.hitTimer = 0
    this.xp = xp
    this.healthBar.set(this.health, this.health)
    this.healthBar.move(this.x, this.y)
    this.play(type)
      .setBodySize(...bodySize)
      .setOffset(...bodyOffset)
  }

  die() {
    this.setVisible(false)
    this.setActive(false)
    this.healthBar.die()
    this.scene.orbs.get()?.spawn(this.x, this.y, this.xp)
  }

  update() {
    if (!this.active) return

    this.healthBar.move(this.x, this.y)

    if (this.hitTimer > 0) this.hitTimer--
    if (this.updateTimer-- > 0) return

    this.updateTimer = 20

    this.scene.physics.moveTo(
      this,
      this.scene.player.x,
      this.scene.player.y,
      this.speed,
    )
  }
}
