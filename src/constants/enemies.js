export const ENEMIES = {
  slime_small: {
    ai: 'jump',
    type: 'slime_small',
    bodySize: [12, 8],
    bodyOffset: [10, 24],
    speed: 30,
    level: 1,
    particleTint: 0x00aaaa,
    particleScale: 0.8,
    hp: 2,
    damage: 3,
    xp: 2,
    mass: 10,
  },
  goblin_small: {
    type: 'goblin_small',
    bodySize: [15, 19],
    bodyOffset: [8, 12],
    speed: 40,
    level: 1,
    particleTint: 0x00aa55,
    hp: 4,
    damage: 3,
    xp: 5,
    mass: 10,
  },
  skull_small: {
    type: 'skull_small',
    ai: 'flying',
    bodySize: [12, 19],
    bodyOffset: [10, 12],
    level: 2,
    speed: 30,
    particleTint: 0xffffff,
    hp: 5,
    damage: 3,
    xp: 5,
    mass: 10,
  },
  knight_small: {
    type: 'knight_small',
    bodySize: [12, 19],
    bodyOffset: [10, 12],
    level: 2,
    speed: 30,
    hp: 10,
    damage: 3,
    xp: 25,
    mass: 10,
  },
  slime_big: {
    ai: 'jump',
    type: 'slime_big',
    bodySize: [12, 19],
    bodyOffset: [10, 12],
    speed: 30,
    level: 3,
    particleTint: 0x00aaaa,
    particleScale: 1.5,
    hp: 25,
    damage: 5,
    xp: 10,
    mass: 10,
  },
  skull_big: {
    type: 'skull_big',
    ai: 'flying',
    bodySize: [12, 19],
    bodyOffset: [10, 12],
    speed: 30,
    level: 3,
    particleTint: 0xffffff,
    hp: 15,
    damage: 3,
    xp: 5,
    mass: 10,
  },

  goblin_big: {
    type: 'goblin_big',
    bodySize: [24, 28],
    bodyOffset: [4, 4],
    speed: 10,
    level: 4,
    hp: 50,
    damage: 8,
    xp: 25,
    mass: 10,
  },
  knight_big: {
    type: 'knight_big',
    bodySize: [24, 28],
    bodyOffset: [4, 4],
    speed: 10,
    level: 5,
    hp: 50,
    damage: 8,
    xp: 50,
    mass: 10,
  },
  // eliteKnight: {
  //   type: 'eliteKnight',
  //   bodySize: [12, 19],
  //   bodyOffset: [10, 12],
  //   speed: 20,
  //   hp: 20,
  //   damage: 6,
  //   xp: 25,
  //   mass: 10,
  // },
  // largeEliteKnight: {
  //   type: 'largeEliteKnight',
  //   bodySize: [24, 28],
  //   bodyOffset: [4, 4],
  //   speed: 10,
  //   hp: 100,
  //   damage: 10,
  //   xp: 100,
  //   mass: 10,
  // },
}
