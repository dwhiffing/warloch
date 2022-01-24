export const createAnim = (scene, key, prefix) => {
  scene.anims.create({
    key,
    frames: scene.anims.generateFrameNames('tiles', {
      prefix,
      suffix: '.png',
      start: 1,
      end: 4,
    }),
    repeat: -1,
  })
}

export const applyUpgrade = ([k, v], obj) => {
  if (typeof v === 'number') {
    obj[k] += v
  } else if (typeof v === 'function') {
    obj[k] = v(obj[k])
  }
}
