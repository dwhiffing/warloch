import { Button } from '../sprites/Button'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts = {}) {
    this.score = opts.score || 0
    this.sound.mute = localStorage.getItem('ggj-mute') === '1'
    // this.continue()
  }

  create({ playMusic }) {
    const { height, width } = this.game.config
    const w = this.cameras.main.width - 40
    const h = this.cameras.main.height - 40
    const _w = width / 2
    const _h = height / 2 + 15

    const save = localStorage.getItem('warloch-save')
    const label = save ? 'New Game' : 'Play'
    this.add.image(_w, save ? height / 4 : height / 3, 'title')
    this.add.existing(new Button(this, _w, _h + 30, label, this.newGame))

    if (save)
      this.add.existing(new Button(this, _w, _h, 'Continue', this.continue))

    this.add.existing(new Button(this, _w, _h + 60, 'About', this.about))
    this.add.existing(
      new Button(this, _w, _h + 90, 'High Scores', this.gotoScores),
    )

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

    window.addEventListener('resize', () => {
      this.game.scale.setGameSize(500, 270)
    })
  }

  update() {}

  newGame = () => {
    this.fullscreen(() => {
      if (!localStorage.getItem('warloch-has-seen-about')) {
        this.about()
        return
      }
      localStorage.removeItem('warloch-save')
      this.scene.start('Game')
    })
  }

  continue = () => {
    this.fullscreen(() => this.scene.start('Game'))
  }

  gotoScores = () => {
    this.fullscreen(() => this.scene.start('Score', { playMusic: false }))
  }

  about = () => {
    this.fullscreen(() => this.scene.start('About', { playMusic: false }))
  }

  fullscreen = (cb) => {
    if (!this.sys.game.device.os.desktop && !this.scale.isFullscreen) {
      this.scale.startFullscreen()
      this.time.delayedCall(1000, cb)
    } else {
      cb()
    }
  }

  toggleMute() {
    this.sound.mute = !this.sound.mute
    localStorage.setItem('ggj-mute', this.sound.mute ? '' : '1')
    this.muteButton.setFrame(this.sound.mute ? 'unmute.png' : 'mute.png')
  }
}
