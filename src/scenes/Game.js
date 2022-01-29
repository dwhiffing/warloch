import { EnemySpawner } from '../services/EnemySpawner'
import { OrbSpawner } from '../services/OrbSpawner'
import { InputHandler } from '../services/InputHandler'
import { Hud } from '../services/Hud'
import { Player } from '../sprites/Player'
import { BACKGROUND_TILES, SPRITES } from '../constants'
import { createAnim } from '../utils'

const WIDTH = 800
const HEIGHT = 800

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.input.mouse.disableContextMenu()

    SPRITES.forEach((sprite) => createAnim(this, sprite))
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
    this.postFxPlugin = this.plugins.get('rexglowfilterpipelineplugin')
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
    this.events.on('resume', this.saveGame)

    this.time.addEvent({ repeat: -1, delay: 15000, callback: this.saveGame })

    this.physics.world.setBounds(0, 0, WIDTH, HEIGHT)
    this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT)

    let data = []
    for (let y = 0; y < Math.floor(WIDTH / 16); y++) {
      let row = []
      for (let x = 0; x < Math.floor(HEIGHT / 16); x++) {
        row.push(Phaser.Math.RND.weightedPick(BACKGROUND_TILES))
      }
      data.push(row)
    }
    const map = this.make.tilemap({ data, tileWidth: 16, tileHeight: 16 })
    map.createLayer(0, map.addTilesetImage('grass'), 0, 0)

    this.player = this.add.existing(new Player(this, WIDTH / 2, HEIGHT / 2))
    this.player.init()
    this.cameras.main.startFollow(this.player)

    this.orbSpawner = new OrbSpawner(this)
    this.enemySpawner = new EnemySpawner(this)
    this.inputHandler = new InputHandler(this)

    const enemies = this.enemySpawner.enemies
    const enemyBullets = this.enemySpawner.gun.bullets
    const orbs = this.orbSpawner.orbs
    const bullets = this.player.bullets

    this.physics.add.collider(enemies)
    this.physics.add.collider(this.player, enemies)
    this.physics.add.overlap(enemyBullets, this.player, this.shootPlayer)
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

  shootPlayer(player, bullet) {
    if (!bullet.active || bullet.dying) return
    player.hit(bullet.damage)
    bullet.hit(player)
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
    const save = localStorage.getItem('warloch-save')
    if (save) {
      Object.entries(JSON.parse(save)).forEach(([k, v]) => {
        this.registry.set(k, v)
      })
    }

    return !!save
  }

  saveGame = () => {
    localStorage.setItem('warloch-save', JSON.stringify(this.registry.values))
  }
}
