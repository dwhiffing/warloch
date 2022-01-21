import { SPRITES } from '../constants'
import { Enemy } from '../sprites/Enemy'

const SPAWN_DISTANCE = 300

export class EnemyService {
  constructor(scene) {
    this.scene = scene
    this.scene.registry.set('spawnRate', 1)
    this.spawnTimer = 0
    this.enemies = this.scene.physics.add.group({
      classType: Enemy,
      maxSize: 50,
      runChildUpdate: true,
    })

    this.enemies.createMultiple({ quantity: 50, active: false })
    this.target = this.scene.player
    this.physics = this.scene.physics
  }

  spawn(x, y) {
    let type
    let roll =
      Phaser.Math.RND.between(1, 20) - 10 + this.scene.registry.get('level')

    Object.entries(SPRITES)
      .filter(([k, v]) => v.type === 'enemy' && roll >= v.roll)
      .forEach(([k, v]) => (type = v.key))
    this.enemies.get()?.spawn(x, y, type)
  }

  update() {
    if (this.spawnTimer-- > 0) return

    const vel = this.physics.velocityFromAngle(
      Phaser.Math.RND.angle(),
      SPAWN_DISTANCE,
    )
    this.spawn(this.target.x + vel.x, this.target.y + vel.y)
    this.spawnTimer = this.spawnRate
  }

  get spawnRate() {
    return 60 - this.scene.registry.get('spawnRate') * 10
  }
}
