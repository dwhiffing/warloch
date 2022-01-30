export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles', 'shot.png')
    this.initialX = x
    this.initialY = y
    this.scene.physics.world.enableBody(this, 0)
    this.hitEnemies = []
  }

  fire(target, stats) {
    let { x: px, y: py } = this.gun.source
    py += 5
    let width = stats.width || stats.size
    let height = stats.height || stats.size
    let bodyWidth = stats.bodyWidth || stats.bodySize
    let bodyHeight = stats.bodyHeight || stats.bodySize
    this.health = stats.pierce
    this.offset = stats.offset
    this.lifetimeTimer = stats.lifetime
    this.damage = stats.damage
    this.range = stats.range
    this.speed = stats.speed
    this.hitEnemies = []
    this.stats = stats
    this.target = target
    this.setDepth(stats.depth)

    if (this.stats.gravity) this.setGravityY(this.stats.gravity)

    this.setPosition(
      px + this.offset * Math.cos(target),
      py + this.offset * Math.sin(target),
    )
    this.initialX = this.x
    this.initialY = this.y

    this.setActive(true)
      .setVisible(true)
      .setAlpha(stats.alpha || 1)
      .setScale(width, height)
      .setBodySize(bodyWidth, bodyHeight)
      .setFrame(stats.frame)

    this.event?.remove()
    if (stats.name === 'enemy') {
      this.event = this.scene.time.addEvent({
        repeat: -1,
        delay: 100,
        callback: () => {
          if (!this.tintFill) {
            this.setTintFill(0xff0000)
          } else {
            this.clearTint()
          }
        },
      })
    }

    if (this.stats.play) this.play(this.stats.play)

    if (target.x) {
      this.setPosition(target.x, target.y)
    } else {
      this.moveTowardTarget()
    }

    if (this.stats.speedY) this.setVelocityY(this.stats.speedY)
  }

  die(shouldFade) {
    if (this.dying) return
    this.dying = true

    if (this.gun.explodeGun) {
      this.gun.explodeGun.source = { x: this.x, y: this.y }
      this.gun.explodeGun.shoot()
    }

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

    this.hitEnemies.push(enemy)

    this.health -= 1
    if (this.health <= 0) this.die()

    if (this.stats.reacquire) {
      if (this.stats.target === 'nearestEnemy') {
        const newTarget = this.scene.enemySpawner
          .getClosest({ x: this.x, y: this.y })
          .filter((e) => !this.hitEnemies.includes(e))[0]
        if (!newTarget) return this.die()
        this.target = Phaser.Math.Angle.BetweenPoints(this, newTarget)
      } else {
        this.target = Phaser.Math.RND.angle()
      }
      this.moveTowardTarget()
    }
  }

  moveTowardTarget() {
    this.setVelocity(
      this.speed * Math.cos(this.target),
      this.speed * Math.sin(this.target),
    )
  }

  update() {
    const { target, count, lifetime, accel } = this.stats || {}
    if (target === 'orbit') {
      const c = this.gun.circle
      const { x, y } = c.getPoint((c.tween + this.index * (1 / count)) % 1)
      this.setPosition(x, y)
    }

    if (lifetime) {
      if (target !== 'orbit') this.setAlpha(this.lifetimeTimer / lifetime)
      if (this.lifetimeTimer-- <= 0) this.die(target !== 'orbit')
    }

    if (accel) {
      this.speed += accel
      this.moveTowardTarget()
    }

    const dist = Phaser.Math.Distance.Between(
      this.initialX,
      this.initialY,
      this.x,
      this.y,
    )
    if (dist >= this.range) this.die(!this.gun.stats.explode)
  }
}
