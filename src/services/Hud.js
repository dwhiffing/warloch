import { Bar } from '../services/Bar'
export class Hud {
  constructor(scene) {
    this.scene = scene

    const o = 20
    const w = scene.cameras.main.width - 40
    const player = scene.player

    this.xpBar = new Bar(this.scene, o, o, w, 4, 0x00ffff, false)
    this.xpBar.set(player.xp, player.nextXP)

    this.hpBar = new Bar(this.scene, o, o + 5, w, 4, 0xff0000, false)
    this.hpBar.set(player.hp, player.hp)

    this.tpBar = new Bar(this.scene, o, o + 10, w, 4, 0xffff00, false)
    this.tpBar.set(player.tp, player.maxTP)
  }

  set(type, value, maxValue) {
    if (type === 'hp') {
      this.hpBar.set(value, maxValue)
    } else if (type === 'xp') {
      this.xpBar.set(value, maxValue)
    } else {
      this.tpBar.set(value, maxValue)
    }
  }

  update() {}
}
