import { Orb } from '../sprites/Orb'

const ORB_MAX = 300

export class OrbSpawner {
  constructor(scene) {
    this.scene = scene

    this.orbs = scene.physics.add.group({
      classType: Orb,
      maxSize: ORB_MAX,
      runChildUpdate: true,
    })
    this.orbs.createMultiple({ quantity: ORB_MAX, active: false })
  }

  spawn = (x, y, value) => {
    const orb = this.orbs.get()
    orb.spawn(x, y, value)
  }

  update() {}
}
