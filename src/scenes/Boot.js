export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const { height, width } = this.sys.game.config
    const progress = this.add.graphics()
    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(0, height / 2, width * value, 60)
    })

    this.load.image('background', 'assets/images/background.png')
    this.load.atlas(
      'tiles',
      'assets/images/tiles.png',
      'assets/images/tiles.json',
    )

    this.load.on('complete', () => {
      progress.destroy()
      this.scene.start('Menu')
    })
  }
}
