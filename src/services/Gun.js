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
      maxSize: 50,
      runChildUpdate: true,
    })
    this.bullets.createMultiple({ quantity: 20, active: false })
  }

  shoot(x = this.target.x, y = this.target.y) {
    if (this.shotTimer > 0) return

    this.shotTimer = this.delay
    const { width, height } = this.scene.cameras.main

    this.scene.sound.play('shoot', {
      rate: this.stats.rate + Phaser.Math.RND.between(0, 10) / 80,
      volume: 0.1,
    })

    const c = this.bulletCount

    for (let i = 0; i < c; i++) {
      let bullet = this.bullets.get()
      if (!bullet) continue

      const angle =
        Phaser.Math.Angle.Between(width / 2, height / 2, x, y) +
        (c / 2 - (c - i) + 0.5) * (this.spread / c)

      bullet.fire(angle, this.speed, this.damage, this.size, this.range)
    }
  }

  update() {
    if (this.shotTimer > 0) this.shotTimer--
  }

  get delay() {
    return this.stats.delay
  }

  get speed() {
    return this.stats.speed + 50
  }

  get spread() {
    return this.stats.spread
  }

  get size() {
    return this.stats.size
  }

  get damage() {
    return this.stats.damage
  }

  get range() {
    return this.stats.range
  }

  get bulletCount() {
    return this.stats.count
  }
}
