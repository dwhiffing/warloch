import { Bullet } from './Bullet'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.shotTimer = 0
    this.scene.physics.world.enableBody(this, 0)
    this.play('player')
      .setCollideWorldBounds(true)
      .setBodySize(8, 8)
      .setOrigin(0.5)
      .setOffset(12, 22)

    const { W, A, S, D } = Phaser.Input.Keyboard.KeyCodes
    this.input = scene.input
    this.upKey = this.input.keyboard.addKey(W)
    this.leftKey = this.input.keyboard.addKey(A)
    this.downKey = this.input.keyboard.addKey(S)
    this.rightKey = this.input.keyboard.addKey(D)
    this.input.on('pointerdown', () => (this.isMouseDown = true))
    this.input.on('pointerup', () => (this.isMouseDown = false))

    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      maxSize: 20,
      runChildUpdate: true,
    })

    this.bullets.createMultiple({ quantity: 20, active: false })
  }

  shoot = (pointer) => {
    let bullet = this.bullets.get()
    if (!bullet) return
    const { scrollX, scrollY } = this.scene.cameras.main
    bullet.fire(scrollX + pointer.x, scrollY + pointer.y)
  }

  update() {
    this.setVelocity(0)

    if (this.shotTimer > 0) this.shotTimer--
    if (this.isMouseDown && this.shotTimer === 0) {
      this.shoot(this.input.activePointer)
      this.shotTimer = 10
    }

    if (this.upKey.isDown) {
      this.setVelocityY(-150)
    } else if (this.downKey.isDown) {
      this.setVelocityY(150)
    }

    if (this.leftKey.isDown) {
      this.setVelocityX(-150)
    } else if (this.rightKey.isDown) {
      this.setVelocityX(150)
    }
  }
}
