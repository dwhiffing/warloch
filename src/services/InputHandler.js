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

    this.debugKeys = this.input.keyboard.addKeys('P,O,I')
    this.input.on('pointerdown', () => (this.scene.isMouseDown = true))
    this.input.on('pointerup', () => (this.scene.isMouseDown = false))
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.debugKeys.P)) {
      this.player.xp += 100
    }

    if (Phaser.Input.Keyboard.JustDown(this.debugKeys.O)) {
      this.player.tp += 99
    }

    if (Phaser.Input.Keyboard.JustDown(this.debugKeys.I)) {
      for (let i = 0; i < 10; i++) {
        this.scene.enemySpawner.spawn()
      }
    }

    if (this.upKey.isDown) {
      this.player.setVelocityY(-this.player.moveSpeed)
    } else if (this.downKey.isDown) {
      this.player.setVelocityY(this.player.moveSpeed)
    }

    if (this.leftKey.isDown) {
      this.player.setVelocityX(-this.player.moveSpeed)
    } else if (this.rightKey.isDown) {
      this.player.setVelocityX(this.player.moveSpeed)
    }
  }
}
