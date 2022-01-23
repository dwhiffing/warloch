import { SPRITES } from '../constants'
import { Enemy } from '../sprites/Enemy'

const SPAWN_DISTANCE = 300

export class EnemySpawner {
  constructor(scene) {
    this.scene = scene
    this.target = this.scene.player
    this.physics = this.scene.physics

    this.scene.time.addEvent({
      callback: () => this.spawn(),
      repeat: -1,
      delay: 1000,
    })

    // this.scene.time.addEvent({
    //   callback: () => this.spawn('largeEliteKnight'),
    //   repeat: -1,
    //   delay: 60000,
    // })

    this.enemies = scene.physics.add.group({
      classType: Enemy,
      maxSize: 50,
      runChildUpdate: true,
    })
    this.enemies.createMultiple({ quantity: 50, active: false })
  }

  getClosest = (point) =>
    this.enemies
      .getChildren()
      .filter((e) => e.active)
      .sort(
        (a, b) =>
          Phaser.Math.Distance.BetweenPoints(a, point) -
          Phaser.Math.Distance.BetweenPoints(b, point),
      )

  spawn = (type = 'knight') => {
    const angle = Phaser.Math.RND.angle()
    const vel = this.physics.velocityFromAngle(angle, SPAWN_DISTANCE)
    const x = this.target.x + vel.x
    const y = this.target.y + vel.y

    this.enemies.get()?.spawn(x, y, type)
  }

  update() {}
}
