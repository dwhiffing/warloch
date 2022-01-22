const IMPACT_SOUND_TYPES = ['Glass', 'Metal', 'Plate']
const IMPACT_SOUND_SIZES = ['heavy', 'medium', 'light']
const IMPACT_SOUND_COUNT = 5
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

    this.load.audio('chord', 'assets/sounds/pickup.mp3')
    IMPACT_SOUND_TYPES.forEach((type) => {
      IMPACT_SOUND_SIZES.forEach((size) => {
        for (let i = 0; i < IMPACT_SOUND_COUNT; i++) {
          this.load.audio(
            `${type}-${size}-${i}`,
            `assets/sounds/impact/impact${type}_${size}_00${i}.mp3`,
          )
        }
      })
    })
    for (let i = 0; i < 4; i++) {
      this.load.audio(`death-${i}`, `assets/sounds/small_death_${i}.wav`)
    }
    this.load.audio(`shoot`, `assets/sounds/shoot.wav`)
    this.load.audio(`death`, `assets/sounds/death.wav`)
    this.load.audio(`menu-music`, `assets/menu-music.mp3`)
    this.load.audio(`game-music`, `assets/game-music.mp3`)
    this.load.audio(`level`, `assets/sounds/level.wav`)
    this.load.audio(`transform`, `assets/sounds/transform.wav`)
    this.load.audio(`transform2`, `assets/sounds/transform2.wav`)

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