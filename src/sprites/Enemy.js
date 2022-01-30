import { Bar } from '../services/Bar'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.scene.physics.world.enableBody(this, 0)

    this.hpBar = new Bar(scene, this.x, this.y, 25, 4, 0xff0000)
    this.hpBar.hideWhenFull = true
  }

  update() {
    if (!this.active) return

    if (this.hitTimer > 0) this.hitTimer--
    this.hpBar.move(this.x + 3, this.y + 4 - this.body.height)

    const gun = this.scene.enemySpawner.gun
    const player = this.scene.player
    const { Distance, Angle } = Phaser.Math
    const dist = Distance.BetweenPoints(this, player)
    this.setPushable(
      this._mass < 30 && (dist > 35 || this.scene.player.form === 'dark'),
    )

    if (this.updateTimer-- > 0) return
    this.resetUpdateTimer()

    const angle = Angle.BetweenPoints(this, player)
    this.setFlipX(Angle.Wrap(angle + Math.PI / 2) < 0)

    if (this.ai === 'flying') {
      this.target = {}
      this.target.x = player.x + Phaser.Math.RND.between(-200, 200)
      this.target.y = player.y + Phaser.Math.RND.between(-200, 200)
      gun.source = this
      let roll = Phaser.Math.RND.between(1, 20)
      let target = this.type === 'skull_big' ? 8 : 14
      if (roll >= target) gun.shoot(player.x, player.y)
    } else if (dist < this.range && this.hitTimer <= 0) {
      this.hitTimer = this.hitTimerMax
      this.flash(0xff0000, 100, false)
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
    const anim = stats.variants
      ? Phaser.Math.RND.weightedPick(stats.variants)
      : type
    this.play(anim).setOrigin(0.5, 1).setDepth(stats.depth)
    this.body.enable = true

    this.speed = speed
    this.damage = damage
    this.hp = hp
    this.maxHp = hp
    this.hitTimer = 0
    this.hitTimerMax = 40
    this.soundKey = stats.soundKey
    this.soundRate = stats.soundRate
    this.xp = xp
    this.range = stats.range
    this.level = stats.level
    this.particleScale = stats.particleScale
    this.type = type
    this.setScale(stats.scale)
    this.ai = ai
    this.movePenalty = 1
    this._mass = stats.mass
    this.particleTint = stats.particleTint
    this.target = this.scene.player
    this.setMass(10)
    this.hpBar.set(this.hp, this.hp)
    this.hpBar.move(this.x, this.y)

    if (ai === 'flying') {
      this.anims.currentAnim.msPerFrame = Phaser.Math.RND.between(300, 1200)
    }
  }

  flash(tint = 0xffffff, duration = 150, fill = true) {
    if (fill) this.setTintFill(tint)
    else this.setTint(tint)
    this.scene.time.delayedCall(duration, this.clearTint.bind(this))
  }

  hit(bullet) {
    if (bullet.hitEnemies.includes(this)) return

    this.hp -= bullet.damage
    this.hpBar.set(this.hp)

    const angle = typeof bullet.target === 'number' ? bullet.target : 0
    const knockback = Math.min((bullet.damage * 8) / this._mass, 10)
    this.setPosition(
      this.x + knockback * Math.cos(angle),
      this.y + knockback * Math.sin(angle),
    )

    this.scene.sound.play(`hit-metal-${Phaser.Math.RND.between(0, 4)}`, {
      volume: 0.025,
      rate: 0.7 + Phaser.Math.RND.between(1, 4) / 10,
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

    if (this.type === 'slime_big') {
      this.scene.enemySpawner.spawnGroup(
        this.x,
        this.y,
        'slime_small',
        Phaser.Math.RND.between(3, 6),
        3,
      )
    } else if (this.type === 'slime_jumbo') {
      this.scene.enemySpawner.spawnGroup(
        this.x,
        this.y,
        'slime_big',
        Phaser.Math.RND.between(3, 6),
        5,
      )
    }

    if (this.scene.player.form === 'light') this.scene.player.tp += this.level

    this.scene.enemySpawner.emitter.setTint(this.particleTint || 0x00aaff)
    this.scene.enemySpawner.emitter.setScale(this.particleScale)
    this.scene.enemySpawner.emitter.explode(
      Phaser.Math.RND.between(3, 6),
      this.x,
      this.y - 10,
    )

    this.scene.sound.play(`death-${this.soundKey}`, {
      volume: 0.1,
      rate: this.soundRate,
    })
  }
}
