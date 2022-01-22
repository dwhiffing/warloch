import { SPRITES } from '../constants'
import { Gun } from '../services/Gun'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.scene.physics.world.enableBody(this, 0)

    this.scene.registry.set('level', 1)

    const { bodySize, bodyOffset, speed, health } = SPRITES.player
    this.shotTimer = 0
    this.health = 100
    this.prevXp = 0
    this.xp = 0
    this.tp = 0
    this.maxTp = 100
    this.movePenalty = 1
    this.form = 1

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
    this.health = health

    this.input.on('pointerdown', () => (this.isMouseDown = true))
    this.input.on('pointerup', () => (this.isMouseDown = false))

    this.guns = []
    this.guns.push(new Gun(this.scene, 'light'))
    this.guns.push(new Gun(this.scene, 'dark'))
  }

  hit(enemy) {
    if (enemy.hitTimer > 0) return

    enemy.hitTimer = 10
    this.health -= enemy.damage
    this.scene.hpBar.set(this.health)
    this.movePenalty = 0.25

    if (this.health <= 0) this.scene.scene.start('Game')
  }

  addXP(val) {
    this.xp += val
    if (this.xp >= this.getNextLevelXP()) this.onLevel()
    this.scene.xpBar.set(this.xp - this.prevXp)
  }

  onLevel() {
    this.prevXp = this.xp
    this.scene.registry.set('level', this.level + 1)
    this.scene.scene.wake('Upgrade')
    this.scene.scene.pause()
    this.scene.xpBar.set(
      this.xp - this.prevXp,
      this.getNextLevelXP() - this.prevXp,
    )
  }

  getNextLevelXP() {
    return this.prevXp + 100 * Math.pow(1 + 0.2, this.level - 1)
  }

  get bullets() {
    return this.guns.map((gun) => gun.bullets)
  }

  get level() {
    return this.scene.registry.get('level')
  }

  get moveSpeed() {
    return (
      (40 + this.scene.registry.get('moveSpeed') * 40) *
      this.movePenalty *
      (this.form ? 1 : 0.45)
    )
  }

  transform() {
    this.tp = 0
    this.play(this.form ? 'executioner' : 'player')
    this.form = this.form ? 0 : 1
  }

  update() {
    this.setVelocity(0)

    if (this.movePenalty < 1) this.movePenalty += 0.02

    this.tp += 0.1
    if (this.tp > this.maxTp) this.transform()
    this.scene.tpBar.set(this.tp)

    this.guns.forEach((gun) => gun.update())
    if (this.isMouseDown) {
      const { x, y } = this.input.activePointer
      this.guns.forEach((gun) => {
        if (gun.type === (this.form === 1 ? 'light' : 'dark')) gun.shoot(x, y)
      })
    }

    if (this.upKey.isDown) {
      this.setVelocityY(-this.moveSpeed)
    } else if (this.downKey.isDown) {
      this.setVelocityY(this.moveSpeed)
    }

    if (this.leftKey.isDown) {
      this.setVelocityX(-this.moveSpeed)
    } else if (this.rightKey.isDown) {
      this.setVelocityX(this.moveSpeed)
    }
  }
}
