import { Enemy } from '../sprites/Enemy'

export class EnemyService {
  constructor(scene) {
    this.scene = scene
    this.spawnTimer = 100
    this.enemies = this.scene.physics.add.group({
      classType: Enemy,
      maxSize: 20,
      runChildUpdate: true,
    })
    this.enemies.createMultiple({ quantity: 20, active: false })
    this.target = this.scene.player
    this.physics = this.scene.physics
  }

  spawn(x, y) {
    this.enemies.get()?.spawn(x, y)
  }

  update() {
    if (this.spawnTimer-- > 0) return
    console.log('wtf')

    this.spawnTimer = 100
    const vel = this.physics.velocityFromAngle(Phaser.Math.RND.angle(), 300)
    this.spawn(this.target.x + vel.x, this.target.y + vel.y)
  }
}
