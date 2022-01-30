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

    this.walkers = scene.physics.add.group({
      classType: Enemy,
      maxSize: 150,
      runChildUpdate: true,
    })

    this.walkers.createMultiple({ quantity: 150, active: false })

    this.flyers = scene.physics.add.group({
      classType: Enemy,
      maxSize: 100,
      runChildUpdate: true,
    })
    this.flyers.createMultiple({ quantity: 100, active: false })

    this.smallSlimes = scene.physics.add.group({
      classType: Enemy,
      maxSize: 50,
      runChildUpdate: true,
    })
    this.smallSlimes.createMultiple({ quantity: 50, active: false })

    this.spawnDistance = 300

    this.scene.time.addEvent({ callback: this.tick, repeat: -1, delay: 1000 })

    this.spawnGroup()
  }

  update() {
    this.gun.update()
  }

  tick = () => {
    this.scene.registry.inc('gameTimer')
    const spawnRate = this.target.form === 'light' ? 3 : 1
    if (this.scene.registry.get('gameTimer') % 20 === 0) {
      this.spawnRing()
    }
    if (this.scene.registry.get('gameTimer') % 60 === 0) {
      this.spawnBoss()
    }
    if (this.scene.registry.get('gameTimer') % spawnRate === 0) {
      this.spawnGroup()
    }
  }

  spawnGroup = (x, y, type, count = this.getSpawnCount()) => {
    // TODO: sometimes, the whole group should be a single type of uniques
    let size = [50, 50, 60, 70, 80][this.getLevel()]
    const uniqueCount = Phaser.Math.Clamp(
      Math.floor(count / this.getUniqueRatio()),
      1,
      10,
    )
    const dist = this.spawnDistance
    if (!x || !y) {
      do {
        let vel = this.physics.velocityFromAngle(Phaser.Math.RND.angle(), dist)
        x = this.target.x + vel.x
        y = this.target.y + vel.y
      } while (this.scene.cameras.main.worldView.contains(x, y))
    }
    const circle = new Phaser.Geom.Circle(x, y, size)
    for (let i = 0; i < count; i++) {
      const { x, y } = circle.getRandomPoint()
      const key = i >= count - uniqueCount ? 'unique' : 'fodder'
      const _type =
        type || Phaser.Math.RND.weightedPick(this.getSpawnTypes()[key])
      this.spawn(x, y, _type)
    }
  }

  spawnBoss = () => {
    const count = 1
    for (let i = 0; i < count; i++) {
      const dist = this.spawnDistance
      const vel = this.physics.velocityFromAngle(Phaser.Math.RND.angle(), dist)
      const x = this.target.x + vel.x
      const y = this.target.y + vel.y
      const type = Phaser.Math.RND.weightedPick(this.getSpawnTypes().boss)
      if (type) this.spawn(x, y, type)
    }
  }

  spawnRing = (type, count) => {
    count = count || Phaser.Math.Clamp(this.getSpawnCount() * 4, 0, 20)
    type = type || Phaser.Math.RND.weightedPick(this.getSpawnTypes().fodder)
    if (count < 8) return
    let angles = []
    for (let i = -180; i < 180; i += 360 / count) {
      angles.push(i)
    }
    angles.forEach((angle) => {
      const dist = 300
      const vel = this.physics.velocityFromAngle(angle, dist)
      this.spawn(this.target.x + vel.x, this.target.y + vel.y, type)
    })
  }

  spawn = (x, y, type) => {
    const stats = {
      ai: 'normal',
      particleScale: 1,
      scale: 1,
      depth: 2,
      ...ENEMIES[type],
    }
    stats.hp *= this.getHPMultiplier()
    stats.xp *= this.getXPMultiplier()
    stats.speed *= this.getSpeedMultiplier()
    stats.damage *= this.getDamageMultiplier()
    const group =
      stats.ai === 'flying'
        ? 'flyers'
        : stats.type === 'slime_small'
        ? 'smallSlimes'
        : 'walkers'
    this[group].get()?.spawn(x, y, stats)
  }

  getSpawnCount = () => {
    // spawn a percentage of the walkers needed to get to target density
    let targetDensity = [60, 70, 80, 80, 90][this.getLevel()]
    if (this.target.form === 'dark') targetDensity *= 1.2
    let ratio = 0.2
    const numLiving = this.getAllChildren().filter((e) => e.active).length
    let count = Math.floor((targetDensity - numLiving) * ratio)
    return count < 4 ? 0 : count
  }

  getAllChildren() {
    return [...this.walkers.getChildren(), ...this.flyers.getChildren()]
  }

  getSpeedMultiplier() {
    return [1, 1.1, 1.15, 1.2, 1.25][this.getLevel()]
  }

  getDamageMultiplier() {
    return [1, 1.5, 2, 2.5, 3][this.getLevel()]
  }

  getHPMultiplier() {
    return [1, 2, 3, 4, 5][this.getLevel()]
  }

  getXPMultiplier() {
    return [1, 1.5, 2, 2.5, 3][this.getLevel()]
  }

  getUniqueRatio() {
    return [4, 3, 2, 2, 2][this.getLevel()]
  }

  getSpawnTypes() {
    return [
      // prettier-ignore
      { fodder: ['slime_small'], unique: ['goblin_small'], boss: ['slime_jumbo'], },
      // prettier-ignore
      { fodder: ['slime_small', 'goblin_small'], unique: ['slime_big', 'knight_small'], boss: ['goblin_big'] },
      // prettier-ignore
      { fodder: ['goblin_small', 'slime_big'], unique: ['skull_small', 'knight_small'], boss: ['knight_big'] },
      // prettier-ignore
      { fodder: ['knight_small', 'goblin_small'], unique: ['skull_big', 'knight_big'], boss: ['goblin_jumbo', 'knight_jumbo'] },
      // prettier-ignore
      { fodder: ['skull_small', 'knight_small'], unique: ['skull_big', 'knight_big', 'goblin_big'], boss: ['goblin_jumbo', 'knight_jumbo'] },
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
    this.getAllChildren()
      .filter((e) => e.active)
      .sort(
        (a, b) =>
          Phaser.Math.Distance.BetweenPoints(a, point) -
          Phaser.Math.Distance.BetweenPoints(b, point),
      )
}
