export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles', 'shot.png')
    this.scene.physics.world.enableBody(this, 0)
    this.speed = Phaser.Math.GetSpeed(400, 1)
    this.damage = 1
  }

  fire(angle, speed = 300, damage = 1, size = 1, range = 200) {
    this.x = this.scene.player.x
    this.y = this.scene.player.y
    this.damage = damage
    this.range = range
    this.setScale(size)
    this.setVelocityX(speed * Math.cos(angle))
    this.setVelocityY(speed * Math.sin(angle))
    this.setActive(true)
    this.setVisible(true)
  }

  hit(target) {
    this.die()
  }

  die() {
    this.setActive(false)
    this.setVisible(false)
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
