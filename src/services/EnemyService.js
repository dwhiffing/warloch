import { Enemy } from '../sprites/Enemy'

export class EnemyService {
  constructor(scene) {
    this.scene = scene
    this.spawnRate = 50
    this.spawnTimer = this.spawnRate
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
    let roll = Phaser.Math.RND.between(1, 20)
    roll += -10 + this.scene.player.level
    if (roll <= 14) {
      type = Phaser.Math.RND.weightedPick(['knight'])
    } else if (roll <= 16) {
      type = Phaser.Math.RND.weightedPick(['heavyKnight'])
    } else if (roll <= 19) {
      type = Phaser.Math.RND.weightedPick(['eliteKnight'])
    } else {
      type = Phaser.Math.RND.weightedPick(['largeEliteKnight', 'executioner'])
    }
    this.enemies.get()?.spawn(x, y, type)
  }

  update() {
    if (this.spawnTimer-- > 0) return

    this.spawnTimer = this.spawnRate
    const vel = this.physics.velocityFromAngle(Phaser.Math.RND.angle(), 300)
    this.spawn(this.target.x + vel.x, this.target.y + vel.y)
  }
}
