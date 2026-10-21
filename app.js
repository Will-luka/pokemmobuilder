'use strict';

/* ============================================================
   ESTADO
   ============================================================ */
const state = {
  team: [null,null,null,null,null,null],
  editingSlot: null,
  level: 50,
  damageAtk: null, damageDef: null,
  field: {
    weather: 'none', crit: false, reflect: false, lightScreen: false,
    atkBoosts: {atk:0,spa:0,spe:0},
    defBoosts: {def:0,spd:0,spe:0},
    atkHp: 100, defHp: 100
  },
  buffPokemon: null, buffNature: 'Adamant', buffAbility: null, buffItem: 'None',
  buffEvs: [0,0,0,0,0,0],
  buffBoosts: {atk:0,def:0,spa:0,spd:0,spe:0},
  buffStatus: 'none'
};

/* ============================================================
   DADOS ESTÁTICOS (Gen 5)
   ============================================================ */
const TYPES = ['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel'];

const TYPE_CHART = {
  Normal:{Rock:.5,Ghost:0,Steel:.5},
  Fire:{Fire:.5,Water:.5,Grass:2,Ice:2,Bug:2,Rock:.5,Dragon:.5,Steel:2},
  Water:{Fire:2,Water:.5,Grass:.5,Ground:2,Rock:2,Dragon:.5},
  Electric:{Water:2,Electric:.5,Grass:.5,Ground:0,Flying:2,Dragon:.5},
  Grass:{Fire:.5,Water:2,Grass:.5,Poison:.5,Ground:2,Flying:.5,Bug:.5,Rock:2,Dragon:.5,Steel:.5},
  Ice:{Fire:.5,Water:.5,Grass:2,Ice:.5,Ground:2,Flying:2,Dragon:2,Steel:.5},
  Fighting:{Normal:2,Ice:2,Poison:.5,Flying:.5,Psychic:.5,Bug:.5,Rock:2,Ghost:0,Dark:2,Steel:2},
  Poison:{Grass:2,Poison:.5,Ground:.5,Rock:.5,Ghost:.5,Steel:0},
  Ground:{Fire:2,Electric:2,Grass:.5,Poison:2,Flying:0,Bug:.5,Rock:2,Steel:2},
  Flying:{Electric:.5,Grass:2,Fighting:2,Bug:2,Rock:.5,Steel:.5},
  Psychic:{Fighting:2,Poison:2,Psychic:.5,Dark:0,Steel:.5},
  Bug:{Fire:.5,Grass:2,Fighting:.5,Poison:.5,Flying:.5,Psychic:2,Ghost:.5,Dark:2,Steel:.5},
  Rock:{Fire:2,Ice:2,Fighting:.5,Ground:.5,Flying:2,Bug:2,Steel:.5},
  Ghost:{Normal:0,Psychic:2,Ghost:2,Dark:.5,Steel:.5},
  Dragon:{Dragon:2,Steel:.5},
  Dark:{Fighting:.5,Psychic:2,Ghost:2,Dark:.5},
  Steel:{Fire:.5,Water:.5,Electric:.5,Ice:2,Rock:2,Steel:.5}
};

const NATURES = {
  Hardy:null,Lonely:['atk','def'],Brave:['atk','spe'],Adamant:['atk','spa'],Naughty:['atk','spd'],
  Bold:['def','atk'],Docile:null,Relaxed:['def','spe'],Impish:['def','spa'],Lax:['def','spd'],
  Timid:['spe','atk'],Hasty:['spe','def'],Serious:null,Jolly:['spe','spa'],Naive:['spe','spd'],
  Modest:['spa','atk'],Mild:['spa','def'],Quiet:['spa','spe'],Bashful:null,Rash:['spa','spd'],
  Calm:['spd','atk'],Gentle:['spd','def'],Sassy:['spd','spe'],Careful:['spd','spa'],Quirky:null
};

const ITEMS = {
  'None':{},
  'Leftovers':{healPerTurn:1/16},
  'Black Sludge':{healPerTurn:1/16,poisonOnly:true,damageNonPoison:1/8},
  'Life Orb':{damageMult:1.3,recoil:0.10},
  'Choice Band':{statMult:{atk:1.5},choice:true},
  'Choice Specs':{statMult:{spa:1.5},choice:true},
  'Choice Scarf':{statMult:{spe:1.5},choice:true},
  'Assault Vest':{statMult:{spd:1.5},noStatus:true},
  'Eviolite':{statMult:{def:1.5,spd:1.5},requiresCanEvolve:true},
  'Expert Belt':{superEffMult:1.2},
  'Focus Sash':{surviveAt1HP:true},
  'Rocky Helmet':{contactRecoil:1/6},
  'Air Balloon':{immuneTo:['Ground']},
  'Red Card':{forceSwitch:true},
  'Shed Shell':{canAlwaysSwitch:true},
  'Safety Goggles':{powderImmune:true,weatherImmune:true},
  'Charcoal':{typeBoost:'Fire',typeMult:1.2},
  'Mystic Water':{typeBoost:'Water',typeMult:1.2},
  'Magnet':{typeBoost:'Electric',typeMult:1.2},
  'Miracle Seed':{typeBoost:'Grass',typeMult:1.2},
  'NeverMeltIce':{typeBoost:'Ice',typeMult:1.2},
  'Black Belt':{typeBoost:'Fighting',typeMult:1.2},
  'Poison Barb':{typeBoost:'Poison',typeMult:1.2},
  'Soft Sand':{typeBoost:'Ground',typeMult:1.2},
  'Sharp Beak':{typeBoost:'Flying',typeMult:1.2},
  'TwistedSpoon':{typeBoost:'Psychic',typeMult:1.2},
  'SilverPowder':{typeBoost:'Bug',typeMult:1.2},
  'Hard Stone':{typeBoost:'Rock',typeMult:1.2},
  'Spell Tag':{typeBoost:'Ghost',typeMult:1.2},
  'Dragon Fang':{typeBoost:'Dragon',typeMult:1.2},
  'BlackGlasses':{typeBoost:'Dark',typeMult:1.2},
  'Metal Coat':{typeBoost:'Steel',typeMult:1.2},
  'Silk Scarf':{typeBoost:'Normal',typeMult:1.2},
  'Sitrus Berry':{healsAtHalf:0.25},
  'Lum Berry':{curesStatus:true},
  'Liechi Berry':{pinchBoost:{stat:'atk',stages:1}},
  'Ganlon Berry':{pinchBoost:{stat:'def',stages:1}},
  'Salac Berry':{pinchBoost:{stat:'spe',stages:1}},
  'Petaya Berry':{pinchBoost:{stat:'spa',stages:1}},
  'Apicot Berry':{pinchBoost:{stat:'spd',stages:1}},
  'Quick Claw':{firstChance:0.2},
  'Kings Rock':{flinchChance:0.1},
  'Wide Lens':{accuracyMult:1.1},
  'Muscle Band':{damageMult:1.1,physicalOnly:true},
  'Wise Glasses':{damageMult:1.1,specialOnly:true},
  'Light Clay':{screenDuration:8},
  'Damp Rock':{weatherDuration:8},
  'Heat Rock':{weatherDuration:8},
  'Smooth Rock':{weatherDuration:8},
  'Icy Rock':{weatherDuration:8},
  'Big Root':{drainBoost:1.3},
  'Iron Ball':{halveSpeed:true,grounded:true},
  'Lagging Tail':{alwaysLast:true},
  'Sticky Barb':{damagePerTurn:1/8}
};

const ABILITY_EFFECTS = {
  'Adaptability':{stabMult:2},
  'Huge Power':{statMult:{atk:2}},
  'Pure Power':{statMult:{atk:2}},
  'Technician':{powerBoost:{maxPower:60,mult:1.5}},
  'Tough Claws':{powerBoost:{flag:'contact',mult:1.33}},
  'Iron Fist':{powerBoost:{flag:'punch',mult:1.2}},
  'Strong Jaw':{powerBoost:{flag:'bite',mult:1.5}},
  'Mega Launcher':{powerBoost:{flag:'pulse',mult:1.5}},
  'Punk Rock':{powerBoost:{flag:'sound',mult:1.3}},
  'Sharpness':{powerBoost:{flag:'slicing',mult:1.5}},
  'Sheer Force':{powerBoost:{secondary:true,mult:1.3}},
  'Thick Fat':{typeResist:{types:['Fire','Ice'],mult:0.5}},
  'Filter':{superEffResist:0.75},
  'Solid Rock':{superEffResist:0.75},
  'Multiscale':{fullHpResist:0.5},
  'Shadow Shield':{fullHpResist:0.5},
  'Fur Coat':{statMult:{def:2}},
  'Marvel Scale':{statMultIfStatus:{def:1.5}},
  'Guts':{statMultIfStatus:{atk:1.5}},
  'Hustle':{statMult:{atk:1.5},accuracyMult:0.8},
  'Sand Force':{weatherBoost:{weather:'sandstorm',types:['Rock','Ground','Steel'],mult:1.3}},
  'Drizzle':{setsWeather:'rain'},
  'Drought':{setsWeather:'sun'},
  'Sand Stream':{setsWeather:'sandstorm'},
  'Snow Warning':{setsWeather:'hail'},
  'Snow Plow':{weatherSpeed:{weather:'hail',mult:2}},
  'Swift Swim':{weatherSpeed:{weather:'rain',mult:2}},
  'Chlorophyll':{weatherSpeed:{weather:'sun',mult:2}},
  'Sand Rush':{weatherSpeed:{weather:'sandstorm',mult:2}},
  'Slush Rush':{weatherSpeed:{weather:'hail',mult:2}},
  'Speed Boost':{boostPerTurn:{stat:'spe',stages:1}},
  'Levitate':{immuneTo:'Ground'},
  'Water Absorb':{immuneTo:'Water',healPercent:0.25},
  'Storm Drain':{immuneTo:'Water',boostOnImmune:{stat:'spa',stages:1}},
  'Volt Absorb':{immuneTo:'Electric',healPercent:0.25},
  'Lightning Rod':{immuneTo:'Electric',boostOnImmune:{stat:'spa',stages:1}},
  'Motor Drive':{immuneTo:'Electric',boostOnImmune:{stat:'spe',stages:1}},
  'Flash Fire':{immuneTo:'Fire',setsFlag:'flash_fire'},
  'Sap Sipper':{immuneTo:'Grass',boostOnImmune:{stat:'atk',stages:1}},
  'Wonder Guard':{onlySuperEffective:true},
  'Defiant':{onStatDrop:{stat:'atk',stages:2}},
  'Competitive':{onStatDrop:{stat:'spa',stages:2}},
  'Contrary':{reverseStatChanges:true},
  'Simple':{doubleStatChanges:true},
  'Unaware':{ignoreStatBoosts:true},
  'Magic Guard':{immuneIndirect:true},
  'Rock Head':{noRecoil:true},
  'Reckless':{recoilBoost:1.2},
  'Scrappy':{hitGhost:true},
  'Tinted Lens':{resistMult:2},
  'Sniper':{critMult:1.5},
  'Regenerator':{healOnSwitch:1/3},
  'Natural Cure':{cureOnSwitch:true},
  'Poison Heal':{healInPoison:1/8},
  'Magic Bounce':{reflectsStatus:true},
  'Prankster':{statusPriority:1},
  'Analytic':{lastMoveBoost:1.3},
  'Normalize':{normalizeTypes:true},
  'Aerilate':{changeType:{from:'Normal',to:'Flying',mult:1.2}},
  'Refrigerate':{changeType:{from:'Normal',to:'Ice',mult:1.2}},
  'Galvanize':{changeType:{from:'Normal',to:'Electric',mult:1.2}}
};

const FLAG_LISTS = {
  punch:['Fire Punch','Ice Punch','ThunderPunch','Drain Punch','Mach Punch','Bullet Punch','Mega Punch','Comet Punch','DynamicPunch','Focus Punch','Hammer Arm','Sky Uppercut','Shadow Punch','Meteor Mash','Dizzy Punch'],
  bite:['Bite','Crunch','Fire Fang','Ice Fang','Thunder Fang','Poison Fang','Hyper Fang','Bug Bite'],
  sound:['Hyper Voice','Bug Buzz','Snarl','Round','Echoed Voice','Uproar','Growl','Roar','Sing','Supersonic','Screech','Metal Sound','GrassWhistle','Perish Song','Chatter','Relic Song'],
  pulse:['Aura Sphere','Dark Pulse','Dragon Pulse','Water Pulse','Heal Pulse'],
  bullet:['Bullet Seed','Seed Bomb','Rock Blast','Rock Wrecker','Aura Sphere','Shadow Ball','Sludge Bomb','Magnet Bomb','Octazooka','Weather Ball','Energy Ball','Egg Bomb','Gyro Ball','Barrage'],
  slicing:['Slash','Night Slash','Leaf Blade','X-Scissor','Psycho Cut','Sacred Sword','Secret Sword','Air Slash','Aerial Ace','Fury Cutter','Cut','False Swipe','Cross Poison','Dragon Claw','Shadow Claw','Crush Claw'],
  wind:['Gust','Air Cutter','Icy Wind','Heat Wave','Tailwind','Whirlwind','Hurricane','Twister','Razor Wind','Ominous Wind','Silver Wind','Blizzard']
};

const MOVES_WITH_SECONDARY = new Set([
  'Fire Punch','Ice Punch','ThunderPunch','Body Slam','Rock Slide','Iron Head','Air Slash',
  'Waterfall','Zen Headbutt','Crunch','Dark Pulse','Sludge Bomb','Sludge Wave','Poison Jab','Gunk Shot',
  'Flamethrower','Fire Blast','Heat Wave','Lava Plume','Blaze Kick','Scald','Ice Beam','Blizzard',
  'Thunderbolt','Thunder','Discharge','Thunder Fang','Ice Fang','Fire Fang',
  'Psychic','Shadow Ball','Energy Ball','Earth Power','Focus Blast','Flash Cannon','Bug Buzz',
  'Dragon Rush','DragonBreath','Cross Poison','Poison Fang','Poison Tail','Sludge','Smog',
  'Stomp','Rolling Kick','Headbutt','Steamroller','Fake Out','Extrasensory','Astonish',
  'Iron Tail','Metal Claw','Steel Wing','Bite','Hyper Fang','Fire Spin','Whirlpool','Sand Tomb',
  'Bind','Wrap','Clamp','Rock Smash','Rock Tomb','Razor Leaf','Leaf Blade','Seed Bomb','Bullet Seed',
  'Aurora Beam','Bubble','BubbleBeam','Octazooka','Confusion','Psybeam','Night Slash','Poison Sting',
  'Twineedle','Charge Beam','Tri Attack','Relic Song','AncientPower','Ominous Wind','Silver Wind',
  'Acid','Acid Spray','Mud-Slap','Mud Bomb','Muddy Water','Lick'
]);

const NO_CONTACT_MOVES = new Set([
  'Earthquake','Earth Power','Magnitude','Fissure','Bulldoze',
  'Rock Slide','Rock Throw','Rock Blast','Rock Wrecker','Rock Tomb','Rock Climb','Stone Edge','Smack Down','AncientPower','Power Gem',
  'Ice Shard','Icicle Spear','Icicle Crash','Freeze-Dry',
  'Seed Bomb','Bullet Seed','Pin Missile','Barrage','Egg Bomb','Magnet Bomb','Gyro Ball',
  'Future Sight','Doom Desire','Psycho Cut','Metal Burst','Natural Gift','Fling','Present',
  'Bonemerang','Bone Rush','Bone Club','Gunk Shot','Sludge Bomb','Sludge Wave','Shadow Ball',
  'Weather Ball','Searing Shot','Fire Spin','Whirlpool','Sand Tomb','Bind','Wrap','Clamp','Magma Storm',
  'SonicBoom','Dragon Rage','Night Shade','Seismic Toss','Counter','Mirror Coat','Psywave',
  'Super Fang','Endeavor','Final Gambit','Guillotine','Horn Drill','Sheer Cold','Bide',
  'U-turn','Volt Switch','Explosion','Selfdestruct','Rock Wrecker','Spit Up'
]);

const TRUE_DAMAGE_OVERRIDES = {
  'Seismic Toss':{type:'fixed',value:'level'},
  'Night Shade':{type:'fixed',value:'level'},
  'SonicBoom':{type:'fixed',value:20},
  'Dragon Rage':{type:'fixed',value:40},
  'Super Fang':{type:'percent',value:0.5},
  'Endeavor':{type:'hp_diff'},
  'Final Gambit':{type:'user_hp'},
  'Counter':{type:'skip'},'Mirror Coat':{type:'skip'},'Metal Burst':{type:'skip'},
  'Guillotine':{type:'ohko'},'Horn Drill':{type:'ohko'},'Fissure':{type:'ohko'},'Sheer Cold':{type:'ohko'}
};

/* ============================================================
   DADOS CARREGADOS
   ============================================================ */
const POKEMON = {};
const MOVES = {};
const POKEMON_NAMES = [];
let FLAGS_MAP = {};

/* ============================================================
   HELPERS
   ============================================================ */
const $id = id => document.getElementById(id);

function el(tag, attrs={}, ...children) {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') e.className = attrs[k];
    else if (k === 'html') e.innerHTML = attrs[k];
    else if (k === 'on') for (const ev in attrs[k]) e.addEventListener(ev, attrs[k][ev]);
    else if (k === 'style') e.style.cssText = attrs[k];
    else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) e.setAttribute(k, attrs[k]);
  }
  for (const c of children) {
    if (c == null || c === false) continue;
    if (typeof c === 'string' || typeof c === 'number') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  }
  return e;
}

function showToast(msg) {
  const t = $id('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2200);
}

function titleCase(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }

function slug(s) { return s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''); }

function typeBadge(type) { return el('span', {class:'type-badge types-' + type}, type); }

function spriteUrl(name) { return 'assets/pokemon/' + slug(name) + '.png'; }
function itemUrl(name) { return 'assets/items/' + slug(name) + '.png'; }

function statStageMult(stage) {
  if (stage === 0) return 1;
  return stage > 0 ? (2 + stage) / 2 : 2 / (2 - stage);
}

/* ============================================================
   CARREGAMENTO DE DADOS
   ============================================================ */
async function loadData() {
  // Build flags map first
  for (const [flag, moves] of Object.entries(FLAG_LISTS)) {
    for (const m of moves) {
      if (!FLAGS_MAP[m]) FLAGS_MAP[m] = new Set();
      FLAGS_MAP[m].add(flag);
    }
  }

  const [monsters, movesList, abilitiesList, evolutionsList] = await Promise.all([
    fetch('monster.json').then(r => r.json()),
    fetch('moves.json').then(r => r.json()),
    fetch('ability.json').then(r => r.json()),
    fetch('evolutions.json').then(r => r.json())
  ]);

  for (const m of movesList) {
    const cat = m.skill_damage_type === 'PHYSICAL' ? 'Physical'
             : m.skill_damage_type === 'SPECIAL' ? 'Special' : 'Status';
    MOVES[m.name] = {
      name: m.name,
      type: titleCase(m.type),
      category: cat,
      power: m.base_power,
      accuracy: m.base_accuracy,
      pp: m.base_pp,
      priority: m.priority,
      trueDamage: m.true_damage,
      flags: FLAGS_MAP[m.name] || new Set(),
      hasSecondary: MOVES_WITH_SECONDARY.has(m.name)
    };
  }

  const evolutionSet = new Set();
  for (const chain of evolutionsList) {
    for (let i = 0; i < chain.length - 1; i++) evolutionSet.add(chain[i]);
  }

  for (const m of monsters) {
    if (m.forms && m.forms.length && !m.forms[0].is_released) continue;
    const types = [...new Set(m.types.map(titleCase))];
    const abilities = [...new Set(m.abilities.map(a => a.name))];
    const learnset = [...new Set(m.moves.map(mv => mv.name))];
    POKEMON[m.name] = {
      id: m.id,
      name: m.name,
      types,
      base: { hp: m.stats.hp, atk: m.stats.attack, def: m.stats.defense, spa: m.stats.sp_attack, spd: m.stats.sp_defense, spe: m.stats.speed },
      weight: m.weight / 10,
      abilities,
      learnset,
      canEvolve: evolutionSet.has(m.id)
    };
  }
  POKEMON_NAMES.push(...Object.keys(POKEMON).sort());
}

/* ============================================================
   CÁLCULOS
   ============================================================ */
function typeEffectiveness(moveType, defTypes) {
  let m = 1;
  for (const t of defTypes) {
    const c = TYPE_CHART[moveType];
    if (c && c[t] !== undefined) m *= c[t];
  }
  return m;
}

function natureMult(nature, stat) {
  const n = NATURES[nature];
  if (!n) return 1;
  if (n[0] === stat) return 1.1;
  if (n[1] === stat) return 0.9;
  return 1;
}

function calcStat(base, iv, ev, level, natMult) {
  const raw = Math.floor((2*base + iv + Math.floor(ev/4)) * level / 100) + 5;
  return Math.floor(raw * natMult);
}
function calcHp(base, iv, ev, level) {
  return Math.floor((2*base + iv + Math.floor(ev/4)) * level / 100) + level + 10;
}

function getSetStats(set, level) {
  const p = POKEMON[set.species];
  if (!p) return null;
  const iv = set.ivs || [31,31,31,31,31,31];
  const ev = set.evs || [0,0,0,0,0,0];
  return {
    hp: calcHp(p.base.hp, iv[0], ev[0], level),
    atk: calcStat(p.base.atk, iv[1], ev[1], level, natureMult(set.nature,'atk')),
    def: calcStat(p.base.def, iv[2], ev[2], level, natureMult(set.nature,'def')),
    spa: calcStat(p.base.spa, iv[3], ev[3], level, natureMult(set.nature,'spa')),
    spd: calcStat(p.base.spd, iv[4], ev[4], level, natureMult(set.nature,'spd')),
    spe: calcStat(p.base.spe, iv[5], ev[5], level, natureMult(set.nature,'spe'))
  };
}

function getEffectiveStats(set, boosts, hpPercent) {
  const p = POKEMON[set.species];
  if (!p) return null;
  const base = getSetStats(set, state.level);
  if (!base) return null;
  const item = ITEMS[set.item] || {};
  const ability = set.ability;
  const ae = ABILITY_EFFECTS[ability] || {};
  const res = { ...base };

  // Item stat multipliers
  if (item.statMult) {
    for (const k in item.statMult) res[k] = Math.floor(res[k] * item.statMult[k]);
  }
  // Eviolite only if can evolve
  if (item === ITEMS['Eviolite'] && !p.canEvolve) {
    // no effect
  }
  // Ability stat multipliers
  if (ae.statMult) for (const k in ae.statMult) res[k] = Math.floor(res[k] * ae.statMult[k]);
  if (ae.statMultIfStatus && set._status && set._status !== 'none') {
    for (const k in ae.statMultIfStatus) res[k] = Math.floor(res[k] * ae.statMultIfStatus[k]);
  }
  // Weather speed
  if (ae.weatherSpeed && ae.weatherSpeed.weather === state.field.weather) {
    res.spe = Math.floor(res.spe * ae.weatherSpeed.mult);
  }
  // Apply boosts
  for (const k of ['atk','def','spa','spd','spe']) {
    const stage = boosts[k] || 0;
    res[k] = Math.floor(res[k] * statStageMult(stage));
  }
  // Iron Ball / Lagging Tail
  if (item.halveSpeed) res.spe = Math.floor(res.spe / 2);
  res._hpPercent = hpPercent;
  res._baseStats = base;
  return res;
}

/* Poder real considerando peso/velocidade/HP/etc. */
function getActualPower(moveName, atkSet, defSet, opts) {
  const atkP = POKEMON[atkSet.species];
  const defP = POKEMON[defSet.species];
  const wAtk = atkP ? atkP.weight : 1;
  const wDef = defP ? defP.weight : 1;

  if (moveName === 'Low Kick' || moveName === 'Grass Knot') {
    if (wDef < 10) return 20;
    if (wDef < 25) return 40;
    if (wDef < 50) return 60;
    if (wDef < 100) return 80;
    if (wDef < 200) return 100;
    return 120;
  }
  if (moveName === 'Heavy Slam' || moveName === 'Heat Crash') {
    const ratio = wAtk / Math.max(0.1, wDef);
    if (ratio >= 5) return 120;
    if (ratio >= 4) return 100;
    if (ratio >= 3) return 80;
    if (ratio >= 2) return 60;
    return 40;
  }
  if (moveName === 'Gyro Ball') {
    const A = getSetStats(atkSet, state.level);
    const D = getSetStats(defSet, state.level);
    if (!A || !D) return 1;
    return Math.min(150, Math.floor(25 * D.spe / Math.max(1, A.spe)) + 1);
  }
  if (moveName === 'Electro Ball') {
    const A = getSetStats(atkSet, state.level);
    const D = getSetStats(defSet, state.level);
    if (!A || !D) return 1;
    const r = A.spe / Math.max(1, D.spe);
    if (r >= 4) return 150;
    if (r >= 3) return 120;
    if (r >= 2) return 80;
    if (r >= 1) return 60;
    return 40;
  }
  if (moveName === 'Flail' || moveName === 'Reversal') {
    const hp = opts.atkHp / 100;
    if (hp >= 0.6875) return 20;
    if (hp >= 0.3542) return 40;
    if (hp >= 0.2083) return 80;
    if (hp >= 0.1042) return 100;
    if (hp >= 0.0417) return 150;
    return 200;
  }
  if (moveName === 'Wring Out' || moveName === 'Crush Grip') {
    return Math.max(1, Math.floor(120 * (opts.defHp / 100)));
  }
  if (moveName === 'Water Spout' || moveName === 'Eruption') {
    return Math.max(1, Math.floor(150 * (opts.atkHp / 100)));
  }
  if (moveName === 'Return' || moveName === 'Frustration') return 102;
  if (moveName === 'Punishment') return Math.min(200, 60 + 20 * 0); // aproximação
  if (moveName === 'Stored Power') return 20 + 20 * (opts.atkBoosts.atk + opts.atkBoosts.spa + opts.atkBoosts.spe);
  if (moveName === 'Spit Up') return 100;
  if (moveName === 'Magnitude') return 70; // média
  if (moveName === 'Present') return 40; // média
  return MOVES[moveName] ? MOVES[moveName].power : 0;
}

/* ============================================================
   CÁLCULO DE DANO
   ============================================================ */
function calcDamage(atkSet, defSet, moveName, opts) {
  const move = MOVES[moveName];
  if (!move) return null;
  if (move.category === 'Status') return { status: true, moveType: move.type };
  const atkP = POKEMON[atkSet.species];
  const defP = POKEMON[defSet.species];
  if (!atkP || !defP) return null;

  // True damage overrides
  if (move.trueDamage) {
    const ov = TRUE_DAMAGE_OVERRIDES[moveName];
    if (ov) {
      if (ov.type === 'fixed') {
        const dmg = ov.value === 'level' ? state.level : ov.value;
        return { min: dmg, max: dmg, pct: [dmg / 1, dmg / 1], fixed: true, moveType: move.type };
      }
      if (ov.type === 'ohko') return { ohko: true, moveType: move.type };
      if (ov.type === 'skip') return { skip: true, moveType: move.type };
      if (ov.type === 'hp_diff') {
        const defHp = getSetStats(defSet, state.level).hp * opts.defHp / 100;
        const atkHp = getSetStats(atkSet, state.level).hp * opts.atkHp / 100;
        const dmg = Math.max(0, Math.floor(defHp - atkHp));
        return { min: dmg, max: dmg, fixed: true, moveType: move.type };
      }
      if (ov.type === 'user_hp') {
        const dmg = Math.floor(getSetStats(atkSet, state.level).hp * opts.atkHp / 100);
        return { min: dmg, max: dmg, fixed: true, moveType: move.type };
      }
      if (ov.type === 'percent') {
        const defHp = getSetStats(defSet, state.level).hp * opts.defHp / 100;
        const dmg = Math.floor(defHp * ov.value);
        return { min: dmg, max: dmg, fixed: true, moveType: move.type };
      }
    }
  }

  // Ability immunities on defender
  const defAE = ABILITY_EFFECTS[defSet.ability] || {};
  if (defAE.immuneTo === move.type) return { immune: true, moveType: move.type };
  if (move.type === 'Ground' && defSet.ability === 'Levitate') return { immune: true, moveType: move.type };
  // Air Balloon
  if (move.type === 'Ground' && (ITEMS[defSet.item]||{}).immuneTo && ITEMS[defSet.item].immuneTo.includes('Ground')) return { immune: true, moveType: move.type };

  // Wonder Guard
  if (defSet.ability === 'Wonder Guard' && typeEffectiveness(move.type, defP.types) <= 1) return { immune: true, moveType: move.type };

  const atkStats = getEffectiveStats(atkSet, opts.atkBoosts, opts.atkHp);
  const defStats = getEffectiveStats(defSet, opts.defBoosts, opts.defHp);
  if (!atkStats || !defStats) return null;

  const isPhysical = move.category === 'Physical';
  let A = isPhysical ? atkStats.atk : atkStats.spa;
  let D = isPhysical ? defStats.def : defStats.spd;

  // Huge Power, Pure Power
  const atkAE = ABILITY_EFFECTS[atkSet.ability] || {};

  // Actual power (weight-based, speed-based, etc.)
  let power = getActualPower(moveName, atkSet, defSet, opts);
  if (!power || power < 1) power = 1;

  // Power multipliers from abilities
  if (atkAE.powerBoost) {
    const pb = atkAE.powerBoost;
    if (pb.maxPower && power <= pb.maxPower) power = Math.floor(power * pb.mult);
    else if (pb.flag && move.flags.has(pb.flag)) power = Math.floor(power * pb.mult);
    else if (pb.secondary && move.hasSecondary) power = Math.floor(power * pb.mult);
  }
  if (atkAE.weatherBoost && atkAE.weatherBoost.weather === opts.weather && atkAE.weatherBoost.types.includes(move.type)) {
    power = Math.floor(power * atkAE.weatherBoost.mult);
  }
  if (atkAE.lastMoveBoost) power = Math.floor(power * atkAE.lastMoveBoost); // aprox: assume "last"

  // Item type boost
  const atkItem = ITEMS[atkSet.item] || {};
  if (atkItem.typeBoost === move.type) power = Math.floor(power * atkItem.typeMult);

  // Type effectiveness
  let typeEff = typeEffectiveness(move.type, defP.types);
  if (moveName === 'Freeze-Dry' && defP.types.includes('Water')) typeEff *= 2;

  // Scrappy: Normal/Fighting hit Ghost
  if (atkSet.ability === 'Scrappy' && defP.types.includes('Ghost') && (move.type === 'Normal' || move.type === 'Fighting')) {
    typeEff = typeEffectiveness(move.type, defP.types.filter(t => t !== 'Ghost'));
  }

  if (typeEff === 0) return { immune: true, moveType: move.type };

  // Base damage
  const level = opts.level || 50;
  let damage = Math.floor(Math.floor(Math.floor(2*level/5 + 2) * power * A / D) / 50) + 2;

  // Multipliers
  let mult = 1;

  // STAB
  if (atkP.types.includes(move.type)) {
    mult *= (atkAE.stabMult) || (atkSet.ability === 'Adaptability' ? 2 : 1.5);
  }
  // Type effectiveness
  mult *= typeEff;
  // Crit
  if (opts.crit) mult *= 2 * (atkSet.ability === 'Sniper' ? 1.5 : 1);
  // Weather
  if (opts.weather === 'sun') {
    if (move.type === 'Fire') mult *= 1.5;
    if (move.type === 'Water') mult *= 0.5;
  } else if (opts.weather === 'rain') {
    if (move.type === 'Water') mult *= 1.5;
    if (move.type === 'Fire') mult *= 0.5;
  }
  // Screens
  if (isPhysical && opts.reflect) mult *= 0.5;
  if (!isPhysical && opts.lightScreen) mult *= 0.5;
  // Defender abilities
  if (defAE.typeResist && defAE.typeResist.types.includes(move.type)) mult *= defAE.typeResist.mult;
  if (defAE.superEffResist && typeEff > 1) mult *= defAE.superEffResist;
  if (defAE.fullHpResist && opts.defHp >= 100) mult *= defAE.fullHpResist;
  // Tinted Lens
  if (atkAE.resistMult && typeEff < 1) mult *= atkAE.resistMult;
  // Burn
  if (atkSet._status === 'burned' && isPhysical && atkSet.ability !== 'Guts') mult *= 0.5;
  // Life Orb
  if (atkItem.damageMult) {
    if (atkItem.physicalOnly && !isPhysical) { /* no */ }
    else if (atkItem.specialOnly && isPhysical) { /* no */ }
    else mult *= atkItem.damageMult;
  }
  // Expert Belt
  if (atkItem.superEffMult && typeEff > 1) mult *= atkItem.superEffMult;

  const min = Math.max(1, Math.floor(damage * mult * 0.85));
  const max = Math.max(1, Math.floor(damage * mult * 1.0));
  const defHp = getSetStats(defSet, state.level).hp;

  return {
    min, max,
    pct: [ Math.min(100, Math.round(min/defHp*1000)/10), Math.min(100, Math.round(max/defHp*1000)/10) ],
    moveType: move.type,
    typeEff
  };
}

/* ============================================================
   TEAM BUILDING
   ============================================================ */
function renderTeam() {
  const grid = $id('teamGrid');
  grid.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const set = state.team[i];
    if (!set) {
      grid.appendChild(el('div', {class:'slot', on:{click:() => openEditor(i)}},
        el('div', {class:'empty-icon'}, '+'),
        el('div', {}, 'Adicionar')
      ));
    } else {
      const p = POKEMON[set.species];
      if (!p) { grid.appendChild(el('div', {class:'slot'}, 'Erro')); continue; }
      const img = el('img', {class:'pkm-sprite', alt:p.name});
      img.src = spriteUrl(p.name);
      img.onerror = () => img.style.display = 'none';
      const slot = el('div', {class:'slot filled'},
        img,
        el('div', {class:'p-name'}, p.name),
        el('div', {class:'p-types'}, ...p.types.map(typeBadge)),
        el('div', {class:'p-moves'},
          el('div', {}, (set.item && set.item !== 'None' ? set.item : 'Sem item') + ' · ' + set.nature),
          ...(set.moves || []).slice(0, 4).map(m => el('div', {}, '• ' + m))
        ),
        el('div', {class:'p-actions'},
          el('button', {class:'small', on:{click:() => openEditor(i)}}, 'Editar'),
          el('button', {class:'small danger', on:{click:() => { state.team[i] = null; renderTeam(); refreshDamageSelectors(); }}}, '×')
        )
      );
      grid.appendChild(slot);
    }
  }
}

/* ============================================================
   MODAL DE EDIÇÃO
   ============================================================ */
function openEditor(slot) {
  state.editingSlot = slot;
  const existing = state.team[slot];
  $id('modalTitle').textContent = existing ? 'Editar Pokémon' : 'Adicionar Pokémon';
  const body = $id('modalBody');
  body.innerHTML = '';

  const set = existing ? JSON.parse(JSON.stringify(existing)) : {
    species: '', nature: 'Adamant', ability: '', item: 'None',
    evs: [0,0,0,0,0,0], ivs: [31,31,31,31,31,31],
    moves: ['','','','']
  };

  // Search Pokemon
  const searchInput = el('input', {type:'text', placeholder:'Buscar...', value:set.species || ''});
  const searchResults = el('div', {class:'search-results'});
  const searchGroup = el('div', {class:'form-group pokemon-search'},
    el('label', {}, 'Pokémon'), searchInput, searchResults);
  body.appendChild(el('div', {class:'form-row'}, searchGroup));

  function showResults(q) {
    const ql = q.toLowerCase().trim();
    const matches = POKEMON_NAMES.filter(n => n.toLowerCase().includes(ql)).slice(0, 25);
    searchResults.innerHTML = '';
    if (!matches.length) { searchResults.classList.remove('open'); return; }
    for (const name of matches) {
      const mini = el('img', {class:'pkm-sprite-mini'});
      mini.src = spriteUrl(name);
      mini.onerror = () => mini.style.display = 'none';
      searchResults.appendChild(el('div', {class:'item', on:{
        click: () => {
          set.species = name;
          searchInput.value = name;
          searchResults.classList.remove('open');
          updateAll();
        }
      }}, mini, ' ' + name));
    }
    searchResults.classList.add('open');
  }
  searchInput.addEventListener('input', e => showResults(e.target.value));
  searchInput.addEventListener('focus', () => showResults(searchInput.value));
  document.addEventListener('click', function closeSearch(e){
    if (!searchGroup.contains(e.target)) searchResults.classList.remove('open');
  });

  const natureSel = el('select');
  for (const n in NATURES) natureSel.appendChild(el('option', {value:n}, n + (NATURES[n] ? ` (+${NATURES[n][0]}/-${NATURES[n][1]})` : '')));
  natureSel.value = set.nature;
  natureSel.onchange = () => { set.nature = natureSel.value; updateStats(); };

  const abilitySel = el('select');
  abilitySel.onchange = () => { set.ability = abilitySel.value; };

  const itemSel = el('select');
  for (const i in ITEMS) itemSel.appendChild(el('option', {value:i}, i));
  itemSel.value = set.item;
  itemSel.onchange = () => { set.item = itemSel.value; updateStats(); };

  const evGrid = el('div', {class:'ev-grid'});
  const STAT_LABELS = ['HP','Atk','Def','SpA','SpD','Spe'];
  for (let i = 0; i < 6; i++) {
    const inp = el('input', {type:'number', min:0, max:252, value:set.evs[i]});
    inp.oninput = () => { set.evs[i] = Math.max(0, Math.min(252, parseInt(inp.value)||0)); inp.value = set.evs[i]; updateStats(); };
    evGrid.appendChild(el('div', {class:'ev-col'}, el('label', {}, STAT_LABELS[i]), inp));
  }
  const evTotal = el('div', {class:'ev-total'});

  const ivGrid = el('div', {class:'ev-grid'});
  for (let i = 0; i < 6; i++) {
    const inp = el('input', {type:'number', min:0, max:31, value:set.ivs[i]});
    inp.oninput = () => { set.ivs[i] = Math.max(0, Math.min(31, parseInt(inp.value)||0)); inp.value = set.ivs[i]; updateStats(); };
    ivGrid.appendChild(el('div', {class:'ev-col'}, el('label', {}, STAT_LABELS[i]), inp));
  }

  const movesContainer = el('div', {class:'move-selects'});
  const moveSelects = [];
  for (let i = 0; i < 4; i++) {
    const sel = el('select');
    sel.onchange = () => { set.moves[i] = sel.value; };
    moveSelects.push(sel);
    movesContainer.appendChild(sel);
  }

  const statsDisplay = el('div', {class:'stats-display'});

  function updateStats() {
    if (!set.species) { statsDisplay.innerHTML = ''; evTotal.textContent = ''; return; }
    const stats = getSetStats(set, state.level);
    if (!stats) return;
    statsDisplay.innerHTML = '';
    const labels = {hp:'HP', atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
    for (const k of ['hp','atk','def','spa','spd','spe']) {
      statsDisplay.appendChild(el('div', {}, el('span', {}, labels[k]), el('span', {}, String(stats[k]))));
    }
    const total = set.evs.reduce((a,b) => a+b, 0);
    evTotal.textContent = `${total} / 510`;
    evTotal.className = 'ev-total' + (total > 510 ? ' over' : total > 480 ? ' warn' : '');
  }

  function updateAll() {
    const p = POKEMON[set.species];
    if (p) {
      abilitySel.innerHTML = '';
      for (const a of p.abilities) abilitySel.appendChild(el('option', {value:a}, a));
      if (!p.abilities.includes(set.ability)) set.ability = p.abilities[0];
      abilitySel.value = set.ability;

      for (let i = 0; i < 4; i++) {
        const sel = moveSelects[i];
        sel.innerHTML = '';
        sel.appendChild(el('option', {value:''}, '—'));
        for (const m of p.learnset.sort()) sel.appendChild(el('option', {value:m}, m));
        sel.value = set.moves[i] || '';
      }
    }
    updateStats();
  }

  const form = el('div', {},
    el('div', {class:'form-row'},
      el('div', {class:'form-group'}, el('label', {}, 'Natureza'), natureSel),
      el('div', {class:'form-group'}, el('label', {}, 'Habilidade'), abilitySel),
      el('div', {class:'form-group'}, el('label', {}, 'Item'), itemSel)
    ),
    el('div', {class:'form-group mt'}, el('label', {}, 'EVs (máx 510, máx 252/stat)'), evGrid, evTotal),
    el('div', {class:'form-group mt'}, el('label', {}, 'IVs'), ivGrid),
    el('div', {class:'form-group mt'}, el('label', {}, 'Golpes'), movesContainer),
    el('div', {class:'mt'}, el('h3', {}, 'Stats (Nv. 50)'), statsDisplay),
    el('div', {class:'inline-flex mt'},
      el('button', {class:'primary', on:{click:() => {
        if (!set.species) { showToast('Selecione um Pokémon'); return; }
        const cleanMoves = set.moves.filter(m => m);
        if (!cleanMoves.length) { showToast('Adicione pelo menos 1 golpe'); return; }
        state.team[state.editingSlot] = {
          species: set.species, nature: set.nature, ability: set.ability, item: set.item,
          evs: [...set.evs], ivs: [...set.ivs], moves: cleanMoves
        };
        closeModal(); renderTeam(); refreshDamageSelectors();
      }}}, 'Salvar'),
      el('button', {on:{click:closeModal}}, 'Cancelar'),
      existing ? el('button', {class:'danger', on:{click:() => {
        state.team[state.editingSlot] = null;
        closeModal(); renderTeam(); refreshDamageSelectors();
      }}}, 'Remover') : null
    )
  );
  body.appendChild(form);
  updateAll();
  $id('modal').classList.add('open');
}
function closeModal() { $id('modal').classList.remove('open'); state.editingSlot = null; }

/* ============================================================
   CALCULADORA DE DANO
   ============================================================ */
function refreshDamageSelectors() {
  renderDamageSide('atk');
  renderDamageSide('def');
}

function renderDamageSide(side) {
  const container = $id(side === 'atk' ? 'atkPanel' : 'defPanel');
  container.innerHTML = '';
  const current = side === 'atk' ? state.damageAtk : state.damageDef;

  const speciesSel = el('select', {class:'mb'});
  speciesSel.appendChild(el('option', {value:''}, '— Selecionar Pokémon —'));
  const teamOpts = state.team
    .map((p, i) => p ? {i, name:p.species} : null)
    .filter(Boolean);
  if (teamOpts.length) {
    const grp = el('optgroup', {label:'Do Time'});
    for (const t of teamOpts) grp.appendChild(el('option', {value:'team:'+t.i}, t.name + ' (slot ' + t.i + ')'));
    speciesSel.appendChild(grp);
  }
  const grp2 = el('optgroup', {label:'Pokédex'});
  for (const n of POKEMON_NAMES) grp2.appendChild(el('option', {value:'dex:'+n}, n));
  speciesSel.appendChild(grp2);

  let working = current ? JSON.parse(JSON.stringify(current)) : {
    species:'', nature:'Adamant', ability:'', item:'None',
    evs:[0,0,0,0,0,0], ivs:[31,31,31,31,31,31], moves:['','','','']
  };
  if (current) speciesSel.value = 'dex:' + current.species;

  speciesSel.onchange = () => {
    const v = speciesSel.value;
    if (!v) working.species = '';
    else if (v.startsWith('team:')) {
      const idx = parseInt(v.substring(5));
      const t = state.team[idx];
      if (t) working = JSON.parse(JSON.stringify(t));
    } else {
      const name = v.substring(4);
      const p = POKEMON[name];
      working = {
        species: name, nature: 'Adamant',
        ability: p.abilities[0], item: 'None',
        evs: [0,0,0,0,0,0], ivs: [31,31,31,31,31,31],
        moves: p.learnset.slice(0, 4)
      };
    }
    if (side === 'atk') state.damageAtk = working; else state.damageDef = working;
    renderDamageSide(side);
    updateDamageResults();
  };
  container.appendChild(el('div', {class:'form-group'}, el('label', {}, 'Pokémon'), speciesSel));

  if (!working.species) {
    container.appendChild(el('p', {class:'hint'}, 'Selecione um Pokémon.'));
    return;
  }
  const p = POKEMON[working.species];

  const natureSel = el('select');
  for (const n in NATURES) natureSel.appendChild(el('option', {value:n}, n));
  natureSel.value = working.nature;
  natureSel.onchange = () => { working.nature = natureSel.value; saveSide(); };

  const abilitySel = el('select');
  for (const a of p.abilities) abilitySel.appendChild(el('option', {value:a}, a));
  abilitySel.value = working.ability;
  abilitySel.onchange = () => { working.ability = abilitySel.value; saveSide(); };

  const itemSel = el('select');
  for (const i in ITEMS) itemSel.appendChild(el('option', {value:i}, i));
  itemSel.value = working.item;
  itemSel.onchange = () => { working.item = itemSel.value; saveSide(); };

  container.appendChild(el('div', {class:'form-row'},
    el('div', {class:'form-group'}, el('label', {}, 'Natureza'), natureSel),
    el('div', {class:'form-group'}, el('label', {}, 'Habilidade'), abilitySel),
    el('div', {class:'form-group'}, el('label', {}, 'Item'), itemSel)
  ));

  // EVs
  const evGrid = el('div', {class:'ev-grid'});
  const STAT_LABELS = ['HP','Atk','Def','SpA','SpD','Spe'];
  for (let i = 0; i < 6; i++) {
    const inp = el('input', {type:'number', min:0, max:252, value:working.evs[i]});
    inp.onchange = () => { working.evs[i] = Math.max(0, Math.min(252, parseInt(inp.value)||0)); saveSide(); };
    evGrid.appendChild(el('div', {class:'ev-col'}, el('label', {}, STAT_LABELS[i]), inp));
  }
  container.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'EVs'), evGrid));

  // IVs
  const ivGrid = el('div', {class:'ev-grid'});
  for (let i = 0; i < 6; i++) {
    const inp = el('input', {type:'number', min:0, max:31, value:working.ivs[i]});
    inp.onchange = () => { working.ivs[i] = Math.max(0, Math.min(31, parseInt(inp.value)||0)); saveSide(); };
    ivGrid.appendChild(el('div', {class:'ev-col'}, el('label', {}, STAT_LABELS[i]), inp));
  }
  container.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'IVs'), ivGrid));

  // Moves (atacante apenas)
  if (side === 'atk') {
    const mv = el('div', {class:'form-group mt'}, el('label', {}, 'Golpes'));
    for (let i = 0; i < 4; i++) {
      const sel = el('select', {class:'mb'});
      sel.appendChild(el('option', {value:''}, '— Vazio —'));
      for (const m of p.learnset.sort()) sel.appendChild(el('option', {value:m}, m));
      sel.value = working.moves[i] || '';
      sel.onchange = () => { working.moves[i] = sel.value; saveSide(); updateDamageResults(); };
      mv.appendChild(sel);
    }
    container.appendChild(mv);
  }

  // HP% e status
  const hpInput = el('input', {type:'number', min:1, max:100, value: side === 'atk' ? state.field.atkHp : state.field.defHp});
  hpInput.onchange = () => {
    if (side === 'atk') state.field.atkHp = Math.max(1, Math.min(100, parseInt(hpInput.value)||100));
    else state.field.defHp = Math.max(1, Math.min(100, parseInt(hpInput.value)||100));
    updateDamageResults();
  };
  container.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'HP atual (%)'), hpInput));

  // Boosts
  const boostStats = side === 'atk' ? ['atk','spa','spe'] : ['def','spd','spe'];
  const boostObj = side === 'atk' ? state.field.atkBoosts : state.field.defBoosts;
  const boostContainer = el('div', {class:'mt'});
  for (const stat of boostStats) {
    const inp = el('input', {type:'range', min:-6, max:6, value:boostObj[stat], style:'width:100%'});
    const val = el('span', {class:'val'}, (boostObj[stat] >= 0 ? '+' : '') + boostObj[stat]);
    inp.oninput = () => {
      boostObj[stat] = parseInt(inp.value);
      val.textContent = (parseInt(inp.value) >= 0 ? '+' : '') + inp.value;
      updateDamageResults();
    };
    boostContainer.appendChild(el('div', {class:'boost-row'},
      el('span', {}, stat.toUpperCase()), inp, val));
  }
  container.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'Boosts'), boostContainer));

  // Stats preview
  const stats = getSetStats(working, state.level);
  const preview = el('div', {class:'stats-display mt'});
  if (stats) for (const k of ['hp','atk','def','spa','spd','spe']) {
    preview.appendChild(el('div', {}, el('span', {}, k.toUpperCase()), el('span', {}, String(stats[k]))));
  }
  container.appendChild(preview);

  function saveSide() {
    if (side === 'atk') state.damageAtk = working; else state.damageDef = working;
    updateDamageResults();
  }
}

function renderFieldOpts() {
  const container = $id('fieldOpts');
  container.innerHTML = '';
  const weatherSel = el('select');
  weatherSel.appendChild(el('option', {value:'none'}, 'Nenhum'));
  weatherSel.appendChild(el('option', {value:'sun'}, 'Sol'));
  weatherSel.appendChild(el('option', {value:'rain'}, 'Chuva'));
  weatherSel.appendChild(el('option', {value:'sandstorm'}, 'Tempestade de Areia'));
  weatherSel.appendChild(el('option', {value:'hail'}, 'Granizo'));
  weatherSel.value = state.field.weather;
  weatherSel.onchange = () => { state.field.weather = weatherSel.value; updateDamageResults(); };
  container.appendChild(el('label', {}, 'Clima: ', weatherSel));

  const critCb = el('input', {type:'checkbox', checked:state.field.crit, on:{change:() => { state.field.crit = critCb.checked; updateDamageResults(); }}});
  container.appendChild(el('label', {}, critCb, ' Crítico'));

  const refCb = el('input', {type:'checkbox', checked:state.field.reflect, on:{change:() => { state.field.reflect = refCb.checked; updateDamageResults(); }}});
  container.appendChild(el('label', {}, refCb, ' Reflect'));

  const lsCb = el('input', {type:'checkbox', checked:state.field.lightScreen, on:{change:() => { state.field.lightScreen = lsCb.checked; updateDamageResults(); }}});
  container.appendChild(el('label', {}, lsCb, ' Light Screen'));
}

function updateDamageResults() {
  const container = $id('damageResults');
  const atk = state.damageAtk, def = state.damageDef;
  if (!atk || !atk.species || !def || !def.species) {
    container.innerHTML = '<p class="hint">Selecione atacante e defensor.</p>';
    return;
  }
  if (!atk.moves || !atk.moves.length) {
    container.innerHTML = '<p class="hint">Atacante sem golpes.</p>';
    return;
  }
  atk._status = atk._status || 'none';
  def._status = def._status || 'none';

  const opts = {
    level: state.level,
    weather: state.field.weather,
    crit: state.field.crit,
    reflect: state.field.reflect,
    lightScreen: state.field.lightScreen,
    atkBoosts: state.field.atkBoosts,
    defBoosts: state.field.defBoosts,
    atkHp: state.field.atkHp,
    defHp: state.field.defHp
  };
  const defStats = getSetStats(def, state.level);
  const defHp = defStats ? defStats.hp : 1;

  const table = el('table', {class:'result-table'},
    el('thead', {}, el('tr', {},
      el('th', {}, 'Golpe'), el('th', {}, 'Tipo'), el('th', {}, 'Dano'), el('th', {}, '% HP'), el('th', {}, 'K.O.')
    )),
    el('tbody')
  );
  const tbody = table.querySelector('tbody');
  for (const moveName of atk.moves) {
    if (!moveName) continue;
    const r = calcDamage(atk, def, moveName, opts);
    if (!r) continue;
    if (r.status) {
      tbody.appendChild(el('tr', {}, el('td', {}, moveName), el('td', {}, typeBadge(r.moveType)), el('td', {}, '—'), el('td', {}, '—'), el('td', {}, el('span', {class:'ko-none'}, 'Status'))));
      continue;
    }
    if (r.skip) {
      tbody.appendChild(el('tr', {}, el('td', {}, moveName), el('td', {}, typeBadge(r.moveType)), el('td', {}, 'Reativo'), el('td', {}, '—'), el('td', {}, el('span', {class:'ko-none'}, '—'))));
      continue;
    }
    if (r.ohko) {
      tbody.appendChild(el('tr', {}, el('td', {}, moveName), el('td', {}, typeBadge(r.moveType)), el('td', {}, 'OHKO'), el('td', {}, '100%'), el('td', {}, el('span', {class:'ko-guaranteed'}, 'OHKO'))));
      continue;
    }
    if (r.immune) {
      tbody.appendChild(el('tr', {}, el('td', {}, moveName), el('td', {}, typeBadge(r.moveType)), el('td', {}, 'Imune'), el('td', {}, '0%'), el('td', {}, el('span', {class:'ko-none'}, 'IMUNE'))));
      continue;
    }
    let koLabel, koClass;
    if (r.fixed) { koLabel = 'Fixo'; koClass = 'ko-possible'; }
    else if (r.pct[0] >= 100) { koLabel = 'OHKO garantido'; koClass = 'ko-guaranteed'; }
    else if (r.pct[1] >= 100) { koLabel = 'OHKO possível'; koClass = 'ko-possible'; }
    else if (r.pct[1] >= 50) { koLabel = '2HKO possível'; koClass = 'ko-possible'; }
    else { koLabel = Math.ceil(100 / Math.max(0.1, r.pct[1])) + 'HKO'; koClass = 'ko-none'; }
    const pctBar = el('div', {class:'pct-bar'}, el('div', {class:'pct-bar-fill', style:`width:${Math.min(100, r.pct[1])}%`}));
    tbody.appendChild(el('tr', {},
      el('td', {}, moveName),
      el('td', {}, typeBadge(r.moveType)),
      el('td', {}, `${r.min} - ${r.max}`),
      el('td', {}, `${r.pct[0]}% - ${r.pct[1]}%`, pctBar),
      el('td', {}, el('span', {class:'ko-badge ' + koClass}, koLabel))
    ));
  }
  container.innerHTML = '';
  container.appendChild(table);
  container.appendChild(el('p', {class:'hint'}, `HP do defensor: ${defHp}. Nível ${state.level}.`));
}

/* ============================================================
   BUFFS / DEBUFFS
   ============================================================ */
function renderBuffs() {
  const pSel = $id('buffPokemon');
  if (pSel.options.length === 0) {
    pSel.appendChild(el('option', {value:''}, '— Selecione —'));
    for (const n of POKEMON_NAMES) pSel.appendChild(el('option', {value:n}, n));
  }
  const nSel = $id('buffNature');
  if (nSel.options.length === 0) for (const n in NATURES) nSel.appendChild(el('option', {value:n}, n));
  const iSel = $id('buffItem');
  if (iSel.options.length === 0) for (const i in ITEMS) iSel.appendChild(el('option', {value:i}, i));

  pSel.onchange = renderBuffDetails;
  nSel.onchange = renderBuffDetails;
  iSel.onchange = renderBuffDetails;

  // Status buttons
  const statusContainer = $id('buffStatus');
  statusContainer.innerHTML = '';
  const statuses = ['none','burned','poisoned','badly_poisoned','paralyzed','frozen','asleep'];
  const labels = {none:'Nenhum', burned:'Queimado', poisoned:'Envenenado', badly_poisoned:'Tóxico', paralyzed:'Paralisado', frozen:'Congelado', asleep:'Dormindo'};
  for (const s of statuses) {
    statusContainer.appendChild(el('button', {class:'small', style: state.buffStatus === s ? 'background:var(--wine);border-color:var(--wine-light)' : '', on:{
      click: () => { state.buffStatus = s; renderBuffs(); }
    }}, labels[s]));
  }
  if (!state.buffStatus) state.buffStatus = 'none';
  renderBuffDetails();
}

function renderBuffDetails() {
  const species = $id('buffPokemon').value;
  const nature = $id('buffNature').value;
  const item = $id('buffItem').value;
  if (!species) {
    $id('buffResult').innerHTML = '<p class="hint">Selecione um Pokémon.</p>';
    return;
  }
  const p = POKEMON[species];
  const abilitySel = $id('buffAbility');
  if (abilitySel.dataset.species !== species) {
    abilitySel.innerHTML = '';
    for (const a of p.abilities) abilitySel.appendChild(el('option', {value:a}, a));
    abilitySel.dataset.species = species;
    abilitySel.onchange = renderBuffDetails;
  }
  const ability = abilitySel.value || p.abilities[0];

  // EVs
  const evContainer = $id('buffEVs');
  if (!evContainer.dataset.built) {
    evContainer.innerHTML = '';
    const labels = ['HP','Atk','Def','SpA','SpD','Spe'];
    for (let i = 0; i < 6; i++) {
      const inp = el('input', {type:'number', min:0, max:252, value: state.buffEvs[i] || 0});
      inp.onchange = () => {
        state.buffEvs[i] = Math.max(0, Math.min(252, parseInt(inp.value) || 0));
        renderBuffDetails();
      };
      evContainer.appendChild(el('div', {class:'ev-col'}, el('label', {}, labels[i]), inp));
    }
    evContainer.dataset.built = '1';
  }
  const totalEv = state.buffEvs.reduce((a,b) => a+b, 0);
  const evTotalEl = $id('buffEvTotal');
  evTotalEl.textContent = `${totalEv} / 510`;
  evTotalEl.className = 'ev-total' + (totalEv > 510 ? ' over' : totalEv > 480 ? ' warn' : '');

  // Boost row
  const boostContainer = $id('buffBoosts');
  boostContainer.innerHTML = '';
  for (const stat of ['atk','def','spa','spd','spe']) {
    const val = el('span', {class:'val'}, (state.buffBoosts[stat] >= 0 ? '+' : '') + state.buffBoosts[stat]);
    const dec = el('button', {class:'small', on:{click:() => { state.buffBoosts[stat] = Math.max(-6, state.buffBoosts[stat]-1); renderBuffDetails(); }}}, '−');
    const inc = el('button', {class:'small', on:{click:() => { state.buffBoosts[stat] = Math.min(6, state.buffBoosts[stat]+1); renderBuffDetails(); }}}, '+');
    boostContainer.appendChild(el('div', {class:'boost-row'},
      el('span', {}, stat.toUpperCase()),
      el('div', {class:'inline-flex'}, dec, val, inc),
      el('span', {class:'mult'}, '×' + statStageMult(state.buffBoosts[stat]).toFixed(2))
    ));
  }

  // Compute stats
  const set = {species, nature, ability, item, evs:state.buffEvs, ivs:[31,31,31,31,31,31], moves:[]};
  const base = getSetStats(set, state.level);
  const result = $id('buffResult');
  result.innerHTML = '';
  const labels = {hp:'HP', atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};

  const finalStats = { ...base };
  for (const k of ['atk','def','spa','spd','spe']) {
    finalStats[k] = Math.floor(base[k] * statStageMult(state.buffBoosts[k]));
  }
  // Status effects
  let noteStatus = '';
  if (state.buffStatus === 'burned') {
    finalStats.atk = Math.floor(finalStats.atk / 2);
    noteStatus = 'Queimado: Atk ÷ 2';
  } else if (state.buffStatus === 'paralyzed') {
    finalStats.spe = Math.floor(finalStats.spe / 2);
    noteStatus = 'Paralisado: Spe ÷ 2';
  }

  const grid = el('div', {class:'stat-changes'});
  grid.appendChild(el('div', {class:'stat-box'},
    el('div', {class:'lbl'}, 'HP'),
    el('div', {class:'num'}, String(base.hp)),
    el('div', {class:'mult'}, '—')));
  for (const k of ['atk','def','spa','spd','spe']) {
    const baseVal = base[k], finalVal = finalStats[k];
    const mult = (finalVal / baseVal).toFixed(2);
    grid.appendChild(el('div', {class:'stat-box'},
      el('div', {class:'lbl'}, labels[k]),
      el('div', {class:'num'}, String(finalVal)),
      el('div', {class:'mult'}, `base ${baseVal} × ${mult}`)));
  }
  result.appendChild(grid);
  result.appendChild(el('p', {class:'hint'}, `Nível ${state.level}. ${noteStatus}`));
}

/* ============================================================
   ANÁLISE
   ============================================================ */
function renderAnalysis() {
  // Defensive synergy
  const defContainer = $id('defAnalysis');
  defContainer.innerHTML = '';
  const teamTypes = [];
  for (const p of state.team) if (p && POKEMON[p.species]) teamTypes.push(...POKEMON[p.species].types);
  if (teamTypes.length === 0) {
    defContainer.innerHTML = '<p class="hint">Adicione Pokémon ao time.</p>';
  } else {
    for (const atkType of TYPES) {
      let w4=0,w2=0,r4=0,r2=0,im=0;
      for (const p of state.team) {
        if (!p || !POKEMON[p.species]) continue;
        const eff = typeEffectiveness(atkType, POKEMON[p.species].types);
        if (eff === 0) im++;
        else if (eff === 0.25) r4++;
        else if (eff === 0.5) r2++;
        else if (eff === 2) w2++;
        else if (eff === 4) w4++;
      }
      let cls = 'type-cell', cnt = '';
      if (im > 0) { cls += ' immune'; cnt = `×${im}`; }
      else if (w4 > 0) { cls += ' weak-4'; cnt = `-${w4*4}`; }
      else if (w2 > 0) { cls += ' weak-2'; cnt = `-${w2*2}`; }
      else if (r4 > 0) { cls += ' resist-4'; cnt = `+${r4*4}`; }
      else if (r2 > 0) { cls += ' resist-2'; cnt = `+${r2*2}`; }
      const cell = el('div', {class:cls}, typeBadge(atkType));
      if (cnt) cell.appendChild(el('span', {class:'cnt'}, cnt));
      defContainer.appendChild(cell);
    }
  }

  // Offensive coverage
  const enemySel = $id('enemyTeam');
  if (enemySel.options.length === 0) {
    for (const n of POKEMON_NAMES) enemySel.appendChild(el('option', {value:n}, n));
  }
  enemySel.onchange = updateOffensiveAnalysis;
  updateOffensiveAnalysis();
}

function updateOffensiveAnalysis() {
  const enemySel = $id('enemyTeam');
  const enemies = Array.from(enemySel.selectedOptions).map(o => o.value);
  const container = $id('offAnalysis');
  container.innerHTML = '';
  if (!enemies.length) { container.innerHTML = '<p class="hint">Selecione inimigos.</p>'; return; }
  const moveTypes = new Set();
  for (const p of state.team) {
    if (!p) continue;
    for (const m of p.moves || []) {
      if (MOVES[m] && MOVES[m].category !== 'Status') moveTypes.add(MOVES[m].type);
    }
  }
  const table = el('table', {class:'result-table'},
    el('thead', {}, el('tr', {},
      el('th', {}, 'Inimigo'), el('th', {}, 'Tipos'), el('th', {}, 'Fraco a'), el('th', {}, 'Resiste a')
    )),
    el('tbody')
  );
  const tbody = table.querySelector('tbody');
  for (const name of enemies) {
    const p = POKEMON[name];
    if (!p) continue;
    const weak=[], resist=[];
    for (const t of moveTypes) {
      const eff = typeEffectiveness(t, p.types);
      if (eff > 1) weak.push(t);
      else if (eff < 1 && eff > 0) resist.push(t);
    }
    tbody.appendChild(el('tr', {},
      el('td', {}, name),
      el('td', {}, ...p.types.map(typeBadge)),
      el('td', {}, ...weak.map(t => typeBadge(t))),
      el('td', {}, ...resist.map(t => typeBadge(t)))
    ));
  }
  container.appendChild(table);
}

/* ============================================================
   SHARE / IMPORT
   ============================================================ */
function encodeTeam(team) {
  const compact = team.map(p => {
    if (!p) return null;
    return [p.species, p.nature, p.ability, p.item, p.evs, p.ivs, p.moves];
  });
  return btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
}
function decodeTeam(str) {
  try {
    const compact = JSON.parse(decodeURIComponent(escape(atob(str))));
    return compact.map(p => {
      if (!p) return null;
      return { species:p[0], nature:p[1], ability:p[2], item:p[3],
        evs:p[4] || [0,0,0,0,0,0], ivs:p[5] || [31,31,31,31,31,31], moves:p[6] || [] };
    });
  } catch(e) { return null; }
}
function loadFromUrl() {
  const hash = location.hash;
  if (hash.startsWith('#team=')) {
    const data = decodeTeam(hash.substring(6));
    if (data) state.team = data;
  }
}
function shareTeam() {
  if (!state.team.some(p => p)) { showToast('Time vazio'); return; }
  const encoded = encodeTeam(state.team);
  const url = location.origin + location.pathname + '#team=' + encoded;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Link copiado!')).catch(() => prompt('Copie:', url));
  } else prompt('Copie:', url);
  history.replaceState(null, '', '#team=' + encoded);
}
function importTeam() {
  const input = prompt('Cole o link ou código:');
  if (!input) return;
  let enc = input.trim();
  if (enc.includes('#team=')) enc = enc.split('#team=')[1];
  const data = decodeTeam(enc);
  if (data) { state.team = data; renderTeam(); refreshDamageSelectors(); showToast('Importado!'); }
  else showToast('Código inválido');
}

/* ============================================================
   TABS
   ============================================================ */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    $id('tab-' + tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'damage') { refreshDamageSelectors(); updateDamageResults(); }
    if (tab.dataset.tab === 'buffs') renderBuffs();
    if (tab.dataset.tab === 'analysis') renderAnalysis();
  });
});

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
async function init() {
  $id('shareBtn').addEventListener('click', shareTeam);
  $id('importBtn').addEventListener('click', importTeam);
  $id('clearBtn').addEventListener('click', () => {
    if (confirm('Limpar todo o time?')) {
      state.team = [null,null,null,null,null,null];
      renderTeam(); refreshDamageSelectors();
      history.replaceState(null, '', location.pathname);
    }
  });
  $id('modalClose').addEventListener('click', closeModal);
  $id('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

  try {
    await loadData();
  } catch(e) {
    console.error(e);
    showToast('Erro ao carregar dados. Verifique se os JSONs estão na pasta.');
    return;
  }
  loadFromUrl();
  renderTeam();
  renderFieldOpts();
  renderDamageSide('atk');
  renderDamageSide('def');
  renderBuffs();
  renderAnalysis();
  if (state.team.some(p => p)) refreshDamageSelectors();
}

init();
