import { SPRITES } from '../constants'
import { Bullet } from './Bullet'

// TODO: player level up
// TODO: player level up triggers upgrade menu
// TODO: upgrade menu
// TODO: more weapon types/stats/upgrades

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.shotTimer = 0
    this.scene.physics.world.enableBody(this, 0)
    this.health = 100
    this.level = 1
    this.xp = 0
    const { bodySize, bodyOffset, speed, health } = SPRITES.player
    this.play('player')
      .setCollideWorldBounds(true)
      .setOrigin(0.5)
      .setBodySize(...bodySize)
      .setOffset(...bodyOffset)

    const { W, A, S, D } = Phaser.Input.Keyboard.KeyCodes
    this.input = scene.input
    this.upKey = this.input.keyboard.addKey(W)
    this.leftKey = this.input.keyboard.addKey(A)
    this.downKey = this.input.keyboard.addKey(S)
    this.rightKey = this.input.keyboard.addKey(D)
    this.speed = speed
    this.health = health
    this.shotTiming = 10

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

  hit(enemy) {
    if (enemy.hitTimer > 0) return

    enemy.hitTimer = 10
    this.health -= enemy.damage
    this.scene.hpBar.set(this.health)
    if (this.health <= 0) this.scene.scene.start('Game')
  }

  update() {
    this.setVelocity(0)

    if (this.shotTimer > 0) this.shotTimer--
    if (this.isMouseDown && this.shotTimer === 0) {
      this.shoot(this.input.activePointer)
      this.shotTimer = this.shotTiming
    }

    if (this.upKey.isDown) {
      this.setVelocityY(-this.speed)
    } else if (this.downKey.isDown) {
      this.setVelocityY(this.speed)
    }

    if (this.leftKey.isDown) {
      this.setVelocityX(-this.speed)
    } else if (this.rightKey.isDown) {
      this.setVelocityX(this.speed)
    }
  }
}
