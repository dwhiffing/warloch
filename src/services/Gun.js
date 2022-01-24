import { GUNS } from '../constants'
import { Bullet } from '../sprites/Bullet'

export class Gun {
  constructor(scene, type = 'light') {
    this.source = scene.player
    this.scene = scene
    this.type = type
    this.target = this.scene.input.activePointer

    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      maxSize: 200,
      runChildUpdate: true,
    })
    this.bullets.createMultiple({ quantity: 200, active: false })

    this.circle = new Phaser.Geom.Circle(0, 0, 0)
    this.circle.tween = 0

    if (this.stats.explode) {
      this.explodeGun = new Gun(scene, this.stats.explode)
    }

    if (this.stats?.damageOverTime) {
      this.check = this.scene.time.addEvent({
        repeat: -1,
        delay: 1000,
        callback: () => {
          this.bullets
            .getChildren()
            .filter((b) => b.active)
            .forEach((b) => (b.hitEnemies = []))
        },
      })
    }
  }

  update() {
    if (this.shotTimer > 0) this.shotTimer--
    if (this.explodeGun) this.explodeGun.update()
    if (this.circle && this.source) {
      this.circle.setPosition(this.source.x, this.source.y + 5)
    }
  }

  shoot(x = this.target.x, y = this.target.y) {
    if (this.shotTimer > 0) return

    this.shotTimer = this.stats.delay
    const { width, height } = this.scene.cameras.main

    this.scene.sound.play(this.stats.soundKey || 'shoot', {
      rate: this.stats.soundRate + Phaser.Math.RND.between(0, 10) / 80,
      volume: 0.1,
    })

    const { target, count: c = 1 } = this.stats
    const getDist = Phaser.Math.Distance.Between
    const getAngle = Phaser.Math.Angle.Between

    this.circle.diameter = this.stats.range
    this.circleTween?.remove()
    this.circleTween = this.scene.tweens.add({
      targets: this.circle,
      tween: { from: this.circle.tween, to: this.circle.tween + 1 },
      duration: Math.max(10000 - this.stats.speed * 40, 1500),
    })

    for (let i = 0; i < c; i++) {
      let bullet = this.bullets.get()
      if (!bullet) continue

      bullet.gun = this
      bullet.index = i
      bullet.setFlipX(false)
      const s = this.stats.spread || 0

      const finalSpread = this.stats.randomAngle
        ? Phaser.Math.RND.realInRange(-this.stats.spread, this.stats.spread)
        : (c / 2 - (c - i) + 0.5) * (s / c)

      // handle guns that just shoot toward the cursor
      if (!target) {
        bullet.fire(
          getAngle(width / 2, height / 2, x, y) + finalSpread,
          this.stats,
        )
        continue
      }

      const { x: px, y: py } = this.source

      // handle guns that orbit around the player
      if (target === 'orbit') {
        const { x, y } = this.circle.getPoint(
          (this.circle.tween + i * (1 / c)) % 1,
        )
        bullet.fire({ x, y }, this.stats)
        continue
      }

      // handle guns that target a random/nearby place
      let baseAngle
      if (target === 'randomAngle') {
        bullet.fire(Phaser.Math.RND.angle(), this.stats)
        continue
      } else if (target === 'randomPosition') {
        const { x, y } = this.circle.getRandomPoint()
        bullet.fire({ x, y }, this.stats)
        continue
      } else if (target === 'melee') {
        bullet.setFlipX(this.source.flipX)
        baseAngle = Phaser.Math.Angle.Wrap(this.source.flipX ? Math.PI : 0)
      }

      // handle guns that target an in range enemy
      if (target === 'nearestEnemy' || target === 'randomEnemy') {
        const enemies = this.scene.enemySpawner.enemies
          .getChildren()
          .filter((e) => e.active)
          .filter((e) => getDist(px, py, e.x, e.y) < this.stats.range)
          .sort((a, b) => getDist(px, py, a.x, a.y) - getDist(px, py, b.x, b.y))

        if (target === 'nearestEnemy') {
          if (!enemies[0]) return
          baseAngle = getAngle(px, py, enemies[0].x, enemies[0].y)
        } else if (target === 'randomEnemy') {
          let enemy = Phaser.Math.RND.pick(enemies)
          if (!enemy) return
          baseAngle = getAngle(px, py, enemy.x, enemy.y)
        }
      }

      bullet.fire(baseAngle + finalSpread, this.stats)
    }
  }

  get stats() {
    const baseStats = {
      count: 1,
      health: 1,
      offset: 16,
      spread: 0,
      lifetime: 9999,
      damage: 1,
      range: 200,
      speed: 300,
      ...GUNS[this.type],
    }
    return {
      ...baseStats,
      // count: baseStats.count + 3,
    }
  }
}
