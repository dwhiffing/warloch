import { CameraService } from '../services/cameraService'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.input.mouse.disableContextMenu()
    this.cameraService = new CameraService(this)

    this.createAnim('knight', 'Knight')
    this.createAnim('eliteKnight', 'EliteKnight')
    this.createAnim('largeEliteKnight', 'LargeEliteKnight')
    this.createAnim('executioner', 'Executioner')
    this.createAnim('heavyKnight', 'HeavyKnight')
    this.createAnim('player', 'Mage')
    this.add.sprite(20, 20, 'tiles').play('knight')
    this.add.sprite(40, 20, 'tiles').play('eliteKnight')
    this.add.sprite(60, 20, 'tiles').play('largeEliteKnight')
    this.add.sprite(80, 20, 'tiles').play('executioner')
    this.add.sprite(100, 20, 'tiles').play('heavyKnight')
    this.add.sprite(120, 20, 'tiles').play('player')
  }

  createAnim(key, prefix) {
    this.anims.create({
      key,
      frames: this.anims.generateFrameNames('tiles', {
        prefix: `${prefix}_Walk_`,
        suffix: '.png',
        start: 1,
        end: 4,
      }),
      repeat: -1,
    })
  }

  create() {}

  update(time, delta) {
    this.cameraService.update(delta)
  }
}
