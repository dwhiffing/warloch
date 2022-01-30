import { Bar } from '../services/Bar'
export class Hud {
  constructor(scene) {
    this.scene = scene

    const o = 10
    const w = scene.cameras.main.width - o * 2
    const h = scene.cameras.main.height - o * 2
    const _h = 8
    const player = scene.player

    this.xpBar = new Bar(this.scene, o, o, w, _h, 0x00ffff, false)
    this.xpBar.set(player.xp, player.nextXP)

    this.hpBar = new Bar(this.scene, o, o + _h + 2, w, _h, 0xff0000, false)
    this.hpBar.set(player.hp, player.hp)

    this.tpBar = new Bar(
      this.scene,
      o,
      o + (_h + 2) * 2,
      w,
      _h,
      0xffff00,
      false,
    )
    this.tpBar.set(player.tp, player.maxTP)

    this.killText = this.scene.add
      .bitmapText(o, 38, 'gem', this.scene.registry.get('killCount'))
      .setScrollFactor(0)
      .setScale(0.5)
      .setDepth(99)

    this.timeText = this.scene.add
      .bitmapText(
        w / 2 + 10,
        38,
        'gem',
        this.getTimestamp(this.scene.registry.get('gameTimer')),
      )
      .setScrollFactor(0)
      .setDepth(99)
      .setScale(0.5)
      .setOrigin(0.5, 0)

    this.scoreText = this.scene.add
      .bitmapText(w + o, 38, 'gem', this.scene.registry.get('score'))
      .setScrollFactor(0)
      .setScale(0.5)
      .setDepth(99)
      .setOrigin(1, 0)

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
      .sprite(w, h, 'tiles', frame)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(99)
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
