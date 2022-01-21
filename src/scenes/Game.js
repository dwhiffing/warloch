import { Player } from '../sprites/Player'
import { Bar } from '../services/Bar'
import { SPRITES } from '../constants'
import { EnemyService } from '../services/EnemyService'

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

    this.physics.add.overlap(
      this.player,
      this.enemyService.enemies,
      (player, enemy) => {
        if (player.active && enemy.active) player.hit(enemy)
      },
    )

    const width = this.cameras.main.width - 40
    this.xpBar = new Bar(this, 20, 20, width, 4, 0x00ffff, false)
    this.xpBar.set(0, 100)

    this.hpBar = new Bar(this, 20, 30, width, 4, 0xff0000, false)
    this.hpBar.set(100, 100)

    this.cameras.main.startFollow(this.player)
  }

  update(time, delta) {
    this.player.update(time, delta)
    this.enemyService.update(time, delta)
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
