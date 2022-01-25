import { WEAPONS, UPGRADES } from '../constants'
import { Gun } from '../services/Gun'
import { applyUpgrade } from '../utils'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiles')
    this.scene.physics.world.enableBody(this, 0)

    this._maxHP = 100
    this._xpRate = 1
    this._pickupRange = 15
    this.hp = this.maxHP
    this.xp = 0
    this.tp = 0
    this.level = 1
    this.form = 'light'
    this.movePenalty = 1
    this.setDepth(70)

    this.weapons = Object.values(WEAPONS).map((w) => ({
      ...w,
      get level() {
        return scene.registry.get(`${w.name}`) || 0
      },
    }))
    this.levelUpgrade('one')

    this.body.setMaxSpeed(this.moveSpeed)

    this.play('player')
      .setCollideWorldBounds(true)
      .setOrigin(0.5)
      .setBodySize(8, 8)
      .setMass(1)
      .setOffset(12, 22)

    this.guns = []
  }

  init() {
    this.activeGunIndex = 0
    this.weapons.forEach((w) => {
      const { light, dark } = w
      if (light) this.guns.push(new Gun(this.scene, light, w))
      if (dark) this.guns.push(new Gun(this.scene, dark, w))
    })
    // TODO: blast gun needs to be based on existing guns?
    this.guns.push(new Gun(this.scene, 'blast'))
  }

  update() {
    this.setAcceleration(0)
    this.setDrag(150)
    this.tp += 0.05

    if (this.movePenalty < 1) {
      this.movePenalty += 0.01
    }

    this.hp += this.regen
    if (this.hp > this.maxHP) this.hp = this.maxHP

    const activeWeapons = this.weapons
      .filter((w) => w.level > 0)
      .map((w) => (this.form === 'light' ? w.light : w.dark))
    this.guns.forEach((gun) => {
      gun.update()
      if (activeWeapons.includes(gun.type)) gun.shoot()
    })
  }

  levelUpgrade(weapon) {
    const maxLevel = (WEAPONS[weapon] || UPGRADES[weapon]).levels.length
    if ((this.scene.registry.get(weapon) || 0) < maxLevel)
      this.scene.registry.inc(weapon)
  }

  applyUpgrade(key, obj) {
    UPGRADES[key].levels
      .filter((_, i) => (this.scene.registry.get(key) || 0) > i)
      .forEach((boost) =>
        Object.entries(boost).forEach((u) => applyUpgrade(u, obj)),
      )
    return obj
  }

  get regen() {
    const obj = this.applyUpgrade('healthRegen', { regen: 0 })
    return obj.regen
  }

  get bullets() {
    return this.guns.map((gun) => [gun.explodeGun?.bullets, gun.bullets]).flat()
  }

  get moveSpeed() {
    const speed = 70 * this.movePenalty * (this.form === 'light' ? 1 : 0.45)
    const obj = this.applyUpgrade('moveSpeed', { speed })
    this.body.setMaxSpeed(obj.speed)
    return obj.speed
  }

  get hp() {
    return this._hp
  }

  set hp(val) {
    if (this._hp > val) {
      this.movePenalty = 0.5
      if (this._hp <= this.maxHP) {
        this.scene.cameras.main.shake(200, 0.01)
        this.setTint(Phaser.Display.Color.GetColor(255, 0, 0))
        this.scene.time.delayedCall(100, this.clearTint.bind(this))
        this.scene.sound.play(`Glass-light-${Phaser.Math.RND.between(0, 4)}`, {
          volume: 0.3,
        })
      }
    }
    this._hp = val
    this.scene.hud?.set('hp', this._hp, this.maxHP)
    if (this._hp <= 0) {
      this._hp = 0
      this.scene.sound.play('death', { volume: 0.4 })
      this.scene.scene.start('Game')
    }
  }

  get maxHP() {
    const obj = this.applyUpgrade('maxHP', { maxHP: this._maxHP })
    return obj.maxHP
  }

  get xp() {
    return this._xp
  }

  get pickupRange() {
    const obj = this.applyUpgrade('pickupRange', {
      pickupRange: this._pickupRange,
    })
    return obj.pickupRange
  }

  get xpRate() {
    const obj = this.applyUpgrade('xpRate', { xpRate: this._xpRate })
    return obj.xpRate
  }

  set xp(val) {
    this._xp = val
    if (this._xp >= this.nextXP) this.level++

    this.scene.sound.play('chord', {
      rate: 1 + this._xp / this.nextXP || 0,
      volume: 0.4,
    })
    this.scene.hud?.set('xp', this.xp - this.prevXP)
  }

  get nextXP() {
    return this.prevXP + 400 * Math.pow(1.5, this.level - 1) - 350
  }

  get level() {
    return this.scene.registry.get('level')
  }

  set level(value) {
    this.scene.registry.set('level', value)
    this.prevXP = this.xp
    this.scene.hud?.set('xp', this.xp - this.prevXP, this.nextXP - this.prevXP)
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

      if (this.form === 'light') {
        this.scene.cameras.main.shake(400, 0.02)
        this.body.setMaxSpeed(0)
        this.guns.find((g) => g.type === 'blast')?.shoot()
        this.scene.time.delayedCall(500, () =>
          this.body.setMaxSpeed(this.moveSpeed),
        )
      }

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
