export const GUNS = {
  // things that shoot toward the pointer
  basic: {
    name: 'basic',
    damage: 1,
    delay: 25,
    speed: 170,
    range: 150,
    depth: 20,
    frame: 'shot.png',
    size: 1,
    bodySize: 4,
    soundRate: 1.8,
  },
  shotgun: {
    name: 'shotgun',
    damage: 0.66,
    delay: 80,
    offset: 10,
    speed: 140,
    count: 3,
    maxCount: 6,
    range: 40,
    pierce: 5,
    depth: 20,
    frame: 'shot-shotgun.png',
    size: 3,
    bodySize: 5,
    spread: Math.PI / 3,
    soundRate: 0.5,
  },
  cross: {
    name: 'cross',
    damage: 1,
    delay: 80,
    speed: 140,
    range: 200,
    depth: 20,
    frame: 'shot-cross.png',
    accel: -5,
    size: 3,
    pierce: 10,
    bodySize: 5,
    soundRate: 1.8,
  },
  rocket: {
    name: 'rocket',
    damage: 3,
    delay: 90,
    speed: 60,
    range: 100,
    depth: 20,
    frame: 'shot-rocket.png',
    size: 2,
    explode: 'rocketExplode',
    bodySize: 4,
    soundRate: 1.8,
  },
  splitter: {
    name: 'splitter',
    damage: 0.5,
    delay: 90,
    speed: 150,
    range: 70,
    depth: 20,
    frame: 'shot-splitter.png',
    size: 0.6,
    pierce: 2,
    explode: 'smallBlast',
    bodySize: 10,
    soundRate: 1.8,
  },
  bubbler: {
    name: 'bubbler',
    damage: 0.2,
    delay: 12,
    count: 1,
    speed: 150,
    range: 150,
    offset: 4,
    spread: 0.3,
    // lower will make it boomerang
    accel: -1,
    randomAngle: true,
    depth: 20,
    frame: 'shot-bubbler.png',
    size: 0.7,
    bodySize: 6,
    soundRate: 1.8,
  },
  // tracer: {
  //   name: 'tracer',
  //   damage: 1.5,
  //   delay: 70,
  //   speed: 150,
  //   range: 150,
  //   frame: 'shot-tracer.png',
  //   size: 1,
  //   bodySize: 5,
  //   pierce: 10,
  //   soundRate: 1.8,
  // },

  // things that aim automatically toward an enemy
  bone: {
    name: 'bone',
    damage: 1,
    delay: 40,
    speed: 200,
    range: 250,
    depth: 20,
    count: 2,
    frame: 'shot-bone.png',
    size: 1.5,
    pierce: 10,
    bodySize: 5,
    soundRate: 1.8,
    reacquire: true,
    target: 'randomAngle',
  },
  wand: {
    name: 'wand',
    damage: 1,
    delay: 35,
    speed: { min: 50, max: 80 },
    range: 150,
    depth: 5,
    count: 2,
    maxCount: 4,
    frame: 'shot-wand.png',
    size: 0.8,
    offset: 10,
    bodySize: 5,
    soundRate: 1.8,
    target: 'nearestEnemy',
  },
  fire: {
    name: 'fire',
    damage: 3,
    delay: 35,
    speed: 150,
    range: 150,
    depth: 8,
    count: 2,
    frame: 'shot-shotgun.png',
    size: 1,
    bodySize: 12,
    soundRate: 1.8,
    target: 'randomEnemy',
  },
  chain: {
    name: 'chain',
    damage: 0.5,
    delay: 80,
    speed: 250,
    range: 140,
    depth: 7,
    frame: 'shot-chain.png',
    size: 1.5,
    pierce: 8,
    bodySize: 4,
    soundRate: 1.8,
    reacquire: true,
    target: 'nearestEnemy',
  },

  // things that float on/around player
  bible: {
    name: 'bible',
    damage: 0.7,
    delay: 50,
    speed: 100,
    range: 80,
    depth: 15,
    frame: 'shot-bible.png',
    size: 2,
    count: 1,
    spread: Math.PI,
    bodySize: 9,
    pierce: 999,
    lifetime: 50,
    soundRate: 1.8,
    damageOverTime: true,
    target: 'orbit',
  },
  garlic: {
    name: 'garlic',
    damage: 0.4,
    delay: 150,
    speed: 0,
    range: 1,
    depth: 1,
    poison: 100,
    maxCount: 1,
    frame: 'shot-garlic.png',
    size: 7,
    count: 1,
    spread: 0,
    alpha: 0.5,
    bodySize: 12,
    pierce: 9999,
    lifetime: 147,
    soundRate: 1.8,
    damageOverTime: true,
    target: 'orbit',
  },

  // things that fire around player
  orbs: {
    name: 'orbs',
    damage: 0.5,
    delay: 60,
    speed: 40,
    range: 350,
    depth: 1,
    frame: 'shot-orbs.png',
    size: 3,
    pierce: 10,
    lifetime: 300,
    bodySize: 10,
    soundRate: 1.8,
    target: 'randomAngle',
  },
  water: {
    name: 'water',
    damage: 1,
    delay: 150,
    speed: 150,
    range: 120,
    depth: 1,
    poison: 100,
    maxCount: 3,
    frame: 'shot-water.png',
    size: 2.5,
    bodySize: 10,
    pierce: 9999,
    lifetime: 200,
    soundRate: 1.8,
    damageOverTime: true,
    target: 'randomPosition',
  },

  // things that fire in front of player
  whip: {
    name: 'whip',
    damage: 1,
    delay: 120,
    speed: 20,
    range: 8,
    depth: 20,
    maxCount: 2,
    frame: 'whip.png',
    size: 2,
    pierce: 999,
    spread: Math.PI * 2,
    soundRate: 0.5,
    target: 'melee',
    bodyWidth: 45,
    bodyHeight: 18,
    offset: 40,
  },
  axe: {
    name: 'axe',
    damage: 1,
    delay: 90,
    speed: { min: 50, max: 100 },
    speedY: { min: -230, max: -170 },
    range: 250,
    depth: 20,
    maxCount: 4,
    frame: 'shot-axe.png',
    size: 3,
    pierce: 10,
    bodySize: 5,
    soundRate: 1.8,
    gravity: 300,
    target: 'melee',
  },
  rocketExplode: {
    damage: 1,
    delay: 0,
    speed: 1,
    offset: 1,
    range: 1,
    depth: 20,
    play: 'explosion',
    size: 2.4,
    bodySize: 20,
    pierce: 9999,
    lifetime: 30,
    soundRate: 1.8,
  },
  blast: {
    damage: 2,
    delay: 100,
    speed: 60,
    count: 20,
    maxCount: 20,
    range: 240,
    depth: 20,
    frame: 'shot.png',
    size: 3,
    pierce: 3,
    bodySize: 4,
    spread: Math.PI * 2,
    soundRate: 0.5,
  },
  smallBlast: {
    damage: 0.5,
    delay: 0,
    speed: 80,
    count: 8,
    offset: 1,
    range: 32,
    depth: 20,
    maxCount: 8,
    frame: 'shot-splitter.png',
    size: 0.4,
    bodySize: 10,
    spread: Math.PI * 2,
    soundRate: 0.5,
  },
  enemy: {
    name: 'enemy',
    damage: 1,
    delay: 0,
    speed: 60,
    range: 250,
    depth: 20,
    frame: 'shot-enemy.png',
    size: 1,
    bodySize: 4,
    soundRate: 0.4,
  },
}
