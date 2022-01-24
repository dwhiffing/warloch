import { WEAPONS, SPRITES } from '../constants'
import { Gun } from '../services/Gun'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.scene.physics.world.enableBody(this, 0)

    this.hp = 100
    this.xp = 0
    this.tp = 0
    this.level = 1
    this.form = 'light'
    this.movePenalty = 1
    this.setDepth(70)
    this.weapons = Object.values(WEAPONS)

    this.body.setMaxSpeed(this.moveSpeed)

    const { bodySize, bodyOffset } = SPRITES.player
    this.play('player')
      .setCollideWorldBounds(true)
      .setOrigin(0.5)
      .setBodySize(...bodySize)
      .setOffset(...bodyOffset)

    this.guns = []
  }

  init() {
    this.activeGunIndex = 0
    this.weapons.forEach((w) => {
      const { light, dark, lswitch, dswitch } = w
      if (light) this.guns.push(new Gun(this.scene, light))
      if (dark) this.guns.push(new Gun(this.scene, dark))
      if (lswitch) this.guns.push(new Gun(this.scene, lswitch))
      if (dswitch) this.guns.push(new Gun(this.scene, dswitch))
    })
  }

  update() {
    this.setVelocity(0)
    this.tp += 0.01

    if (this.movePenalty < 1) {
      this.movePenalty += 0.02
    }

    const activeWeapon = this.weapons[this.activeGunIndex][this.form]
    this.guns.forEach((gun) => {
      gun.update()
      if (gun.type === activeWeapon) gun.shoot()
    })
  }

  changeWeapon(direction) {
    this.activeGunIndex += direction
    if (this.activeGunIndex < 0) this.activeGunIndex = this.weapons.length - 1
    if (this.activeGunIndex >= this.weapons.length) this.activeGunIndex = 0
  }

  get bullets() {
    return this.guns.map((gun) => [gun.explodeGun?.bullets, gun.bullets]).flat()
  }

  get moveSpeed() {
    return 70 * this.movePenalty * (this.form === 'light' ? 1 : 0.45)
  }

  get hp() {
    return this._hp
  }

  set hp(val) {
    if (this._hp > val) {
      this.scene.cameras.main.shake(200, 0.01)
      this.setTint(Phaser.Display.Color.GetColor(255, 0, 0))
      this.scene.time.delayedCall(100, this.clearTint.bind(this))
      this.scene.sound.play(`Glass-light-${Phaser.Math.RND.between(0, 4)}`, {
        volume: 0.3,
      })
    }
    this._hp = val
    this.movePenalty = 0.5
    if (this._hp <= 0) {
      this._hp = 0
      this.scene.sound.play('death', { volume: 0.4 })
      this.scene.scene.start('Game')
    }
    this.scene.hud?.set('hp', this._hp)
  }

  get xp() {
    return this._xp
  }

  set xp(val) {
    this._xp = val
    if (this._xp >= this.nextXP) this.level++

    this.scene.sound.play('chord', {
      rate: 1 + this._xp / this.nextXP || 0,
      volume: 0.4,
    })
    this.scene.hud?.set('xp', this._xp - this.prevXp)
  }

  get nextXP() {
    return this.prevXp + 100 * Math.pow(1 + 0.2, this.level - 1)
  }

  get level() {
    return this.scene.registry.get('level')
  }

  set level(value) {
    this.scene.registry.set('level', value)
    this.prevXp = this.xp
    this.scene.hud?.set('xp', this.xp - this.prevXp, this.nextXP - this.prevXp)
    if (value !== 1) {
      this.scene.sound.play('level', { volume: 0.1 })
      this.scene.showUpgradeMenu()
    }
    return this.level
  }

  get tp() {
    return this._tp
  }

  set tp(val) {
    this._tp = val
    if (this._tp > this.maxTP) {
      this._tp = 0
      this.play(this.form === 'light' ? 'player2' : 'player')

      let switchGunKey = 'lswitch'

      if (this.form === 'light') {
        this.scene.cameras.main.shake(400, 0.02)
        switchGunKey = 'dswitch'
        this.body.setMaxSpeed(0)
        this.scene.time.delayedCall(500, () =>
          this.body.setMaxSpeed(this.moveSpeed),
        )
      }
      this.guns
        .find((g) => g.type === this.weapons[this.activeGunIndex][switchGunKey])
        ?.shoot()

      this.scene.sound.play(
        this.form === 'light' ? 'transform2' : 'transform',
        {
          volume: this.form === 'light' ? 0.4 : 0.1,
          rate: this.form === 'light' ? 1 : 2,
        },
      )

      this.form = this.form === 'light' ? 'dark' : 'light'
      if (this.form === 'light') this.body.setMaxSpeed(this.moveSpeed)
    }
    this.scene.hud?.set('tp', this._tp)
  }

  get maxTP() {
    return 100
  }
}
