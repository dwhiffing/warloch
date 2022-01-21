export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'shot')
    this.scene.physics.world.enableBody(this, 0)
    this.speed = Phaser.Math.GetSpeed(400, 1)
    this.damage = 1
  }

  fire(x, y) {
    this.x = this.scene.player.x
    this.y = this.scene.player.y
    this.scene.physics.moveTo(this, x, y, 300)
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
    if (dist > 200) this.die()
  }
}
