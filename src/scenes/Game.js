import { Player } from '../sprites/Player'
import { Bar } from '../services/Bar'
import { SPRITES } from '../constants'
import { EnemyService } from '../services/EnemyService'
import { Orb } from '../sprites/Orb'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.input.mouse.disableContextMenu()
    Object.values(SPRITES).forEach((sprite) =>
      this.createAnim(sprite.key, sprite.name),
    )
  }

  create() {
    this.physics.world.setBounds(0, 0, 2240, 2240)
    this.cameras.main.setBounds(0, 0, 2240, 2240)

    this.orbs = this.physics.add.group({ classType: Orb, maxSize: 50 })
    this.orbs.createMultiple({ quantity: 50, active: false })

    this.add.tileSprite(0, 0, 2240, 2240, 'background').setOrigin(0)

    this.player = this.add.existing(new Player(this, 960, 960))
    this.enemyService = new EnemyService(this)

    this.physics.add.collider(this.enemyService.enemies)
    this.physics.add.overlap(
      this.player.bullets,
      this.enemyService.enemies,
      (bullet, enemy) => {
        if (!bullet.active || !enemy.active) return
        enemy.hit(bullet)
        bullet.hit(enemy)
      },
    )

    this.physics.add.collider(
      this.player,
      this.enemyService.enemies,
      (player, enemy) => {
        if (player.active && enemy.active) player.hit(enemy)
      },
    )

    this.physics.add.overlap(this.player, this.orbs, (player, orb) => {
      if (!player.active || !orb.active) return
      player.addXP(orb.value)
      orb.hit(player)
    })

    const offset = 20
    const width = this.cameras.main.width - 40
    this.xpBar = new Bar(this, offset, offset, width, 4, 0x00ffff, false)
    this.xpBar.set(this.player.xp, this.player.getNextLevelXP())

    this.hpBar = new Bar(this, offset, offset + 5, width, 4, 0xff0000, false)
    this.hpBar.set(this.player.health, this.player.health)

    this.tpBar = new Bar(this, offset, offset + 10, width, 4, 0xffff00, false)
    this.tpBar.set(this.player.tp, this.player.maxTp)

    this.cameras.main.startFollow(this.player)
    this.debugKeys = this.input.keyboard.addKeys('P,O')
  }

  update(time, delta) {
    this.player.update(time, delta)
    this.enemyService.update(time, delta)

    if (Phaser.Input.Keyboard.JustDown(this.debugKeys.P)) {
      this.player.addXP(100)
    }

    if (Phaser.Input.Keyboard.JustDown(this.debugKeys.O)) {
      this.player.tp += 99
    }
  }

  render() {}

  createAnim(key, prefix) {
    this.anims.create({
      key,
      frames: this.anims.generateFrameNames('tiles', {
        prefix: `${prefix}_Walk_`,
        suffix: '.png',
        start: 1,
        end: 4,
      }),
      repeat: -1,
    })
  }
}
