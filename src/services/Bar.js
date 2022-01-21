export class Bar {
  constructor(scene, x, y, width, height, tint, scroll = true) {
    this.scene = scene
    this.width = width
    this.height = height
    this.outer = this.scene.add.sprite(x, y, 'bar')
    this.inner = this.scene.add.sprite(x, y, 'bar')
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
    this.inner.setActive(false)
    this.inner.setActive(false)
    this.outer.setVisible(false)
    this.outer.setVisible(false)
  }

  set(value, maxValue) {
    this.inner.setActive(true)
    this.inner.setActive(true)
    this.outer.setVisible(true)
    this.outer.setVisible(true)
    this.value = Math.max(value, 0)
    if (typeof maxValue === 'number') this.maxValue = maxValue
    this.update()
  }

  move(x, y) {
    this.inner.x = x - this.width / 2
    this.inner.y = y - 6
    this.outer.x = x - this.width / 2
    this.outer.y = y - 6
  }

  update() {
    let factor = this.value / this.maxValue
    factor = isNaN(factor) ? 0 : factor
    this.inner.setDisplaySize(this.width * factor, this.height)
  }
}
