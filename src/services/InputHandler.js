export class InputHandler {
  constructor(scene) {
    const { W, A, S, D, SPACE } = Phaser.Input.Keyboard.KeyCodes
    this.scene = scene
    this.input = scene.input
    this.player = scene.player
    this.upKey = this.input.keyboard.addKey(W)
    this.leftKey = this.input.keyboard.addKey(A)
    this.downKey = this.input.keyboard.addKey(S)
    this.rightKey = this.input.keyboard.addKey(D)
    this.spaceKey = this.input.keyboard.addKey(SPACE)

    this.debugKeys = this.input.keyboard.addKeys(
      'R,T,Y,U,I,O,P,F,G,H,J,K,L,M,C,V,B,N,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE',
    )
    this.input.on('pointerdown', () => (this.scene.isMouseDown = true))
    this.input.on('pointerup', () => (this.scene.isMouseDown = false))

    this.reg = this.scene.registry
    this.onKey = (key, callback) => {
      if (Phaser.Input.Keyboard.JustDown(this.debugKeys[key])) callback()
    }
  }

  update() {
    this.onKey('ONE', () => this.player.levelUpgrade('one'))
    this.onKey('TWO', () => this.player.levelUpgrade('two'))
    this.onKey('THREE', () => this.player.levelUpgrade('three'))
    this.onKey('FOUR', () => this.player.levelUpgrade('four'))
    this.onKey('FIVE', () => this.player.levelUpgrade('five'))
    this.onKey('SIX', () => this.player.levelUpgrade('six'))
    this.onKey('SEVEN', () => this.player.levelUpgrade('seven'))
    this.onKey('EIGHT', () => this.player.levelUpgrade('eight'))
    this.onKey('NINE', () => this.player.levelUpgrade('nine'))

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
    this.onKey('M', () => this.scene.hud.toggleMute())

    const speed = this.player.moveSpeed * 1.5
    this.player.setPushable(true)

    if (this.spaceKey.isDown) {
      this.player.transform()
    }

    if (this.upKey.isDown) {
      this.player.setAccelerationY(-speed)
    } else if (this.downKey.isDown) {
      this.player.setAccelerationY(speed)
    } else {
      this.player.setPushable(false)
    }

    if (this.leftKey.isDown) {
      this.player.setAccelerationX(-speed)
      this.player.setFlipX(true)
    } else if (this.rightKey.isDown) {
      this.player.setFlipX(false)
      this.player.setAccelerationX(speed)
    } else {
      this.player.setPushable(false)
    }
  }
}
