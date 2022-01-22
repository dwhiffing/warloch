import { Bullet } from '../sprites/Bullet'

const GUNS = {
  light: {
    damage: 1,
    delay: 30,
    speed: 150,
    count: 1,
    range: 200,
    size: 1,
    spread: 0,
  },
  dark: {
    damage: 4,
    delay: 110,
    speed: 1,
    count: 4,
    range: 80,
    size: 3,
    spread: 8,
  },
}

export class Gun {
  constructor(scene, type = 'light') {
    this.scene = scene

    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      maxSize: 20,
      runChildUpdate: true,
    })
    const stats = GUNS[type]
    this.baseDamage = stats.damage
    this.baseDelay = stats.delay
    this.baseSpeed = stats.speed
    this.baseCount = stats.count
    this.baseRange = stats.range
    this.baseSize = stats.size
    this.baseSpread = stats.spread
    this.type = type

    this.bullets.createMultiple({ quantity: 20, active: false })
  }

  shoot(x, y) {
    if (this.shotTimer > 0) return

    this.shotTimer = this.delay
    const { width, height } = this.scene.cameras.main
    for (let i = 0; i < this.bulletCount; i++) {
      let bullet = this.bullets.get()
      if (!bullet) continue
      let angle = Phaser.Math.Angle.Between(width / 2, height / 2, x, y)
      let thing = i / (10 - this.spread)
      angle += thing / 2 - thing
      bullet.fire(angle, this.speed, this.damage, this.size, this.range)
    }
  }

  update() {
    if (this.shotTimer > 0) this.shotTimer--

    return
  }

  get delay() {
    return this.baseDelay - (this.scene.registry.get('bulletDelay') - 1) * 4
  }

  get speed() {
    return this.baseSpeed + 50 * this.scene.registry.get('bulletSpeed')
  }

  get spread() {
    return this.baseSpread
  }

  get size() {
    return this.baseSize
  }

  get damage() {
    return this.baseDamage * this.scene.registry.get('bulletDamage')
  }

  get range() {
    return this.baseRange
  }

  get bulletCount() {
    return this.baseCount * this.scene.registry.get('bulletCount')
  }
}
