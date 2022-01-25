import { Bar } from '../services/Bar'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.scene.physics.world.enableBody(this, 0)

    this.hpBar = new Bar(scene, this.x, this.y, 15, 2, 0xff0000)
    this.setMass(100)
  }

  update() {
    if (!this.active) return

    if (this.hitTimer > 0) this.hitTimer--
    this.hpBar.move(this.x, this.y - this.body.height / 2)

    if (this.updateTimer-- > 0) return

    this.updateTimer = 20
    const { x, y } = this.scene.player
    const dist = Phaser.Math.Distance.BetweenPoints(this, this.scene.player)
    const angle = Phaser.Math.Angle.Wrap(
      Phaser.Math.Angle.BetweenPoints(this, this.scene.player) + Math.PI / 2,
    )
    this.setFlipX(angle < 0)
    if (dist > 20) {
      this.scene.physics.moveTo(this, x, y, this.speed)
    } else {
      this.setVelocity(0)
    }
  }

  spawn(x, y, stats) {
    const { bodySize, bodyOffset, hp, speed, xp, damage, type } = stats

    this.setActive(true).setVisible(true).setPosition(x, y)
    this.setBodySize(...bodySize).setOffset(...bodyOffset)
    this.play(type).setOrigin(0.5)
    this.body.enable = true

    this.speed = speed
    this.damage = damage
    this.hp = hp
    this.hitTimer = 0
    this.hitTimerMax = 80
    this.xp = xp
    this.hpBar.set(this.hp, this.hp)
    this.hpBar.move(this.x, this.y)
  }

  flash(tint = 0xffffff, duration = 150) {
    this.setTintFill(tint)
    this.scene.time.delayedCall(duration, this.clearTint.bind(this))
  }

  hit(bullet) {
    if (bullet.hitEnemies.includes(this)) return

    this.hp -= bullet.damage
    this.hpBar.set(this.hp)

    this.scene.sound.play(`Metal-medium-${Phaser.Math.RND.between(0, 4)}`, {
      volume: 0.1,
      rate: 0.8 + Phaser.Math.RND.between(1, 3) / 10,
    })
    this.flash()

    if (this.hp <= 0) this.die()
  }

  die() {
    this.scene.registry.inc('killCount')
    this.scene.registry.values.score += this.xp
    this.setVisible(false).setActive(false)
    this.body.enable = false
    this.hpBar.die()
    this.scene.orbSpawner.spawn(this.x, this.y, this.xp)

    this.scene.sound.play(`death-${Phaser.Math.RND.between(0, 3)}`, {
      volume: 0.1,
      rate: 0.8,
    })
  }
}
