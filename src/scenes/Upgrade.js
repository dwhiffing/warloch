import { PURCHASES, UPGRADES, WEAPONS } from '../constants'

const MAX_WEAPON_OR_UPGRADE_COUNT = 5

export default class Upgrade extends Phaser.Scene {
  constructor() {
    super({ key: 'Upgrade' })
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
      .bitmapText(camera.width / 2, bufferY * 3.7, 'gem', `Level`)
      .setOrigin(0.5)
      .setScale(0.5)

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

      this.nameTexts[index] = this.add
        .bitmapText(bufferX + bufferY + 2 + buttonSizeY, yBase + 4, 'gem', '')
        .setScale(0.5)

      this.descriptionTexts[index] = this.add
        .bitmapText(
          bufferX + bufferY + 2 + buttonSizeY,
          yBase + buttonSizeY - 4,
          'gem',
          '',
        )
        .setScale(0.5)
        .setOrigin(0, 1)

      this.levelTexts[index] = this.add
        .bitmapText(bufferX + buttonSizeX + 2, yBase + 4, 'gem', '')
        .setOrigin(1, 0)
        .setScale(0.5)
    })

    this.events.on(Phaser.Scenes.Events.WAKE, this.wake, this)
  }

  wake() {
    const level = this.registry.get('level')
    this.levelText.text = `Level ${level}`
    const unlockedWeapons = Object.keys(WEAPONS).filter(
      (key) => !!this.registry.values[key],
    )
    const unlockedUpgrades = Object.keys(UPGRADES).filter(
      (key) => !!this.registry.values[key],
    )

    const possiblePurchases = Phaser.Math.RND.shuffle(Object.values(PURCHASES))
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
      .filter((p) =>
        unlockedWeapons.length < MAX_WEAPON_OR_UPGRADE_COUNT
          ? true
          : unlockedWeapons.includes(p.key) || p.type !== 'weapon',
      )
      .filter((p) =>
        unlockedUpgrades.length < MAX_WEAPON_OR_UPGRADE_COUNT
          ? true
          : unlockedUpgrades.includes(p.key) || p.type !== 'upgrade',
      )

    let purchases
    if (level === 2) {
      purchases = possiblePurchases
        .filter((p) => p.type === 'weapon')
        .slice(0, 3)
    } else {
      purchases = possiblePurchases.slice(0, 3)
    }
    this.buttons.forEach((b, i) => {
      const purchase = purchases[i]
      this.images[i].setAlpha(0)
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
        .setAlpha(1)

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
