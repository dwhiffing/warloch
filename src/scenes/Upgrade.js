import { PURCHASES, UPGRADES, WEAPONS } from '../constants'

export default class Upgrade extends Phaser.Scene {
  constructor() {
    super({ key: 'Upgrade', active: true })
  }

  init() {
    this.scene.sleep()
  }

  create() {
    const camera = this.cameras.main
    const b = 8
    const bufferY = 8
    const bufferX = 45
    const menuWidth = camera.width - bufferX * 2
    const menuHeight = camera.height - bufferY * 2
    this.add
      .rectangle(bufferX, bufferY, menuWidth, menuHeight, 0x114499)
      .setStrokeStyle(2, 0x003344)
      .setOrigin(0, 0)
    this.levelText = this.add
      .text(camera.width / 2, bufferY * 3.7, `Level`, {
        font: '24px Roboto Mono',
      })
      .setOrigin(0.5)

    const buttonSizeX = menuWidth - b * 2
    const buttonSizeY = (menuHeight - bufferY * 2) / 5
    this.buttons = []
    this.nameTexts = []
    this.descriptionTexts = []
    this.levelTexts = []
    const BUTTONS = new Array(4).fill({})
    BUTTONS.forEach((_, index) => {
      const yBase = bufferY * 6 + index * (buttonSizeY + 5)
      this.buttons[index] = this.add
        .rectangle(bufferX + b, yBase, buttonSizeX, buttonSizeY)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x333333)
        .setInteractive()

      this.add
        .rectangle(bufferX + b + 3, yBase + 3, buttonSizeY - 6, buttonSizeY - 6)
        .setOrigin(0, 0)
        .setFillStyle('black')

      this.nameTexts[index] = this.add.text(
        bufferX + b + 4 + buttonSizeY,
        yBase + 4,
        '',
        { font: '18px Roboto Mono' },
      )

      this.descriptionTexts[index] = this.add
        .text(bufferX + b + 4 + buttonSizeY, yBase + buttonSizeY - 3, '', {
          font: '14px Roboto Mono',
        })
        .setOrigin(0, 1)

      this.levelTexts[index] = this.add
        .text(bufferX + buttonSizeX + 2, yBase + 4, '', {
          font: '16px Roboto Mono',
        })
        .setOrigin(1, 0)
    })

    this.events.on(Phaser.Scenes.Events.WAKE, this.wake, this)
  }

  wake() {
    this.levelText.text = `Level ${this.registry.get('level')}`
    const purchases = Object.values(PURCHASES).filter((p) => {
      const currentLevel = this.registry.get(p.key) || 0
      const maxLevel = (UPGRADES[p.key] || WEAPONS[p.key]).levels.length + 1
      console.log(currentLevel, maxLevel)
      return currentLevel < maxLevel
    })
    const upgrades = Phaser.Math.RND.shuffle(purchases).slice(0, 4)
    this.buttons.forEach((b, i) => {
      const upgrade = upgrades[i]
      if (!upgrade) return
      const currentLevel = this.registry.get(upgrade.key) || 0
      this.nameTexts[i].setText(`${upgrade.name}`)
      this.levelTexts[i].setText(`${currentLevel} -> ${currentLevel + 1}`)
      if (currentLevel === 0) {
        this.descriptionTexts[i].setText(upgrade.description)
      } else {
        this.descriptionTexts[i].setText(
          upgrade.upgradeDescription
            ? upgrade.upgradeDescription(10)
            : 'Upgrade to ' + (currentLevel + 1),
        )
      }
      b.setFillStyle(0x777777)
      b.off('pointerdown')
      b.on('pointerdown', () => {
        this.registry.inc(upgrade.key)
        this.scene.resume('Game')
        this.scene.sleep()
      })
    })
  }

  update() {}
}
