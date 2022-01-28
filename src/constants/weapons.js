// idea: blast is based on unlocked weapons/levels
export const WEAPONS = {
  one: {
    name: 'one',
    light: 'basic',
    dark: 'shotgun',
    levels: [
      {},
      { health: ['+', 1], count: ['+', 1], damage: ['+', 0.3] },
      { health: ['+', 2], count: ['+', 1], damage: ['+', 0.6] },
      { health: ['+', 3], count: ['+', 2], damage: ['+', 1] },
    ],
  },
  two: {
    name: 'two',
    light: 'bible',
    dark: 'orbs',
    levels: [
      {},
      { count: ['+', 1], damage: ['+', 1] },
      { count: ['+', 2], damage: ['+', 2] },
      { count: ['+', 3], damage: ['+', 3] },
    ],
  },
  three: {
    name: 'three',
    light: 'whip',
    dark: 'axe',
    levels: [
      {},
      { size: ['*', 1.05], damage: ['+', 1.5], count: ['+', 1] },
      { size: ['*', 1.1], damage: ['+', 3], count: ['+', 2] },
      { size: ['*', 1.15], damage: ['+', 4.5], count: ['+', 2] },
    ],
  },
  four: {
    name: 'four',
    light: 'water',
    dark: 'garlic',
    levels: [
      {},
      { poison: ['+', 500], size: ['*', 1.15], damage: ['+', 0.4] },
      { poison: ['+', 1000], size: ['*', 1.3], damage: ['+', 0.8] },
      { poison: ['+', 1500], size: ['*', 1.45], damage: ['+', 1.2] },
    ],
  },
  five: {
    name: 'five',
    light: 'wand',
    dark: 'fire',
    levels: [
      {},
      { delay: ['*', 0.9], count: ['+', 1], damage: ['+', 2] },
      { delay: ['*', 0.8], count: ['+', 2], damage: ['+', 4] },
      { delay: ['*', 0.7], count: ['+', 2], damage: ['+', 6] },
    ],
  },
  six: {
    name: 'six',
    light: 'splitter',
    dark: 'rocket',
    levels: [
      {},
      { count: ['+', 0], damage: ['+', 1], delay: ['*', 0.9] },
      { count: ['+', 0], damage: ['+', 2], delay: ['*', 0.8] },
      { count: ['+', 1], damage: ['+', 3], delay: ['*', 0.7] },
    ],
  },
  seven: {
    name: 'seven',
    light: 'chain',
    dark: 'bone',
    levels: [
      {},
      { delay: ['*', 0.9], damage: ['+', 0.5] },
      { delay: ['*', 0.8], damage: ['+', 1.5] },
      { delay: ['*', 0.7], damage: ['+', 3] },
    ],
  },
  eight: {
    name: 'eight',
    light: 'bubbler',
    dark: 'cross',
    levels: [
      {},
      { damage: ['*', 1.5], delay: ['*', 0.8] },
      { damage: ['*', 2], delay: ['*', 0.7] },
      { damage: ['*', 3], delay: ['*', 0.6] },
    ],
  },
  nine: {
    name: 'nine',
    light: 'tracer',
    dark: 'tracer',
    levels: [
      {},
      { damage: ['+', 1], delay: ['*', 0.9], range: ['*', 1.2] },
      { damage: ['+', 2], delay: ['*', 0.8], range: ['*', 1.4] },
      { damage: ['+', 3], delay: ['*', 0.7], range: ['*', 1.6] },
    ],
  },
}
