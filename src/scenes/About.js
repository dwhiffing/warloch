import { Button } from '../sprites/Button'

const INSTRUCTIONS = [
  'Use WASD/Arrows to move and your mouse to aim your spells.\n\nDefeat enemies and pick up gems to level up.\n\nWhen you deal enough damage, you will erupt into War form.\n\nWhile War, you cannot be harmed and your spells become chaotic.',
  'Enemies will get stronger as time passes.\n\nWhile War, push enemies around to grab gems and level up quickly.\n\nPick your upgrades wisely and stay ahead of the curve.\n\nGood luck!',
  'Daniel Whiffing - Design, Coding and Sound\n\nSam Braithwaite - Art\n\nAsh Dadoun - Art\n\nCREDIT PLACEHOLDER ARTIST - Art\n\nPurple Planet - Music',
]

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'About' })
  }

  create({ score, playMusic }) {
    this.scoreTexts = []
    const { height, width } = this.game.config

    const w = this.cameras.main.width - 40
    const h = this.cameras.main.height - 40
    const _w = width / 2

    this.index = 0

    this.add.text(_w, 25, 'About', { font: '24px sans-serif' }).setOrigin(0.5)

    this.add.existing(new Button(this, _w - 60, h + 20, 'Back', this.back))

    this.add.existing(new Button(this, _w + 60, h + 20, 'Next', this.next))

    this.text = this.add
      .text(_w, 60, INSTRUCTIONS[0], { font: '16px sans-serif' })
      .setOrigin(0.5, 0)

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

  back = () => {
    this.text.setText(INSTRUCTIONS[--this.index])
    if (this.index < 0) {
      this.scene.start('Menu', { playMusic: false })
    }
  }

  next = () => {
    this.text.setText(INSTRUCTIONS[++this.index])
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
