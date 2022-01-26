export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts = {}) {
    this.score = opts.score || 0
    this.sound.mute = localStorage.getItem('ggj-mute') === '1'
    // this.scene.start('Game')
  }

  create() {
    const { height, width } = this.game.config

    this.sound.stopAll()
    this.sound.play('menu-music', { loop: true, volume: 0.5 })
    this.keys = this.input.keyboard.addKeys('M')

    const w = this.cameras.main.width - 40
    const h = this.cameras.main.height - 40

    const frame =
      localStorage.getItem('ggj-mute') === '1' ? 'mute.png' : 'unmute.png'
    this.muteButton = this.add
      .sprite(w + 20, h + 20, 'tiles', frame)
      .setScrollFactor(0)
      .setInteractive()
      .setScale(0.5)
      .on('pointerdown', this.toggleMute.bind(this))

    this.add
      .sprite(width / 2, height / 2, 'tiles', 'bar.png')
      .setScale(4)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Game', { lives: 3 })
      })

    this.add
      .text(width / 2, height / 4, 'GGJ2022', {
        color: 'white',
        fontSize: 42,
        fontFamily: 'sans-serif',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, height / 2, 'play', {
        color: 'black',
        fontFamily: 'sans-serif',
      })
      .setOrigin(0.5)
  }

  toggleMute() {
    this.sound.mute = !this.sound.mute
    localStorage.setItem('ggj-mute', this.sound.mute ? '' : '1')
    this.muteButton.setFrame(this.sound.mute ? 'unmute.png' : 'mute.png')
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.M)) {
      this.toggleMute()
    }
  }
}
