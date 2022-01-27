import { ENEMIES } from '../constants'
import { Enemy } from '../sprites/Enemy'
import { Explosions } from './Explosions'

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

    this.particles = this.scene.add.particles('tiles')
    this.emitter = this.particles
      .createEmitter({
        frame: ['bit1.png', 'bit1.png', 'bit1.png', 'bit2.png'],
        speed: { min: 60, max: -60 },
        scale: { max: 1.25, min: 0.75 },
        lifespan: { max: 1200, min: 600 },
        alpha: { start: 1, end: 0 },
        rotate: {
          onEmit: (p) => (p.speed = Phaser.Math.RND.between(-2, 2)),
          onUpdate: (p) => p.angle + p.speed,
        },
      })
      .stop()
    // this.emitter.setDepth(3)
    this.particles.setDepth(3)

    this.explosions = new Explosions(this.scene)

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
    let angles = []
    while (angles.length < count) {
      angles.push(Phaser.Math.RND.angle())
      angles = Array.from(new Set(angles))
    }
    for (let i = 0; i < count; i++) {
      const angle = angles[i]
      const vel = this.physics.velocityFromAngle(
        angle,
        Phaser.Math.RND.between(SPAWN_DISTANCE, SPAWN_DISTANCE + 200),
      )
      const x = this.target.x + vel.x
      const y = this.target.y + vel.y
      const typeRoll = Phaser.Math.RND.between(1, 20)
      let type
      Object.entries(this.getSpawnTypes()).forEach(([k, v]) => {
        if (typeRoll >= v) type = k
      })
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
    return [3, 3, 3, 2, 2, 2][this.getLevel()]
  }

  getSpeedMultiplier() {
    return [1, 1, 1.1, 1.15, 1.2, 1.25][this.getLevel()]
  }

  getDamageMultiplier() {
    return [1, 1, 1.5, 2, 2.5, 3][this.getLevel()]
  }

  getHPMultiplier() {
    return [1, 1.5, 2, 3, 4, 5][this.getLevel()]
  }

  getXPMultiplier() {
    return [1, 1, 1, 1, 1, 1][this.getLevel()]
  }

  getSpawnTypes() {
    return [
      { knight: 1 },
      { knight: 1, eliteKnight: 20 },
      { knight: 1, eliteKnight: 19, largeKnight: 20 },
      { knight: 1, eliteKnight: 18, largeKnight: 19 },
      { knight: 1, eliteKnight: 18, largeKnight: 19, largeEliteKnight: 20 },
      { knight: 1, eliteKnight: 18, largeKnight: 19, largeEliteKnight: 20 },
    ][this.getLevel()]
  }

  getSpawnCount() {
    return [
      [5, 8],
      [6, 9],
      [8, 12],
      [8, 12],
      [8, 12],
      [8, 12],
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
