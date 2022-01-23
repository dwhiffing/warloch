export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles', 'shot.png')
    this.initialX = x
    this.initialY = y
    this.scene.physics.world.enableBody(this, 0)
  }

  fire(angle, speed = 300, damage = 1, size = 1, range = 200) {
    this.setPosition(
      this.scene.player.x + 20 * Math.cos(angle),
      this.scene.player.y + 20 * Math.sin(angle),
    )
    this.initialX = this.x
    this.initialY = this.y
    this.setScale(size)
    this.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle))
    this.setActive(true).setVisible(true).setAlpha(1)
    this.damage = damage
    this.range = range
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

  hit() {
    this.die()
  }

  update() {
    const dist = Phaser.Math.Distance.Between(
      this.initialX,
      this.initialY,
      this.x,
      this.y,
    )
    if (dist > this.range) this.die(true)
  }
}
