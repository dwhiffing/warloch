export const UPGRADES = {
  bulletDelay: { tint: 0xf8961e, name: 'Bullet Delay', key: 'bulletDelay' },
  bulletCount: { tint: 0xf3722c, name: 'Bullet Count', key: 'bulletCount' },
  bulletSpeed: { tint: 0xf3722c, name: 'Bullet Speed', key: 'bulletSpeed' },
  bulletDamage: { tint: 0xf94144, name: 'Bullet Damage', key: 'bulletDamage' },
  spawnRate: { tint: 0xf94144, name: 'Spawn Rate', key: 'spawnRate' },
  moveSpeed: { tint: 0xf94144, name: 'Move Speed', key: 'moveSpeed' },
}

export default class Upgrade extends Phaser.Scene {
  constructor() {
    super({ key: 'Upgrade', active: true })
  }

  init() {
    this.scene.sleep()
  }

  create() {
    const camera = this.cameras.main
    const buffer = 20
    const menuWidth = camera.width - buffer * 2
    const menuHeight = camera.height - buffer * 2
    this.add
      .rectangle(buffer, buffer, menuWidth, menuHeight, 0x333333)
      .setOrigin(0, 0)
    this.levelText = this.add.text(camera.width / 2, 45, `Level`).setOrigin(0.5)

    const buttonSizeX = menuWidth - buffer * 2
    const buttonSizeY = (menuHeight - buffer * 2) / 4
    this.buttons = []
    this.descriptions = []
    const BUTTONS = [{}, {}, {}]
    BUTTONS.forEach((_, index) => {
      this.buttons[index] = this.add
        .rectangle(
          buffer * 2,
          buffer * 4 + index * (buttonSizeY + buffer / 2),
          buttonSizeX,
          buttonSizeY,
        )
        .setOrigin(0, 0)
        .setInteractive()

      this.descriptions[index] = this.add
        .text(
          camera.width / 2,
          buffer * 4 + index * (buttonSizeY + buffer / 2) + buttonSizeY / 2,
          '',
        )
        .setOrigin(0.5)
    })

    this.events.on(Phaser.Scenes.Events.WAKE, this.wake, this)
  }

  wake() {
    this.levelText.text = `Level ${this.registry.get('level')}`
    const upgrades = Phaser.Math.RND.shuffle(Object.values(UPGRADES)).slice(
      0,
      3,
    )
    this.buttons.forEach((b, i) => {
      const upgrade = upgrades[i]
      if (!upgrade) return
      const currentLevel = this.registry.get(upgrade.key) || 0
      this.descriptions[i].setText(`${upgrade.name}: ${currentLevel + 1}`)
      b.setFillStyle(upgrade.tint)
      b.off('pointerdown')
      b.on('pointerdown', () => {
        this.registry.set(upgrade.key, currentLevel + 1)
        this.scene.resume('Game')
        this.scene.sleep()
      })
    })
  }

  update() {}
}
