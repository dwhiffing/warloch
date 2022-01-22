export class Bar {
  constructor(scene, x, y, width, height, tint, scroll = true) {
    this.scene = scene
    this.width = width
    this.height = height
    this.outer = this.scene.add.sprite(x, y, 'tiles', 'bar.png')
    this.inner = this.scene.add.sprite(x, y, 'tiles', 'bar.png')
    this.inner
      .setScrollFactor(scroll ? 1 : 0)
      .setOrigin(0, 0.5)
      .setDisplaySize(0, height)
      .setTint(tint)
      .setDepth(99)
    this.outer
      .setScrollFactor(scroll ? 1 : 0)
      .setOrigin(0, 0.5)
      .setDisplaySize(width, height)
      .setTint(0x999999)
      .setDepth(98)
  }

  die() {
    this.inner.setActive(false).setVisible(false)
    this.outer.setActive(false).setVisible(false)
  }

  set(value, maxValue) {
    this.inner.setActive(true).setVisible(true)
    this.outer.setActive(true).setVisible(true)
    this.value = Math.max(value, 0)
    if (typeof maxValue === 'number') this.maxValue = maxValue
    this.update()
  }

  move(x, y) {
    this.inner.setPosition(x - this.width / 2, y - 6)
    this.outer.setPosition(x - this.width / 2, y - 6)
  }

  update() {
    let factor = this.value / this.maxValue
    factor = isNaN(factor) ? 0 : factor
    this.inner.setDisplaySize(this.width * factor, this.height)
  }
}
