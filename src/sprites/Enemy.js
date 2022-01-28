import { Bar } from '../services/Bar'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.scene.physics.world.enableBody(this, 0)

    this.hpBar = new Bar(scene, this.x, this.y, 15, 2, 0xff0000)
    this.hpBar.hideWhenFull = true
  }

  update() {
    if (!this.active) return

    if (this.hitTimer > 0) this.hitTimer--
    this.hpBar.move(this.x, this.y + 16 - this.body.height)

    const { Distance, Angle, RND } = Phaser.Math
    const dist = Distance.BetweenPoints(this, this.target)
    this.setPushable(dist > 20)

    if (this.updateTimer-- > 0) return

    const offset = Math.PI / 2
    const angle = Angle.Wrap(Angle.BetweenPoints(this, this.target) + offset)
    this.setFlipX(angle < 0)
    this.updateTimer = RND.between(30, 60)

    if (dist < 19 && this.hitTimer <= 0) {
      this.hitTimer = this.hitTimerMax
      this.target.hit(this.damage)
    }

    const { x, y } = this.target
    this.scene.physics.moveTo(this, x, y, this.speed * this.movePenalty)
  }

  spawn(x, y, stats) {
    const { bodySize, bodyOffset, hp, speed, xp, damage, type } = stats

    this.setActive(true).setVisible(true).setPosition(x, y)
    this.setBodySize(...bodySize).setOffset(...bodyOffset)
    this.play(type).setOrigin(0.5).setDepth(2)
    this.body.enable = true

    this.speed = speed
    this.damage = damage
    this.hp = hp
    this.hitTimer = 0
    this.hitTimerMax = 40
    this.xp = xp
    this.movePenalty = 1
    this._tint = stats.tint
    this.target = this.scene.player
    this.setMass(stats.mass)
    this.hpBar.set(this.hp, this.hp)
    this.hpBar.move(this.x, this.y)

    if (type === 'skull') {
      this.anims.currentAnim.msPerFrame = Phaser.Math.RND.between(300, 1200)
    }
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

    if (bullet.stats.poison) {
      this.setTint(0x00ff00)
      this.movePenalty = 0.5
      this.scene.time.delayedCall(bullet.stats.poison, () => {
        this.clearTint()
        this.movePenalty = 1
      })
    } else {
      this.flash()
    }

    if (this.hp <= 0) this.die()
  }

  die() {
    this.scene.registry.inc('killCount')
    this.scene.registry.values.score += this.xp
    this.setVisible(false).setActive(false)
    this.body.enable = false
    this.hpBar.die()
    this.scene.orbSpawner.spawn(this.x, this.y, this.xp)
    this.scene.enemySpawner.explosions.makeExplosion(
      this.x,
      this.y,
      Phaser.Math.RND.between(6, 12) / 10,
    )
    if (this.scene.player.form === 'light') this.scene.player.tp += 2.5
    this.scene.enemySpawner.emitter.setTint(this._tint || 0x00aaff)
    this.scene.enemySpawner.emitter.explode(
      Phaser.Math.RND.between(3, 6),
      this.x,
      this.y,
    )

    this.scene.sound.play(`death-${Phaser.Math.RND.between(0, 3)}`, {
      volume: 0.1,
      rate: 0.8,
    })
  }
}
