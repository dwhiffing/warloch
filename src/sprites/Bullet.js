export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles', 'shot.png')
    this.initialX = x
    this.initialY = y
    this.scene.physics.world.enableBody(this, 0)
  }

  fire(target, stats) {
    const { x: px, y: py } = this.scene.player
    let width = stats.width || stats.size || 1
    let height = stats.height || stats.size || 1
    let bodyWidth = stats.bodyWidth || stats.bodySize || 1
    let bodyHeight = stats.bodyHeight || stats.bodySize || 1
    this.health = stats.health || 1
    this.offset = stats.offset || 16
    this.lifetimeTimer = stats.lifetime || 9999
    this.damage = stats.damage || 1
    this.range = stats.range || 200
    this.speed = stats.speed || 300
    this.hitEnemies = []
    this.stats = stats
    this.target = target

    this.setPosition(
      px + this.offset * Math.cos(target),
      py + this.offset * Math.sin(target),
    )
    this.initialX = this.x
    this.initialY = this.y

    this.setActive(true)
      .setVisible(true)
      .setAlpha(1)
      .setScale(width, height)
      .setBodySize(bodyWidth, bodyHeight)
      .setFrame(stats.frame)

    if (target.x) {
      this.setPosition(target.x, target.y)
    } else {
      this.setVelocity(
        this.speed * Math.cos(target),
        this.speed * Math.sin(target),
      )
    }
  }

  die(shouldFade) {
    if (this.dying) return
    this.dying = true

    this.scene.tweens.add({
      targets: [this],
      duration: shouldFade ? 130 : 20,
      alpha: 0,
      onComplete: () => {
        this.dying = false
        this.setActive(false).setVisible(false)
      },
    })
  }

  hit(enemy) {
    if (!this.active || this.hitEnemies.includes(enemy)) return

    this.health -= 1
    this.hitEnemies.push(enemy)
    if (this.health <= 0) this.die()
  }

  update() {
    const { target, count, lifetime } = this.stats || {}
    if (target === 'orbit') {
      const c = this.gun.circle
      const { x, y } = c.getPoint((c.tween + this.index * (1 / count)) % 1)
      this.setPosition(x, y)
    }

    if (lifetime) {
      if (target !== 'orbit') this.setAlpha(this.lifetimeTimer / lifetime)
      if (this.lifetimeTimer-- <= 0) this.die(true)
    }

    if (this.stats.accel) {
      this.speed += this.stats.accel
      this.setVelocity(
        this.speed * Math.cos(this.target),
        this.speed * Math.sin(this.target),
      )
    }

    const dist = Phaser.Math.Distance.Between(
      this.initialX,
      this.initialY,
      this.x,
      this.y,
    )
    if (dist >= this.range) this.die(true)
  }
}
