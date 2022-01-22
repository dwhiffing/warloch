import { SPRITES } from '../constants'
import { Enemy } from '../sprites/Enemy'

const SPAWN_DISTANCE = 300

export class EnemySpawner {
  constructor(scene) {
    this.scene = scene
    this.target = this.scene.player
    this.physics = this.scene.physics
    this.spawnTimer = 0

    this.enemies = scene.physics.add.group({
      classType: Enemy,
      maxSize: 50,
      runChildUpdate: true,
    })
    this.enemies.createMultiple({ quantity: 50, active: false })
  }

  spawn = () => {
    const angle = Phaser.Math.RND.angle()
    const vel = this.physics.velocityFromAngle(angle, SPAWN_DISTANCE)
    const x = this.target.x + vel.x
    const y = this.target.y + vel.y

    const roll = Phaser.Math.RND.between(1, 20) - 10 + this.target.level
    const spawns = Object.values(SPRITES).filter(
      (s) => s.type === 'enemy' && roll >= s.roll,
    )
    const type = spawns[spawns.length - 1].key

    this.enemies.get()?.spawn(x, y, type)
  }

  update() {
    if (this.spawnTimer-- > 0) return

    this.spawn()
    this.spawnTimer = this.spawnRate
  }

  get spawnRate() {
    return 100
  }
}
