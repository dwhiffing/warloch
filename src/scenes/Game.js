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

    SPRITES.forEach(({ key, name }) => createAnim(this, key, `${name}_Walk_`))
    this.anims.create({
      key: 'goblin',
      frames: [{ key: 'tiles', frame: 'goblin.png' }],
      repeat: -1,
    })
    this.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNames('tiles', {
        prefix: 'explosion',
        suffix: '.png',
        start: 0,
        end: 3,
      }),
    })

    this.sound.stopAll()
    this.sound.play('game-music', { loop: true, volume: 0.5 })
  }

  create({ newGame }) {
    const hasSave = this.loadGame()

    if (newGame || !hasSave) {
      this.registry.events.removeAllListeners()
      this.game.events.removeAllListeners()
      this.time.removeAllEvents()
      this.registry.reset()
      this.registry.set('gameTimer', 0)
      this.registry.set('score', 0)
      this.registry.set('killCount', 0)
    }

    this.game.events.addListener(Phaser.Core.Events.BLUR, this.pause)
    this.game.events.addListener(Phaser.Core.Events.FOCUS, this.unpause)

    this.time.addEvent({ repeat: -1, delay: 15000, callback: this.saveGame })

    this.physics.world.setBounds(0, 0, WIDTH, HEIGHT)
    this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT)
    this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background').setOrigin(0)

    this.player = this.add.existing(new Player(this, WIDTH / 2, HEIGHT / 2))
    this.player.init()
    this.cameras.main.startFollow(this.player)

    this.orbSpawner = new OrbSpawner(this)
    this.enemySpawner = new EnemySpawner(this)
    this.inputHandler = new InputHandler(this)

    const enemies = this.enemySpawner.enemies
    const orbs = this.orbSpawner.orbs
    const bullets = this.player.bullets

    this.physics.add.collider(enemies)
    this.physics.add.collider(this.player, enemies)
    this.physics.add.overlap(bullets, enemies, this.shootEnemy)
    this.physics.add.overlap(this.player, orbs, this.getOrb)

    if (newGame || !hasSave) {
      this.player.levelUpgrade('one')
    }

    this.hud = new Hud(this)
  }

  pause = () => {
    if (this.scene.isPaused()) return
    this.shouldUnpause = true
    this.scene.pause()
  }

  unpause = () => {
    if (!this.shouldUnpause) return
    this.shouldUnpause = false
    this.scene.resume()
  }

  update(time, delta) {
    this.player.update(time, delta)
    this.enemySpawner.update(time, delta)
    this.inputHandler.update(time, delta)
  }

  shootEnemy(bullet, enemy) {
    if (!bullet.active || bullet.dying || !enemy.active) return
    enemy.hit(bullet)
    bullet.hit(enemy)
  }

  getOrb(player, orb) {
    if (!player.active || !orb.active) return

    player.xp += orb.value * player.xpRate
    orb.hit(player)
  }

  showUpgradeMenu() {
    this.scene.pause()
    this.scene.wake('Upgrade')
  }

  loadGame = () => {
    const save = localStorage.getItem('ggj22-save')
    if (save) {
      Object.entries(JSON.parse(save)).forEach(([k, v]) => {
        this.registry.set(k, v)
      })
    }

    return !!save
  }

  saveGame = () => {
    localStorage.setItem('ggj22-save', JSON.stringify(this.registry.values))
  }
}
