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

    this.killText = this.scene.add
      .text(20, 40, this.scene.registry.get('killCount'), {
        font: '12px Roboto Mono',
      })
      .setScrollFactor(0)
      .setDepth(99)

    this.scoreText = this.scene.add
      .text(w + 20, 40, this.scene.registry.get('score'), {
        font: '12px Roboto Mono',
      })
      .setScrollFactor(0)
      .setDepth(99)
      .setOrigin(1, 0)

    this.timeText = this.scene.add
      .text(
        (w + 40) / 2,
        40,
        this.getTimestamp(this.scene.registry.get('gameTimer')),
        {
          font: '12px Roboto Mono',
        },
      )
      .setScrollFactor(0)
      .setDepth(99)
      .setOrigin(0.5, 0)

    const frame =
      localStorage.getItem('ggj-mute') === '1' ? 'mute.png' : 'unmute.png'

    this.scene.registry.events.on('changedata-gameTimer', (_, current) => {
      this.timeText.text = this.getTimestamp(current)
    })

    this.scene.registry.events.on('changedata-killCount', (_, current) => {
      this.killText.text = current
    })

    this.scene.registry.events.on('changedata-score', (_, current) => {
      this.scoreText.text = current
    })

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

  getTimestamp = (n) =>
    `${Math.floor(n / 60)}:${(n % 60).toString().padStart(2, '0')}`
}
