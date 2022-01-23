import { GUNS } from '../constants'
import { Bullet } from '../sprites/Bullet'

export class Gun {
  constructor(scene, type = 'light') {
    this.scene = scene
    this.stats = GUNS[type]
    this.type = type
    this.target = this.scene.input.activePointer

    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      maxSize: 200,
      runChildUpdate: true,
    })
    this.bullets.createMultiple({ quantity: 200, active: false })

    this.circle = new Phaser.Geom.Circle(0, 0, 0)

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

  shoot(x = this.target.x, y = this.target.y) {
    this.player = this.scene.player

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

    this.circle.x = this.player.x
    this.circle.y = this.player.y
    this.circle.diameter = this.stats.range

    for (let i = 0; i < c; i++) {
      let bullet = this.bullets.get()
      if (!bullet) continue

      bullet.setFlipX(false)
      const s = this.stats.spread || 0
      const finalSpread = (c / 2 - (c - i) + 0.5) * (s / c)

      if (!target) {
        bullet.fire(
          getAngle(width / 2, height / 2, x, y) + finalSpread,
          this.stats,
        )
        continue
      }

      const { x: px, y: py } = this.player

      if (target === 'randomPosition') {
        const { x, y } = this.circle.getRandomPoint()
        bullet.fire({ x, y }, this.stats)
        continue
      }

      const enemies = this.scene.enemySpawner.enemies
        .getChildren()
        .filter((e) => e.active)
        .filter((e) => getDist(px, py, e.x, e.y) < this.stats.range)
        .sort((a, b) => getDist(px, py, a.x, a.y) - getDist(px, py, b.x, b.y))

      let baseAngle
      if (target === 'nearestEnemy') {
        if (!enemies[0]) return
        baseAngle = getAngle(px, py, enemies[0].x, enemies[0].y)
      } else if (target === 'randomEnemy') {
        let enemy = Phaser.Math.RND.pick(enemies)
        if (!enemy) return
        baseAngle = getAngle(px, py, enemy.x, enemy.y)
      } else if (target === 'melee') {
        bullet.setFlipX(this.player.flipX)
        baseAngle = Phaser.Math.Angle.Wrap(this.player.flipX ? Math.PI : 0)
      }

      bullet.fire(baseAngle + finalSpread, this.stats)
    }
  }

  update() {
    if (this.shotTimer > 0) this.shotTimer--
  }
}
