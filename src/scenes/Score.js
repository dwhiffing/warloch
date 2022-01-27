import { getScores, postScore } from '../services/Score'
import { Button } from '../sprites/Button'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Score' })
  }

  create({ score }) {
    this.scoreTexts = []
    const { height, width } = this.game.config

    const w = this.cameras.main.width - 40
    const h = this.cameras.main.height - 40
    const _w = width / 2
    this.name = localStorage.getItem('ggj22-name')

    this.add
      .text(_w, 15, 'Highscores', { font: '24px sans-serif' })
      .setOrigin(0.5)

    this.add.existing(
      new Button(this, _w + (score ? 60 : 0), h + 20, 'back', this.back),
    )

    this.sound.stopAll()
    this.sound.play('menu-music', { loop: true, volume: 0.5 })
    const muted = localStorage.getItem('ggj-mute') === '1'
    this.muteButton = this.add
      .sprite(w + 20, h + 20, 'tiles', muted ? 'mute.png' : 'unmute.png')
      .setScrollFactor(0)
      .setInteractive()
      .setScale(0.5)
      .on('pointerdown', this.toggleMute.bind(this))

    this.updateScores()

    if (!score) return

    this.add
      .text(_w, h - 30, `Your score: ${score}`, { font: '21px sans-serif' })
      .setOrigin(0.5)

    this.postButton = this.add
      .existing(
        new Button(this, _w - 60, h + 20, 'post score', () =>
          this.postScore(score),
        ),
      )
      .setAlpha(this.name ? 1 : 0.5)
  }

  update() {}

  updateScores = () => {
    getScores().then((scores) => {
      scores.forEach(([name, score], i) => {
        let scoreText =
          this.scoreTexts[i] ||
          this.add
            .text(this.cameras.main.width / 2, 41 + 15 * i, '', {
              font: '12px sans-serif',
            })
            .setOrigin(0.5)
        this.scoreTexts[i] = scoreText
        scoreText.setText(`${i + 1}. ${score} - ${name}`)
      })
    })
  }

  postScore = (score) => {
    this.name = prompt('Name?', localStorage.getItem('ggj22-name'))

    postScore({ playerName: this.name, score }).then(this.updateScores)
  }

  back = () => {
    this.scene.start('Menu')
  }

  toggleMute() {
    this.sound.mute = !this.sound.mute
    localStorage.setItem('ggj-mute', this.sound.mute ? '' : '1')
    this.muteButton.setFrame(this.sound.mute ? 'unmute.png' : 'mute.png')
  }
}
