export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles', 'shot.png')
    this.scene.physics.world.enableBody(this, 0)
  }

  fire(angle, speed = 300, damage = 1, size = 1, range = 200) {
    this.setPosition(
      this.scene.player.x + 20 * Math.cos(angle),
      this.scene.player.y + 20 * Math.sin(angle),
    )
    this.setScale(size)
    this.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle))
    this.setActive(true).setVisible(true)
    this.damage = damage
    this.range = range
  }

  die() {
    this.setActive(false).setVisible(false)
  }

  hit() {
    this.die()
  }

  update() {
    const dist = Phaser.Math.Distance.Between(
      this.scene.player.x,
      this.scene.player.y,
      this.x,
      this.y,
    )
    if (dist > this.range) this.die()
  }
}
