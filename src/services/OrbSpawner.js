import { Orb } from '../sprites/Orb'

const ORB_MAX = 400

export class OrbSpawner {
  constructor(scene) {
    this.scene = scene

    this.orbs = scene.physics.add.group({
      classType: Orb,
      maxSize: ORB_MAX,
      runChildUpdate: true,
    })
    this.orbs.createMultiple({ quantity: ORB_MAX, active: false })

    this.scene.registry.events.on('changedata-pickupRange', () => {
      this.orbs
        .getChildren()
        .filter((o) => o.active)
        .forEach((o) => o.resize())
    })
  }

  spawn = (x, y, value) => {
    const orb = this.orbs.get()
    if (!orb) return
    orb.spawn(x, y, value)
  }

  update() {}
}
