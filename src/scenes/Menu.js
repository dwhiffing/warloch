export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts = {}) {
    this.score = opts.score || 0
  }

  create() {
    const { height, width } = this.game.config

    // this.music = this.sound.add('title', { loop: true, volume: 0.4 })
    // this.music.play()

    // this.background = this.add.tileSprite(
    //   width / 2,
    //   height / 2,
    //   width,
    //   height,
    //   'background',
    // )
    // this.background.tileScaleX = 3.5
    // this.background.tileScaleY = 3.5

    // this.title = this.add.image(width / 2, 100, 'title')
    // this.title.setOrigin(0.5, 0)
    // this.title.setScale(0.65)

    // if (this.score) {
    //   this.scoreText = this.add
    //     .text(width / 2, height / 2, `Score: ${this.score}`, {
    //       fontSize: 100,
    //       align: 'center',
    //       color: '#ffffff',
    //     })
    //   this.scoreText.setOrigin(0.5)
    // }

    this.add
      .sprite(width / 2, height / 2, 'tiles', 'bar.png')
      .setScale(1.2)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Game', { lives: 3 })
      })
  }
}
