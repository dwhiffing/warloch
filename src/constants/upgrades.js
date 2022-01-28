export const UPGRADES = {
  duplicator: {
    name: 'Duplicator',
    key: 'duplicator',
    type: 'gun',
    levels: [{ count: ['+', 1] }, { count: ['+', 2] }, { count: ['+', 3] }],
  },
  damageBoost: {
    name: 'Damage Boost',
    key: 'damageBoost',
    type: 'gun',
    levels: [
      { damage: ['*', 1.2] },
      { damage: ['*', 1.4] },
      { damage: ['*', 1.6] },
    ],
  },
  fireDelay: {
    name: 'Attack Speed',
    key: 'fireDelay',
    type: 'gun',
    levels: [
      { delay: ['*', 0.85] },
      { delay: ['*', 0.7] },
      { delay: ['*', 0.55] },
    ],
  },
  range: {
    name: 'Extra Range',
    key: 'range',
    type: 'gun',
    levels: [
      { range: ['*', 1.2] },
      { range: ['*', 1.4] },
      { range: ['*', 1.6] },
    ],
  },
  bulletSpeed: {
    name: 'Bullet Speed',
    key: 'bulletSpeed',
    type: 'gun',
    levels: [
      { speed: ['*', 1.2] },
      { speed: ['*', 1.4] },
      { speed: ['*', 1.6] },
    ],
  },
  bulletSize: {
    name: 'Bullet Size',
    key: 'bulletSize',
    type: 'gun',
    levels: [
      { size: ['*', 1.15] },
      { size: ['*', 1.3] },
      { size: ['*', 1.45] },
    ],
  },
  maxHP: {
    name: 'Max Health',
    key: 'maxHP',
    type: 'player',
    levels: [
      { maxHP: ['*', 1.2] },
      { maxHP: ['*', 1.4] },
      { maxHP: ['*', 1.6] },
    ],
  },
  healthRegen: {
    name: 'Health Regen',
    key: 'healthRegen',
    type: 'player',
    levels: [
      { regen: ['+', 1.01] },
      { regen: ['+', 1.02] },
      { regen: ['+', 1.03] },
    ],
  },
  moveSpeed: {
    name: 'Move Speed',
    key: 'moveSpeed',
    type: 'player',
    levels: [{ speed: ['+', 5] }, { speed: ['+', 10] }, { speed: ['+', 15] }],
  },
  pickupRange: {
    name: 'Pickup Range',
    key: 'pickupRange',
    type: 'player',
    levels: [
      { pickupRange: ['+', 5] },
      { pickupRange: ['+', 10] },
      { pickupRange: ['+', 15] },
    ],
  },
  xpRate: {
    name: 'XP Gain',
    key: 'xpRate',
    type: 'player',
    levels: [
      { xpRate: ['*', 1.1] },
      { xpRate: ['*', 1.2] },
      { xpRate: ['*', 1.3] },
    ],
  },
  // luck: {
  //   name: 'Luck',
  //   key: 'luck',
  //   type: 'player',
  //   levels: [
  //     { luck: (d) => d * 1.1 },
  //     { luck: (d) => d * 1.1 },
  //     { luck: (d) => d * 1.1 },
  //   ],
  // },
  // armor: {
  //   name: 'Armor',
  //   key: 'armor',
  //   type: 'player',
  //   levels: [
  //     { armor: (d) => d + 0.1 },
  //     { armor: (d) => d + 0.1 },
  //     { armor: (d) => d + 0.1 },
  //   ],
  // },
}
