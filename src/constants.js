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
  light: {
    damage: 1,
    delay: 30,
    speed: 150,
    count: 1,
    range: 150,
    size: 2,
    spread: 0,
    rate: 1.8,
  },
  dark: {
    damage: 4,
    delay: 50,
    speed: 8,
    count: 5,
    range: 30,
    size: 3,
    spread: Math.PI / 3,
    rate: 0.5,
  },
  blast: {
    damage: 3,
    delay: 100,
    speed: 60,
    count: 50,
    range: 240,
    size: 3,
    spread: Math.PI * 2,
    rate: 0.5,
  },
}

// TODO: Revamp upgrades to change multiple guns in more complex ways
export const UPGRADES = {
  upgrade1: { tint: 0xf8961e, name: 'Upgrade', key: 'upgrade' },
  upgrade2: { tint: 0xf3722c, name: 'Upgrade', key: 'upgrade' },
  upgrade3: { tint: 0xf94144, name: 'Upgrade', key: 'upgrade' },
}

// gun ideas
// gun: shoots a weak shot at the cursor
// shotgun: shoots in an arc with short range
// whip: attacks with low damage in a large area right in front of player
// fire wand: aims at random enemy, high damage
// wand: aims at nearest enemy, low damage, high rate of fire
// water: generates aoe for duration

// bible: orbits around player constantly
// Runetracer: passes through enemies, draws a line behind it, shoots every 3 seconds, bounces off walls
// cross: aims at nearest enemy, boomerangs, moves faster over time
// garlic: does passive damage to nearby enemies
// bone: bouncing projectile
// axe: lobs up and down the screen, attacks in large area and pierces

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
