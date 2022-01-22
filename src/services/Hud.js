import { Bar } from '../services/Bar'
export class Hud {
  constructor(scene) {
    this.scene = scene

    const o = 20
    const w = scene.cameras.main.width - 40
    const h = scene.cameras.main.height - 40
    const player = scene.player

    this.xpBar = new Bar(this.scene, o, o, w, 4, 0x00ffff, false)
    this.xpBar.set(player.xp, player.nextXP)

    this.hpBar = new Bar(this.scene, o, o + 5, w, 4, 0xff0000, false)
    this.hpBar.set(player.hp, player.hp)

    this.tpBar = new Bar(this.scene, o, o + 10, w, 4, 0xffff00, false)
    this.tpBar.set(player.tp, player.maxTP)

    const frame =
      localStorage.getItem('ggj-mute') === '1' ? 'mute.png' : 'unmute.png'
    this.muteButton = this.scene.add
      .sprite(w + 20, h + 20, 'tiles', frame)
      .setScrollFactor(0)
      .setInteractive()
      .setScale(0.5)
      .on('pointerdown', this.toggleMute.bind(this))
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

  toggleMute() {
    this.scene.sound.mute = !this.scene.sound.mute
    localStorage.setItem('ggj-mute', this.scene.sound.mute ? '' : '1')
    this.muteButton.setFrame(this.scene.sound.mute ? 'unmute.png' : 'mute.png')
  }

  update() {}
}
