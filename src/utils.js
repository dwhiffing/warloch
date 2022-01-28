export const createAnim = (scene, sprite) => {
  const { key, name, frameRate } = sprite
  scene.anims.create({
    key,
    frames: scene.anims.generateFrameNames('tiles', {
      prefix: `${name}_Walk_`,
      suffix: '.png',
      start: 1,
      end: 4,
    }),
    frameRate,
    repeat: -1,
  })
}

export const applyUpgrade = ([k, [type, val]], obj) => {
  obj[k] = obj[k] || 0
  if (type === '+') obj[k] += val
  if (type === '*') obj[k] *= val
}
