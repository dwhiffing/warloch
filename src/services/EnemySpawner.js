import { ENEMIES } from '../constants'
import { Enemy } from '../sprites/Enemy'

const SPAWN_DISTANCE = 300
// fodder are always slow, weak, small, and collide
// moderate are flyers or enhanced fodder
// strong/elite can shoot at player or perform other attacks

// enemy types:
// basic melee
// flying melee (moves fasters, swoops by player, doesnt collide with others)
// ranged (shoots attacks at player occasionally)
// boss: (has way more health than usual, moves way slower)

export class EnemySpawner {
  constructor(scene) {
    this.scene = scene
    this.target = this.scene.player
    this.physics = this.scene.physics
    this.spawnTimer = 3

    this.enemies = scene.physics.add.group({
      classType: Enemy,
      maxSize: 300,
      runChildUpdate: true,
    })
    this.enemies.createMultiple({ quantity: 300, active: false })

    this.scene.time.addEvent({
      callback: () => this.tick(),
      repeat: -1,
      delay: 1000,
    })

    this.spawn(5)
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

  spawn = (count = 1) => {
    for (let i = 0; i < count; i++) {
      console.log('spawn')
      const angle = Phaser.Math.RND.angle()
      const vel = this.physics.velocityFromAngle(angle, SPAWN_DISTANCE)
      const x = this.target.x + vel.x
      const y = this.target.y + vel.y
      const type = Phaser.Math.RND.pick(this.getSpawnTypes())
      const stats = { ...ENEMIES[type] }

      stats.hp *= this.getHPMultiplier()
      stats.xp *= this.getXPMultiplier()
      stats.speed *= this.getSpeedMultiplier()
      stats.damage *= this.getDamageMultiplier()
      this.enemies.get()?.spawn(x, y, stats)
    }
  }

  tick = () => {
    if (this.spawnTimer++ >= this.getSpawnTimer()) {
      this.spawnTimer = 0

      this.spawn(Phaser.Math.RND.between(...this.getSpawnCount()))
    }

    this.scene.registry.inc('gameTimer')
  }

  getSpawnTimer() {
    return [3, 3, 3, 2, 2, 1][this.getLevel()]
  }

  getSpeedMultiplier() {
    return [1, 1, 1.1, 1.2, 1.3, 1.4][this.getLevel()]
  }

  getDamageMultiplier() {
    return [1, 1, 1.5, 2, 2.5, 3][this.getLevel()]
  }

  getHPMultiplier() {
    return [1, 1, 1.5, 2, 3, 4][this.getLevel()]
  }

  getXPMultiplier() {
    return [1, 1, 1, 1, 1, 1][this.getLevel()]
  }

  getSpawnTypes() {
    return [
      ['knight'], // 100% fodder
      ['knight'], // 70% fodder, 30% moderate
      ['knight'], // 50% fodder, 40% moderate, 10% strong
      ['knight'], // 25% fodder, 60% moderate, 15% strong
      ['knight'], // 20% fodder, 50% moderate, 25% strong, 5% elite
      ['knight'], // 20% fodder, 50% moderate, 25% strong, 5% elite
    ][this.getLevel()]
  }

  getSpawnCount() {
    return [
      [3, 6],
      [5, 8],
      [7, 12],
      [10, 18],
      [20, 30],
      [26, 42],
    ][this.getLevel()]
  }

  getLevel() {
    const timer = this.scene.registry.get('gameTimer')
    // 0-60 seconds
    if (timer < 60) return 0
    // 1-2 minutes
    else if (timer < 120) return 1
    // 2-5 minutes
    else if (timer < 300) return 2
    // 5-10 minutes
    else if (timer < 600) return 3
    // 10-20 minutes
    else if (timer < 900) return 4
    // 20+ minutes
    else return 5
  }

  update() {}
}
