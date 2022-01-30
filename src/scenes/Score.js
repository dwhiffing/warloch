import { getScores, postScore } from '../services/Score'
import { Button } from '../sprites/Button'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Score' })
  }

  create({ score, playMusic }) {
    this.scoreTexts = []
    this.currentScore = score
    const { height, width } = this.game.config

    const w = this.cameras.main.width - 20
    const h = this.cameras.main.height - 20
    const _w = width / 2
    this.name = localStorage.getItem('warloch-name')

    this.add.bitmapText(_w, 20, 'gem', 'Highscores').setOrigin(0.5)

    this.add.existing(
      new Button(this, _w + (score ? 60 : 0), h, 'Back', this.back),
    )

    if (playMusic) {
      this.sound.stopAll()
      this.sound.play('menu-music', { loop: true, volume: 0.5 })
    }
    const muted = localStorage.getItem('ggj-mute') === '1'
    this.muteButton = this.add
      .sprite(w + 10, h + 10, 'tiles', muted ? 'mute.png' : 'unmute.png')
      .setScrollFactor(0)
      .setInteractive()
      .setScale(0.5)
      .on('pointerdown', this.toggleMute.bind(this))

    this.updateScores()

    this.currentScoreText = this.add
      .bitmapText(_w, h - 30, 'gem', ``)
      .setScale(0.5)
      .setOrigin(0.5)

    if (!score) return

    this.postButton = this.add.existing(
      new Button(this, _w - 60, h, 'Post Score', () => this.postScore(score)),
    )
  }

  update() {}

  updateScores = () => {
    getScores().then(({ score, top } = {}) => {
      if (!this.cameras.main) return
      top.forEach(([name, _score], i) => {
        let scoreText =
          this.scoreTexts[i] ||
          this.add
            .bitmapText(150, 50 + 15 * i, 'gem', '')
            .setScale(0.5)
            .setOrigin(0, 0.5)
        this.scoreTexts[i] = scoreText
        this.currentScoreText.setText(
          score && this.currentScore
            ? `Last Game: ${this.currentScore}. Your Highest: ${score}`
            : score
            ? ` Your High Score: ${score}`
            : this.currentScore
            ? `Last Game: ${this.currentScore} `
            : '',
        )
        scoreText.setText(`${i + 1}. ${_score} - ${name}`)
      })
    })
  }

  postScore = (score) => {
    if (this.postButton.alpha < 1) return
    this.name = prompt(
      'Enter your name (6 chars max)',
      localStorage.getItem('warloch-name') || 'Enter Name',
    )
    this.name = this.name.replaceAll(' ', '')
    if (this.name === '' || this.name.length > 6) return
    localStorage.setItem('warloch-name', this.name)
    postScore({ playerName: this.name, score }).then(this.updateScores)
    this.postButton.setAlpha(0.5)
  }

  back = () => {
    this.scene.start('Menu', { playMusic: false })
  }

  toggleMute() {
    this.sound.mute = !this.sound.mute
    localStorage.setItem('ggj-mute', this.sound.mute ? '' : '1')
    this.muteButton.setFrame(this.sound.mute ? 'unmute.png' : 'mute.png')
  }
}
