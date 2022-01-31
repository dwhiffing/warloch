export class InputHandler {
  constructor(scene) {
    const { W, A, S, D, UP, LEFT, RIGHT, DOWN, SPACE, M, BACKSPACE } =
      Phaser.Input.Keyboard.KeyCodes
    this.scene = scene
    this.input = scene.input
    this.player = scene.player
    this.wKey = this.input.keyboard.addKey(W)
    this.aKey = this.input.keyboard.addKey(A)
    this.sKey = this.input.keyboard.addKey(S)
    this.dKey = this.input.keyboard.addKey(D)
    this.upKey = this.input.keyboard.addKey(UP)
    this.leftKey = this.input.keyboard.addKey(LEFT)
    this.downKey = this.input.keyboard.addKey(DOWN)
    this.rightKey = this.input.keyboard.addKey(RIGHT)
    this.spaceKey = this.input.keyboard.addKey(SPACE)
    this.escKey = this.input.keyboard.addKey(BACKSPACE)
    this.mKey = this.input.keyboard.addKey(M)

    // this.debugKeys = this.input.keyboard.addKeys(
    //   'R,T,Y,U,I,O,P,F,G,H,J,K,L,C,V,B,N,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE',
    // )

    this.reg = this.scene.registry
  }

  createJoystick = (x, y) => {
    return this.scene.plugins.get('rexvirtualjoystickplugin').add(this.scene, {
      x,
      y,
      radius: 30,
      base: this.scene.add
        .circle(0, 0, 35, 0x888888)
        .setDepth(99)
        .setAlpha(0.5),
      thumb: this.scene.add
        .circle(0, 0, 30, 0xcccccc)
        .setDepth(99)
        .setAlpha(0.5),
      enable: true,
      fixed: true,
    })
  }

  createMobileControls = () => {
    this.joysticks = [
      this.createJoystick(80, 200),
      this.createJoystick(420, 200),
    ]
    this.joystickKeys = this.joysticks.map((j) => j.createCursorKeys())
  }

  update() {
    // this.handleDebugKeys()

    if (Phaser.Input.Keyboard.JustDown(this.mKey)) this.scene.hud.toggleMute()

    if (!this.player.active) return

    const pointer = this.scene.input.activePointer
    const { scrollX, scrollY } = this.scene.cameras.main
    this.player.crosshair.setPosition(pointer.x + scrollX, pointer.y + scrollY)
    const speed = this.player.moveSpeed * 1.5
    this.player.setPushable(true)

    if (this.spaceKey.isDown) {
      this.player.transform()
    }

    const js = this.joystickKeys?.[0]

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.scene.scene.start('Menu')
      this.scene.registry.reset()
      this.scene.registry.events.removeAllListeners()
      this.scene.input.removeAllListeners()
      this.scene.game.events.removeAllListeners()
      this.scene.time.removeAllEvents()
    }
    if (this.wKey.isDown || this.upKey.isDown || js?.up.isDown) {
      this.player.setAccelerationY(-speed)
    } else if (this.sKey.isDown || this.downKey.isDown || js?.down.isDown) {
      this.player.setAccelerationY(speed)
    } else {
      this.player.setPushable(false)
    }

    if (this.aKey.isDown || this.leftKey.isDown || js?.left.isDown) {
      this.player.setAccelerationX(-speed)
      this.player.setFlipX(true)
    } else if (this.dKey.isDown || this.rightKey.isDown || js?.right.isDown) {
      this.player.setFlipX(false)
      this.player.setAccelerationX(speed)
    } else {
      this.player.setPushable(false)
    }

    if (!this.joystickKeys) return

    let { x, y } = this.player
    y += 5
    const offset = 15

    if (this.joystickKeys?.[1].up.isDown) {
      y -= offset
    } else if (this.joystickKeys?.[1].down.isDown) {
      y += offset
    }

    if (this.joystickKeys?.[1].left.isDown) {
      x -= offset
    } else if (this.joystickKeys?.[1].right.isDown) {
      x += offset
    }
    this.player.crosshair.setPosition(x, y)
  }

  handleDebugKeys = () => {
    this.onKey('ONE', () => this.player.levelUpgrade('one'))
    this.onKey('TWO', () => this.player.levelUpgrade('two'))
    this.onKey('THREE', () => this.player.levelUpgrade('three'))
    this.onKey('FOUR', () => this.player.levelUpgrade('four'))
    this.onKey('FIVE', () => this.player.levelUpgrade('five'))
    this.onKey('SIX', () => this.player.levelUpgrade('six'))
    this.onKey('SEVEN', () => this.player.levelUpgrade('seven'))
    this.onKey('EIGHT', () => this.player.levelUpgrade('eight'))
    // this.onKey('NINE', () => this.player.levelUpgrade('nine'))

    this.onKey('Y', () => this.player.levelUpgrade('maxHP'))
    this.onKey('U', () => this.player.levelUpgrade('healthRegen'))
    this.onKey('I', () => this.player.levelUpgrade('moveSpeed'))
    this.onKey('O', () => this.player.levelUpgrade('pickupRange'))
    this.onKey('P', () => this.player.levelUpgrade('xpRate'))
    this.onKey('F', () => this.player.levelUpgrade('duplicator'))
    this.onKey('G', () => this.player.levelUpgrade('damageBoost'))
    this.onKey('H', () => this.player.levelUpgrade('fireDelay'))
    this.onKey('J', () => this.player.levelUpgrade('range'))
    this.onKey('K', () => this.player.levelUpgrade('bulletSpeed'))
    this.onKey('L', () => this.player.levelUpgrade('bulletSize'))

    this.onKey('V', () => (this.player.xp += this.player.nextXP))
    this.onKey(
      'B',
      () => (this.player.tp += this.player.form === 'light' ? 100 : -100),
    )
    this.onKey('N', () => (this.scene.registry.values.gameTimer += 60))
  }

  onKey = (key, callback) => {
    if (Phaser.Input.Keyboard.JustDown(this.debugKeys[key])) callback()
  }
}
