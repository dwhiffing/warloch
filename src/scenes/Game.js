import { EnemySpawner } from '../services/EnemySpawner'
import { OrbSpawner } from '../services/OrbSpawner'
import { InputHandler } from '../services/InputHandler'
import { Hud } from '../services/Hud'
import { Player } from '../sprites/Player'
import { SPRITES } from '../constants'
import { createAnim } from '../utils'

const WIDTH = 2240
const HEIGHT = 2240

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.input.mouse.disableContextMenu()

    Object.values(SPRITES).forEach(({ key, name }) =>
      createAnim(this, key, `${name}_Walk_`),
    )

    this.sound.stopAll()
    this.sound.play('game-music', { loop: true, volume: 0.5 })

    this.game.events.addListener(Phaser.Core.Events.BLUR, () => {
      this.scene.pause()
    })
    this.game.events.addListener(Phaser.Core.Events.FOCUS, () => {
      this.scene.resume()
    })
  }

  create() {
    this.physics.world.setBounds(0, 0, WIDTH, HEIGHT)
    this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT)
    this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background').setOrigin(0)

    this.player = this.add.existing(new Player(this, WIDTH / 2, HEIGHT / 2))
    this.cameras.main.startFollow(this.player)

    this.orbSpawner = new OrbSpawner(this)
    this.enemySpawner = new EnemySpawner(this)
    this.inputHandler = new InputHandler(this)

    const enemies = this.enemySpawner.enemies
    const orbs = this.orbSpawner.orbs
    const bullets = this.player.bullets

    this.physics.add.collider(enemies)
    this.physics.add.collider(this.player, enemies, this.hurtPlayer)
    this.physics.add.overlap(bullets, enemies, this.shootEnemy)
    this.physics.add.overlap(this.player, orbs, this.getOrb)

    this.hud = new Hud(this)
  }

  update(time, delta) {
    this.player.update(time, delta)
    this.enemySpawner.update(time, delta)
    this.inputHandler.update(time, delta)
  }

  shootEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return

    enemy.hit(bullet)
    bullet.hit(enemy)
  }

  hurtPlayer(player, enemy) {
    if (!player.active || !enemy.active || enemy.hitTimer > 0) return

    enemy.hitTimer = enemy.hitTimerMax
    player.hp -= enemy.damage
  }

  getOrb(player, orb) {
    if (!player.active || !orb.active) return

    player.xp += orb.value
    orb.hit(player)
  }

  showUpgradeMenu() {
    this.scene.wake('Upgrade')
    this.scene.pause()
  }
}