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

    const buttonSizeX = menuWidth - bufferY * 2
    const buttonSizeY = (menuHeight - bufferY * 2) / 5
    this.buttons = []
    this.nameTexts = []
    this.images = []
    this.descriptionTexts = []
    this.levelTexts = []
    const BUTTONS = new Array(4).fill({})
    BUTTONS.forEach((_, index) => {
      const yBase = bufferY * 6 + index * (buttonSizeY + 5)
      this.buttons[index] = this.add
        .rectangle(bufferX + bufferY, yBase, buttonSizeX, buttonSizeY)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x333333)
        .setInteractive()
      const imageBuffer = 5

      this.images[index] = this.add
        .rectangle(
          bufferX + bufferY + imageBuffer,
          yBase + imageBuffer,
          buttonSizeY - imageBuffer * 2,
          buttonSizeY - imageBuffer * 2,
        )
        .setOrigin(0, 0)
        .setFillStyle('black')

      this.nameTexts[index] = this.add.text(
        bufferX + bufferY + 4 + buttonSizeY,
        yBase + 4,
        '',
        { font: '18px Roboto Mono' },
      )

      this.descriptionTexts[index] = this.add
        .text(
          bufferX + bufferY + 4 + buttonSizeY,
          yBase + buttonSizeY - 3,
          '',
          { font: '14px Roboto Mono' },
        )
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
    const level = this.registry.get('level')
    this.levelText.text = `Level ${level}`
    const possiblePurchases = Object.values(PURCHASES)
      .map((p) => {
        const upgrade = UPGRADES[p.key] || WEAPONS[p.key]
        return {
          ...p,
          level: this.registry.get(p.key) || 0,
          maxLevel: upgrade.levels.length,
          upgrade,
        }
      })
      .filter((p) => p.level < p.maxLevel)

    const purchases = [
      ...Phaser.Math.RND.shuffle(
        possiblePurchases.filter((p) => p.type === 'weapon'),
      ).slice(0, level === 2 ? 3 : 1),
      ...Phaser.Math.RND.shuffle(
        possiblePurchases.filter((p) => p.type === 'upgrade'),
      ).slice(0, level === 2 ? 0 : 2),
    ]
    this.buttons.forEach((b, i) => {
      const purchase = purchases[i]
      if (!purchase) return

      const { name, level, upgrade, description, type } = purchase

      this.nameTexts[i].setText(`${name}`)
      this.levelTexts[i].setText(`Lvl ${level} -> ${level + 1}`)

      const upgradeDesc = Object.entries(upgrade.levels[level] || {})
        .map((a) => a.flat().join(' '))
        .join(', ')

      this.descriptionTexts[i].setText(level === 0 ? description : upgradeDesc)

      this.images[i]
        .setFillStyle(type === 'weapon' ? 0xff0000 : 0xffff00)
        .setStrokeStyle(2, 0x333333)

      b.setFillStyle(0x777777)
      b.off('pointerdown')
      b.on('pointerdown', () => {
        this.registry.inc(purchase.key)
        this.scene.resume('Game')
        this.scene.sleep()
      })
    })
  }

  update() {}
}
