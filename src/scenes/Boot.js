const IMPACT_SOUND_TYPES = ['glass', 'metal']
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

    this.load.bitmapFont('gem', 'assets/gem.png', 'assets/gem.xml')

    this.load.audio('chord', 'assets/sounds/pickup.mp3')
    IMPACT_SOUND_TYPES.forEach((type) => {
      for (let i = 0; i < IMPACT_SOUND_COUNT; i++) {
        this.load.audio(
          `hit-${type}-${i}`,
          `assets/sounds/hit_${type}_${i}.mp3`,
        )
      }
    })
    for (let i = 0; i < 4; i++) {
      this.load.audio(`death-${i}`, `assets/sounds/small_death_${i}.wav`)
    }
    this.load.audio(`shoot`, `assets/sounds/shoot.wav`)
    this.load.audio(`death`, `assets/sounds/death.wav`)
    this.load.audio(`boss-death`, `assets/sounds/defeat_boss.wav`)
    this.load.audio(`spawn-boss`, `assets/sounds/spawn_boss.wav`)
    this.load.audio(`menu-music`, `assets/menu-music.mp3`)
    this.load.audio(`game-music`, `assets/game-music.mp3`)
    this.load.audio(`level`, `assets/sounds/level.wav`)
    this.load.audio(`transform`, `assets/sounds/transform.wav`)
    this.load.audio(`transform2`, `assets/sounds/transform2.wav`)

    this.load.image('title', 'assets/images/title.png')
    this.load.spritesheet('grass', 'assets/images/grass.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.atlas(
      'tiles',
      'assets/images/tiles.png',
      'assets/images/tiles.json',
    )

    this.load.on('complete', () => {
      progress.destroy()
      this.scene.start('Menu', { playMusic: true })
      this.scene.start('Upgrade', { active: true })
    })
  }
}
