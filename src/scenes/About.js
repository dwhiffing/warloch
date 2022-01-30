import { Button } from '../sprites/Button'

const INSTRUCTIONS = [
  "You are 'Loch', a wizard with a dual nature.\n\nWASD/Arrows to move, mouse to aim spells.\n\nDefeat foes and grab gems to level up.\n\nErupt into War form when you deal enough damage.\n\nWar form is invulnerable and corrupts your spells.",
  'You start with only your trusty magic missile.\n\nEnemies will get stronger as time passes.\n\nWhile War, push enemies away to grab gems.\n\nGood luck!',
  'Daniel Whiffing - Design, Coding and Sound\n\nSam Braithwaite - Art\n\nAsh Dadoun - Art\n\nPurple Planet - Music',
]

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'About' })
  }

  create({ score, playMusic }) {
    this.scoreTexts = []
    const { height, width } = this.game.config

    const w = this.cameras.main.width - 40
    const h = this.cameras.main.height - 20
    const _w = width / 2

    this.index = 0

    this.add.bitmapText(_w, 30, 'gem', 'Warloch').setOrigin(0.5)

    this.add.existing(new Button(this, _w - 80, h - 10, 'Back', this.back))

    this.nextButton = this.add.existing(
      new Button(this, _w + 80, h - 10, 'Next', this.next),
    )

    this.text = this.add
      .bitmapText(_w, 60, 'gem', INSTRUCTIONS[0])
      .setOrigin(0.5, 0)
      .setScale(0.5)

    if (playMusic) {
      this.sound.stopAll()
      this.sound.play('menu-music', { loop: true, volume: 0.5 })
    }
    const muted = localStorage.getItem('ggj-mute') === '1'
    this.muteButton = this.add
      .sprite(w + 20, h, 'tiles', muted ? 'mute.png' : 'unmute.png')
      .setScrollFactor(0)
      .setInteractive()
      .setScale(0.5)
      .on('pointerdown', this.toggleMute.bind(this))
  }

  back = () => {
    this.text.setText(INSTRUCTIONS[--this.index])
    this.nextButton.setText('Next')
    if (this.index < 0) {
      this.scene.start('Menu', { playMusic: false })
    }
  }

  next = () => {
    this.text.setText(INSTRUCTIONS[++this.index])
    if (this.index === INSTRUCTIONS.length - 1) {
      this.nextButton.setText('Play')
    }
    if (this.index >= INSTRUCTIONS.length) {
      localStorage.setItem('warloch-has-seen-about', '1')
      this.scene.start('Game')
    }
  }

  toggleMute() {
    this.sound.mute = !this.sound.mute
    localStorage.setItem('ggj-mute', this.sound.mute ? '' : '1')
    this.muteButton.setFrame(this.sound.mute ? 'unmute.png' : 'mute.png')
  }
}
