export const SPRITES = {
  knight: {
    type: 'enemy',
    name: 'Knight',
    key: 'knight',
    bodySize: [8, 16],
    bodyOffset: [12, 14],
    speed: 50,
    hp: 3,
    damage: 1,
    xp: 5,
  },
  eliteKnight: {
    type: 'enemy',
    name: 'EliteKnight',
    key: 'eliteKnight',
    bodySize: [8, 16],
    bodyOffset: [8, 14],
    speed: 20,
    hp: 50,
    damage: 1,
    xp: 10,
  },
  largeEliteKnight: {
    type: 'enemy',
    name: 'LargeEliteKnight',
    key: 'largeEliteKnight',
    bodySize: [18, 18],
    bodyOffset: [6, 10],
    speed: 10,
    hp: 100,
    damage: 1,
    xp: 20,
  },
  player2: {
    type: 'player',
    name: 'Executioner',
    key: 'player2',
    bodySize: [18, 18],
    bodyOffset: [6, 10],
    speed: 10,
    hp: 100,
  },
  player: {
    type: 'player',
    name: 'Mage',
    key: 'player',
    bodySize: [8, 8],
    bodyOffset: [12, 22],
    speed: 80,
    hp: 100,
  },
}

export const GUNS = {
  wand: {
    damage: 1,
    delay: 30,
    speed: 50,
    range: 250,
    frame: 'shot.png',
    size: 2,
    bodySize: 4,
    soundRate: 1.8,
    target: 'nearestEnemy',
  },
  fire: {
    damage: 3,
    delay: 120,
    speed: 150,
    range: 250,
    frame: 'shot.png',
    size: 2,
    bodySize: 4,
    soundRate: 1.8,
    target: 'randomEnemy',
  },
  water: {
    damage: 1,
    delay: 200,
    speed: 150,
    range: 150,
    frame: 'shot.png',
    size: 12,
    bodySize: 4,
    health: 9999,
    lifetime: 200,
    soundRate: 1.8,
    damageOverTime: true,
    target: 'randomPosition',
  },
  mines: {
    damage: 1,
    delay: 30,
    speed: 150,
    range: 150,
    frame: 'shot.png',
    size: 2,
    bodySize: 4,
    soundRate: 1.8,
    target: 'randomPosition',
  },
  bible: {
    damage: 1,
    delay: 50,
    speed: 120,
    range: 80,
    frame: 'shot.png',
    size: 3,
    count: 1,
    spread: Math.PI,
    bodySize: 4,
    health: 999,
    lifetime: 50,
    soundRate: 1.8,
    damageOverTime: true,
    target: 'orbit',
  },
  garlic: {
    damage: 1,
    delay: 150,
    speed: 0,
    range: 1,
    frame: 'shot.png',
    size: 25,
    count: 1,
    spread: 0,
    bodySize: 4,
    health: 999,
    lifetime: 150,
    soundRate: 1.8,
    damageOverTime: true,
    target: 'orbit',
  },
  cross: {
    damage: 2,
    delay: 50,
    speed: 150,
    range: 200,
    frame: 'shot.png',
    accel: -5,
    size: 4,
    health: 10,
    bodySize: 4,
    soundRate: 1.8,
  },
  light: {
    damage: 1,
    delay: 30,
    speed: 150,
    range: 150,
    frame: 'shot.png',
    size: 2,
    bodySize: 4,
    soundRate: 1.8,
  },
  _light: {
    damage: 1,
    delay: 30,
    speed: 150,
    range: 150,
    frame: 'shot.png',
    size: 2,
    bodySize: 4,
    soundRate: 1.8,
  },
  tracer: {
    damage: 2,
    delay: 70,
    speed: 150,
    range: 150,
    frame: 'shot.png',
    size: 2,
    bodySize: 4,
    health: 10,
    soundRate: 1.8,
  },
  whip: {
    damage: 1,
    delay: 70,
    speed: 15,
    range: 5,
    frame: 'whip.png',
    size: 1,
    health: 10,
    spread: Math.PI * 2,
    soundRate: 0.5,
    target: 'melee',
    bodyWidth: 45,
    bodyHeight: 18,
    offset: 30,
  },
  dark: {
    damage: 4,
    delay: 50,
    speed: 12,
    count: 5,
    range: 30,
    frame: 'shot.png',
    size: 3,
    bodySize: 4,
    spread: Math.PI / 3,
    soundRate: 0.5,
  },
  blast: {
    damage: 3,
    delay: 100,
    speed: 60,
    count: 50,
    range: 240,
    frame: 'shot.png',
    size: 3,
    bodySize: 4,
    spread: Math.PI * 2,
    soundRate: 0.5,
  },
}

// TODO: Revamp upgrades to change multiple guns in more complex ways
export const UPGRADES = {
  upgrade1: { tint: 0xf8961e, name: 'Upgrade', key: 'upgrade' },
  upgrade2: { tint: 0xf3722c, name: 'Upgrade', key: 'upgrade' },
  upgrade3: { tint: 0xf94144, name: 'Upgrade', key: 'upgrade' },
}

// gun ideas
// chain: bounces between n valid targets
// bone: bounces off targets
// axe: lobs up and down the screen, attacks in large area and pierces
// orbs that fire randomly and float around
// bubbler like in cave story

// power ups
// add one count to all weapons
// increase damage globally by 10%
// increase fire rate globally by 10%
// increase attack size globally by 10%
// increase xp gain rate by 10%
// increase range of weapons by 10%
// increase speed of weapons by 10%
// increase max health by 10%
// increase luck by 10%
// increase hp gain by .1 ps
// increase armor by 1. armor reduces incoming damage
// increase pickup range
// increase move speed

// make it like hades except
// you can pick 3 weapons, 6 powerups
// you can pick a transform blast power
//

// bosses appear every n minutes
// kill bosses to get new weapons
// level up to get weapon upgrades
