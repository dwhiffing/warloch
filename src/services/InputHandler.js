export class InputHandler {
  constructor(scene) {
    const { W, A, S, D } = Phaser.Input.Keyboard.KeyCodes
    this.scene = scene
    this.input = scene.input
    this.player = scene.player
    this.upKey = this.input.keyboard.addKey(W)
    this.leftKey = this.input.keyboard.addKey(A)
    this.downKey = this.input.keyboard.addKey(S)
    this.rightKey = this.input.keyboard.addKey(D)

    this.debugKeys = this.input.keyboard.addKeys(
      'T,Y,U,I,O,P,F,G,H,J,K,L,M,C,V,B,N,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT',
    )
    this.input.on('pointerdown', () => (this.scene.isMouseDown = true))
    this.input.on('pointerup', () => (this.scene.isMouseDown = false))

    this.reg = this.scene.registry
    this.onKey = (key, callback) => {
      if (Phaser.Input.Keyboard.JustDown(this.debugKeys[key])) callback()
    }
  }

  update() {
    this.onKey('ONE', () => this.scene.player.unlockWeapon(1))
    this.onKey('TWO', () => this.scene.player.unlockWeapon(2))
    this.onKey('THREE', () => this.scene.player.unlockWeapon(3))
    this.onKey('FOUR', () => this.scene.player.unlockWeapon(4))
    this.onKey('FIVE', () => this.scene.player.unlockWeapon(5))
    this.onKey('SIX', () => this.scene.player.unlockWeapon(6))
    this.onKey('SEVEN', () => this.scene.player.unlockWeapon(7))
    this.onKey('EIGHT', () => this.scene.player.unlockWeapon(8))

    this.onKey('F', () => this.reg.inc('duplicator'))
    this.onKey('G', () => this.reg.inc('damageBoost'))
    this.onKey('H', () => this.reg.inc('fireDelay'))
    this.onKey('J', () => this.reg.inc('range'))
    this.onKey('K', () => this.reg.inc('bulletSpeed'))
    this.onKey('L', () => this.reg.inc('bulletSize'))

    this.onKey('P', () => (this.player.xp += 100))
    this.onKey('O', () => (this.player.tp += 99))
    this.onKey('I', () => {
      for (let i = 0; i < 10; i++) this.scene.enemySpawner.spawn()
    })
    this.onKey('M', () => this.scene.hud.toggleMute())

    if (this.upKey.isDown) {
      this.player.setVelocityY(-this.player.moveSpeed)
    } else if (this.downKey.isDown) {
      this.player.setVelocityY(this.player.moveSpeed)
    }

    if (this.leftKey.isDown) {
      this.player.setVelocityX(-this.player.moveSpeed)
      this.player.setFlipX(true)
    } else if (this.rightKey.isDown) {
      this.player.setFlipX(false)
      this.player.setVelocityX(this.player.moveSpeed)
    }
  }
}
