export const ENEMIES = {
  slime: {
    type: 'slime',
    bodySize: [12, 19],
    bodyOffset: [10, 12],
    speed: 30,
    tint: 0xffffff,
    hp: 1,
    damage: 3,
    xp: 2,
    mass: 10,
  },
  gremlin: {
    type: 'gremlin',
    bodySize: [15, 19],
    bodyOffset: [8, 12],
    speed: 30,
    tint: 0x00aa55,
    hp: 3,
    damage: 3,
    xp: 10,
    mass: 10,
  },
  skull: {
    type: 'skull',
    ai: 'flying',
    bodySize: [12, 19],
    bodyOffset: [10, 12],
    speed: 30,
    tint: 0xffffff,
    hp: 5,
    damage: 3,
    xp: 5,
    mass: 10,
  },
  knight: {
    type: 'knight',
    bodySize: [12, 19],
    bodyOffset: [10, 12],
    speed: 30,
    hp: 10,
    damage: 3,
    xp: 25,
    mass: 10,
  },
  eliteKnight: {
    type: 'eliteKnight',
    bodySize: [12, 19],
    bodyOffset: [10, 12],
    speed: 20,
    hp: 20,
    damage: 6,
    xp: 25,
    mass: 10,
  },
  largeKnight: {
    type: 'largeKnight',
    bodySize: [24, 28],
    bodyOffset: [4, 4],
    speed: 10,
    hp: 50,
    damage: 8,
    xp: 50,
    mass: 10,
  },
  goblin: {
    type: 'goblin',
    bodySize: [24, 28],
    bodyOffset: [4, 4],
    speed: 10,
    hp: 50,
    damage: 8,
    xp: 25,
    mass: 10,
  },
  largeEliteKnight: {
    type: 'largeEliteKnight',
    bodySize: [24, 28],
    bodyOffset: [4, 4],
    speed: 10,
    hp: 100,
    damage: 10,
    xp: 100,
    mass: 10,
  },
}
