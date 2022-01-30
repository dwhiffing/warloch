export class Bar {
  constructor(scene, x, y, width, height, tint, scroll = true) {
    this.scene = scene
    this.width = width
    this.height = height

    const get = (x, y, key, width = 0, height) =>
      this.scene.add
        .sprite(x, y, 'tiles', key + '.png')
        .setDisplaySize(width, height)
        .setScrollFactor(scroll ? 1 : 0)
        .setOrigin(0, 0.5)
        .setDepth(98)

    const o = height > 2 ? 2 : 0
    this.shadowMid = get(x + 3, y, 'shadow_mid', width - 6, height)
    this.barMid = get(x + 4, y, 'bar_mid', 0, height - o).setTint(tint)

    if (height > 2) {
      this.shadowLeft = get(x, y, 'shadow_left', 3, height)
      this.shadowRight = get(x + width - 3, y, 'shadow_right', 3, height)
      this.barLeft = get(x + 2, y, 'bar_left', 2, height - o).setTint(tint)
      this.barRight = get(x + 5, y, 'bar_right', 2, height - o).setTint(tint)
    }
  }

  die() {
    this.barMid.setActive(false).setVisible(false)
    this.shadowMid.setActive(false).setVisible(false)
  }

  set(value, maxValue) {
    this.barMid.setActive(true).setVisible(true)
    this.shadowMid.setActive(true).setVisible(true)
    this.value = Math.max(value, 0)
    if (this.hideWhenFull && value === maxValue) {
      this.barMid.setVisible(false)
      this.shadowMid.setVisible(false)
    }
    if (typeof maxValue === 'number') this.maxValue = maxValue
    this.update()
  }

  move(x, y) {
    this.barMid.setPosition(x - this.width / 2, y - 6)
    this.shadowMid.setPosition(x - this.width / 2, y - 6)
  }

  update() {
    let factor = this.value / this.maxValue
    factor = isNaN(factor) ? 0 : factor
    const w = (this.width - 6) * factor
    this.barMid.setDisplaySize(w, this.height - (this.height < 3 ? 0 : 2))
    if (this.barRight) this.barRight.x = w + 12
  }
}
