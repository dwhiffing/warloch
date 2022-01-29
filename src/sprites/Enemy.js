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
    this.hpBar.move(this.x, this.y + 4 - this.body.height)

    const gun = this.scene.enemySpawner.gun
    const player = this.scene.player
    const { Distance, Angle } = Phaser.Math
    const dist = Distance.BetweenPoints(this, player)
    this.setPushable(dist > 25 || this.scene.player.form === 'dark')

    if (this.updateTimer-- > 0) return
    this.resetUpdateTimer()

    const angle = Angle.BetweenPoints(this, player)
    this.setFlipX(Angle.Wrap(angle + Math.PI / 2) < 0)

    if (this.ai === 'flying') {
      this.target = {}
      this.target.x = player.x + Phaser.Math.RND.between(-200, 200)
      this.target.y = player.y + Phaser.Math.RND.between(-200, 200)
      gun.source = this
      gun.shoot(player.x, player.y)
    } else if (dist < 19 && this.hitTimer <= 0) {
      this.hitTimer = this.hitTimerMax
      player.hit(this.damage)
    }

    if (this.ai === 'jump') {
      this.setVelocity(0)
      const random = Phaser.Math.Angle.Random() / 10
      const v = this.scene.physics.velocityFromRotation(angle + random, 20)
      this.setDrag(this.speed * 1.5)
      this.scene.physics.moveTo(
        this,
        this.x + v.x,
        this.y + v.y,
        this.speed * 1.5 * this.movePenalty,
      )
    } else {
      this.setDrag(0)
      const { x, y } = this.target
      this.scene.physics.moveTo(this, x, y, this.speed * this.movePenalty)
    }
  }

  resetUpdateTimer = () => {
    this.updateTimer = Phaser.Math.RND.between(30, 60)
    if (this.ai === 'flying') {
      this.updateTimer = Phaser.Math.RND.between(200, 300)
    } else if (this.ai === 'jump') {
      this.updateTimer = Phaser.Math.RND.between(50, 70)
    }
  }

  spawn(x, y, stats) {
    const { bodySize, bodyOffset, hp, speed, xp, damage, type, ai } = stats

    this.setActive(true).setVisible(true).setPosition(x, y)
    this.setBodySize(...bodySize).setOffset(...bodyOffset)
    this.play(type).setOrigin(0.5, 1).setDepth(2)
    this.body.enable = true

    this.speed = speed
    this.damage = damage
    this.hp = hp
    this.hitTimer = 0
    this.hitTimerMax = 40
    this.xp = xp
    this.particleScale = stats.particleScale
    this.type = type
    this.ai = ai
    this.movePenalty = 1
    this.particleTint = stats.particleTint
    this.target = this.scene.player
    this.setMass(stats.mass)
    this.hpBar.set(this.hp, this.hp)
    this.hpBar.move(this.x, this.y)

    if (ai === 'flying') {
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

    this.updateTimer = 10
    this.setVelocity(0)
    this.tween?.remove()
    const angle = typeof bullet.target === 'number' ? bullet.target : 0
    this.setPosition(
      this.x + (bullet.damage / 10) * Math.cos(angle),
      this.y + (bullet.damage / 10) * Math.sin(angle),
    )

    this.scene.sound.play(`Metal-medium-${Phaser.Math.RND.between(0, 4)}`, {
      volume: 0.05,
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
    this.tween?.remove()
    this.scene.registry.inc('killCount')
    this.scene.registry.values.score += Math.floor(this.xp)
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
    this.scene.enemySpawner.emitter.setTint(this.particleTint || 0x00aaff)
    this.scene.enemySpawner.emitter.setScale(this.particleScale)
    this.scene.enemySpawner.emitter.explode(
      Phaser.Math.RND.between(3, 6),
      this.x,
      this.y - 10,
    )

    this.scene.sound.play(`death-${Phaser.Math.RND.between(0, 3)}`, {
      volume: 0.1,
      rate: 0.8,
    })
  }
}
