import { Button } from '../sprites/Button'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts = {}) {
    this.score = opts.score || 0
    this.sound.mute = localStorage.getItem('ggj-mute') === '1'
    // this.scene.start('Game')
  }

  create({ playMusic }) {
    const { height, width } = this.game.config
    const w = this.cameras.main.width - 40
    const h = this.cameras.main.height - 40
    const _w = width / 2
    const _h = height / 2

    this.add
      .text(_w, height / 4, 'GGJ2022', {
        fontSize: 42,
        fontFamily: 'sans-serif',
      })
      .setOrigin(0.5)

    this.add.existing(new Button(this, _w, _h, 'new game', this.newGame))

    if (localStorage.getItem('ggj22-save'))
      this.add.existing(
        new Button(this, _w, _h + 30, 'continue', this.continue),
      )

    this.add.existing(new Button(this, _w, _h + 60, 'scores', this.gotoScores))

    if (playMusic) {
      this.sound.stopAll()
      this.sound.play('menu-music', { loop: true, volume: 0.5 })
    }

    const muted = localStorage.getItem('ggj-mute') === '1'
    this.muteButton = this.add
      .sprite(w + 20, h + 20, 'tiles', muted ? 'mute.png' : 'unmute.png')
      .setScrollFactor(0)
      .setInteractive()
      .setScale(0.5)
      .on('pointerdown', this.toggleMute.bind(this))
  }

  update() {}

  newGame = () => {
    localStorage.removeItem('ggj22-save')
    this.scene.start('Game')
  }

  continue = () => {
    this.scene.start('Game')
  }

  gotoScores = () => {
    this.scene.start('Score', { playMusic: false })
  }

  toggleMute() {
    this.sound.mute = !this.sound.mute
    localStorage.setItem('ggj-mute', this.sound.mute ? '' : '1')
    this.muteButton.setFrame(this.sound.mute ? 'unmute.png' : 'mute.png')
  }
}
