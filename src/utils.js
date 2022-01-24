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

export const applyUpgrade = ([k, [type, val]], obj) => {
  obj[k] = obj[k] || 0
  if (type === '+') obj[k] += val
  if (type === '*') obj[k] *= val
}
