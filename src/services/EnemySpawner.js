import { ENEMIES } from '../constants'
import { Enemy } from '../sprites/Enemy'
import { Explosions } from './Explosions'
import { Gun } from './Gun'

export class EnemySpawner {
  constructor(scene) {
    this.scene = scene
    this.target = this.scene.player
    this.physics = this.scene.physics
    this.spawnTimer = 3

    this.gun = new Gun(this.scene, 'enemy')
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

    this.particles.setDepth(3)

    this.explosions = new Explosions(this.scene)

    this.enemies = scene.physics.add.group({
      classType: Enemy,
      maxSize: 150,
      runChildUpdate: true,
    })
    this.enemies.createMultiple({ quantity: 150, active: false })

    this.scene.time.addEvent({ callback: this.tick, repeat: -1, delay: 1000 })

    this.spawnRandom()
  }

  update() {
    this.gun.update()
  }

  tick = () => {
    if (
      this.scene.registry.get('gameTimer') %
        (this.target.form === 'light' ? 3 : 1) ===
      0
    )
      this.spawnRandom()
    this.scene.registry.inc('gameTimer')
  }

  spawnRandom = () => {
    // spawn a percentage of the enemies needed to get to target density
    let targetDensity = [50, 70, 90, 110, 130, 150][this.getLevel()]
    if (this.scene.player.form === 'dark') targetDensity *= 2
    const numLiving = this.enemies.getChildren().filter((e) => e.active).length
    const count = Math.floor((targetDensity - numLiving) * 0.33)

    const dist = 300
    const vel = this.physics.velocityFromAngle(Phaser.Math.RND.angle(), dist)
    const circle = new Phaser.Geom.Circle(
      this.target.x + vel.x,
      this.target.y + vel.y,
      50,
    )
    for (let i = 0; i < count; i++) {
      const { x, y } = circle.getRandomPoint()
      // TODO: ensure a consistent distribution of strong vs weak enemies
      this.spawn(x, y, this.getType())
    }
  }

  spawn = (x, y, type) => {
    const stats = { ai: 'normal', particleScale: 1, ...ENEMIES[type] }
    stats.hp *= this.getHPMultiplier()
    stats.xp *= this.getXPMultiplier()
    stats.speed *= this.getSpeedMultiplier()
    stats.damage *= this.getDamageMultiplier()
    this.enemies.get()?.spawn(x, y, stats)
  }

  getRandomAngles = (count) => {
    let angles = []
    while (angles.length < count)
      angles = Array.from(new Set([...angles, Phaser.Math.RND.angle()]))
    return angles
  }

  getType = () => {
    const typeRoll = Phaser.Math.RND.between(1, 20)
    let type
    Object.entries(this.getSpawnTypes()).forEach(([k, v]) => {
      if (typeRoll >= v) type = k
    })
    return type
  }

  getSpeedMultiplier() {
    return [1, 1.1, 1.15, 1.2, 1.25][this.getLevel()]
  }

  getDamageMultiplier() {
    return [1, 1.5, 2, 2.5, 3][this.getLevel()]
  }

  getHPMultiplier() {
    return [1, 1.5, 2, 3, 4][this.getLevel()]
  }

  getXPMultiplier() {
    return [1, 1.25, 1.5, 1.75, 2][this.getLevel()]
  }

  getSpawnTypes() {
    return [
      { slime_small: 1, gremlin: 17 },
      { slime_small: 1, gremlin: 15, skull_small: 15, slime_big: 18 },
      { slime_small: 1, gremlin: 8, skull_small: 14, knight: 17, goblin: 19 },
      // prettier-ignore
      { slime_small: 1, gremlin: 6, skull_small: 13, knight: 16, goblin: 18, largeKnight: 19 },
      // prettier-ignore
      { slime_small: 1, gremlin: 6, skull_small: 11, knight: 15, goblin: 18, largeKnight: 19, largeEliteKnight: 20, },
    ][this.getLevel()]
  }

  getLevel() {
    const timer = this.scene.registry.get('gameTimer')
    // 0-2 minutes
    if (timer < 120) return 0
    // 2-5 minutes
    else if (timer < 300) return 1
    // 5-10 minutes
    else if (timer < 600) return 2
    // 10-15 minutes
    else if (timer < 900) return 3
    // 15+ minutes
    else return 4
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
}
