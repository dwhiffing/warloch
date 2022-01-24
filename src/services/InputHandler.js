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
    this.onKey('ONE', () => this.scene.player.levelWeapon('one'))
    this.onKey('TWO', () => this.scene.player.levelWeapon('two'))
    this.onKey('THREE', () => this.scene.player.levelWeapon('three'))
    this.onKey('FOUR', () => this.scene.player.levelWeapon('four'))
    this.onKey('FIVE', () => this.scene.player.levelWeapon('five'))
    this.onKey('SIX', () => this.scene.player.levelWeapon('six'))
    this.onKey('SEVEN', () => this.scene.player.levelWeapon('seven'))
    this.onKey('EIGHT', () => this.scene.player.levelWeapon('eight'))
    this.onKey('NINE', () => this.scene.player.levelWeapon('nine'))

    this.onKey('Y', () => this.reg.inc('maxHP'))
    this.onKey('U', () => this.reg.inc('healthRegen'))
    this.onKey('I', () => this.reg.inc('moveSpeed'))
    this.onKey('O', () => this.reg.inc('pickupRange'))
    this.onKey('P', () => this.reg.inc('xpRate'))
    this.onKey('F', () => this.reg.inc('duplicator'))
    this.onKey('G', () => this.reg.inc('damageBoost'))
    this.onKey('H', () => this.reg.inc('fireDelay'))
    this.onKey('J', () => this.reg.inc('range'))
    this.onKey('K', () => this.reg.inc('bulletSpeed'))
    this.onKey('L', () => this.reg.inc('bulletSize'))

    this.onKey('V', () => (this.player.xp += 1000))
    this.onKey('B', () => (this.player.tp += 99))
    this.onKey('N', () => {
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
