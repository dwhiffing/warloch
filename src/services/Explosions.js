export class Explosions extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene)
    this.createMultiple({
      frameQuantity: 1,
      key: 'tiles',
      active: false,
      visible: false,
      classType: Explosion,
      setXY: { x: -100, y: -100 },
    })
  }
  makeExplosion(x, y, scale) {
    let explosion = this.getFirstDead()
    if (explosion) explosion.spawn(x, y, scale)
  }
}

export class Explosion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key)
  }
  spawn(x, y, scale) {
    this.body.reset(x, y)
    if (scale) this.setScale(scale)
    this.setActive(true).setVisible(true)
    this.angle = Phaser.Math.RND.between(0, 360)
    this.anims.play('explosion')
    this.once('animationcomplete', () => {
      this.setVisible(false).setActive(false)
    })
  }
}
