'use strict';

/* ============ ESTADO ============ */
const state = {
  team: [null,null,null,null,null,null],
  editingSlot: null,
  level: 50,
  damageAtk: null, damageDef: null,
  field: {
    weather:'none', crit:false, reflect:false, lightScreen:false,
    atkBoosts:{atk:0,spa:0,spe:0},
    defBoosts:{def:0,spd:0,spe:0},
    atkHp:100, defHp:100
  },
  buffPokemon:null, buffNature:'Adamant', buffAbility:null, buffItem:'None',
  buffEvs:[0,0,0,0,0,0],
  buffBoosts:{atk:0,def:0,spa:0,spd:0,spe:0},
  buffStatus:'none'
};

/* ============ DADOS ESTÁTICOS ============ */
const TYPES = ['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel'];

const TYPE_CHART = {
  Normal:{Rock:.5,Ghost:0,Steel:.5},Fire:{Fire:.5,Water:.5,Grass:2,Ice:2,Bug:2,Rock:.5,Dragon:.5,Steel:2},
  Water:{Fire:2,Water:.5,Grass:.5,Ground:2,Rock:2,Dragon:.5},Electric:{Water:2,Electric:.5,Grass:.5,Ground:0,Flying:2,Dragon:.5},
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
  Dragon:{Dragon:2,Steel:.5},Dark:{Fighting:.5,Psychic:2,Ghost:2,Dark:.5},
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
  'None':{category:'Nenhum'},
  'Leftovers':{healPerTurn:1/16,category:'Recuperação'},
  'Black Sludge':{healPerTurn:1/16,poisonOnly:true,damageNonPoison:1/8,category:'Recuperação'},
  'Life Orb':{damageMult:1.3,recoil:0.10,category:'Ofensivos'},
  'Choice Band':{statMult:{atk:1.5},choice:true,category:'Escolha'},
  'Choice Specs':{statMult:{spa:1.5},choice:true,category:'Escolha'},
  'Choice Scarf':{statMult:{spe:1.5},choice:true,category:'Escolha'},
  'Assault Vest':{statMult:{spd:1.5},noStatus:true,category:'Defensivos'},
  'Eviolite':{statMult:{def:1.5,spd:1.5},requiresCanEvolve:true,category:'Defensivos'},
  'Expert Belt':{superEffMult:1.2,category:'Ofensivos'},
  'Focus Sash':{surviveAt1HP:true,category:'Defensivos'},
  'Rocky Helmet':{contactRecoil:1/6,category:'Reativos'},
  'Air Balloon':{immuneTo:['Ground'],category:'Utilidade'},
  'Red Card':{forceSwitch:true,category:'Reativos'},
  'Shed Shell':{canAlwaysSwitch:true,category:'Utilidade'},
  'Safety Goggles':{powderImmune:true,weatherImmune:true,category:'Utilidade'},
  'Charcoal':{typeBoost:'Fire',typeMult:1.2,category:'Elementais'},
  'Mystic Water':{typeBoost:'Water',typeMult:1.2,category:'Elementais'},
  'Magnet':{typeBoost:'Electric',typeMult:1.2,category:'Elementais'},
  'Miracle Seed':{typeBoost:'Grass',typeMult:1.2,category:'Elementais'},
  'NeverMeltIce':{typeBoost:'Ice',typeMult:1.2,category:'Elementais'},
  'Black Belt':{typeBoost:'Fighting',typeMult:1.2,category:'Elementais'},
  'Poison Barb':{typeBoost:'Poison',typeMult:1.2,category:'Elementais'},
  'Soft Sand':{typeBoost:'Ground',typeMult:1.2,category:'Elementais'},
  'Sharp Beak':{typeBoost:'Flying',typeMult:1.2,category:'Elementais'},
  'TwistedSpoon':{typeBoost:'Psychic',typeMult:1.2,category:'Elementais'},
  'SilverPowder':{typeBoost:'Bug',typeMult:1.2,category:'Elementais'},
  'Hard Stone':{typeBoost:'Rock',typeMult:1.2,category:'Elementais'},
  'Spell Tag':{typeBoost:'Ghost',typeMult:1.2,category:'Elementais'},
  'Dragon Fang':{typeBoost:'Dragon',typeMult:1.2,category:'Elementais'},
  'BlackGlasses':{typeBoost:'Dark',typeMult:1.2,category:'Elementais'},
  'Metal Coat':{typeBoost:'Steel',typeMult:1.2,category:'Elementais'},
  'Silk Scarf':{typeBoost:'Normal',typeMult:1.2,category:'Elementais'},
  'Sitrus Berry':{healsAtHalf:0.25,category:'Recuperação'},
  'Lum Berry':{curesStatus:true,category:'Recuperação'},
  'Liechi Berry':{pinchBoost:{stat:'atk',stages:1},category:'Berries'},
  'Ganlon Berry':{pinchBoost:{stat:'def',stages:1},category:'Berries'},
  'Salac Berry':{pinchBoost:{stat:'spe',stages:1},category:'Berries'},
  'Petaya Berry':{pinchBoost:{stat:'spa',stages:1},category:'Berries'},
  'Apicot Berry':{pinchBoost:{stat:'spd',stages:1},category:'Berries'},
  'Quick Claw':{firstChance:0.2,category:'Utilidade'},
  'Kings Rock':{flinchChance:0.1,category:'Utilidade'},
  'Wide Lens':{accuracyMult:1.1,category:'Utilidade'},
  'Muscle Band':{damageMult:1.1,physicalOnly:true,category:'Ofensivos'},
  'Wise Glasses':{damageMult:1.1,specialOnly:true,category:'Ofensivos'},
  'Light Clay':{screenDuration:8,category:'Climáticos'},
  'Damp Rock':{weatherDuration:8,category:'Climáticos'},
  'Heat Rock':{weatherDuration:8,category:'Climáticos'},
  'Smooth Rock':{weatherDuration:8,category:'Climáticos'},
  'Icy Rock':{weatherDuration:8,category:'Climáticos'},
  'Big Root':{drainBoost:1.3,category:'Recuperação'},
  'Iron Ball':{halveSpeed:true,grounded:true,category:'Velocidade'},
  'Lagging Tail':{alwaysLast:true,category:'Velocidade'},
  'Sticky Barb':{damagePerTurn:1/8,category:'Reativos'}
};

const ABILITY_EFFECTS = {
  'Adaptability':{stabMult:2},'Huge Power':{statMult:{atk:2}},'Pure Power':{statMult:{atk:2}},
  'Technician':{powerBoost:{maxPower:60,mult:1.5}},
  'Tough Claws':{powerBoost:{flag:'contact',mult:1.33}},
  'Iron Fist':{powerBoost:{flag:'punch',mult:1.2}},
  'Strong Jaw':{powerBoost:{flag:'bite',mult:1.5}},
  'Mega Launcher':{powerBoost:{flag:'pulse',mult:1.5}},
  'Punk Rock':{powerBoost:{flag:'sound',mult:1.3}},
  'Sharpness':{powerBoost:{flag:'slicing',mult:1.5}},
  'Sheer Force':{powerBoost:{secondary:true,mult:1.3}},
  'Thick Fat':{typeResist:{types:['Fire','Ice'],mult:0.5}},
  'Filter':{superEffResist:0.75},'Solid Rock':{superEffResist:0.75},
  'Multiscale':{fullHpResist:0.5},'Shadow Shield':{fullHpResist:0.5},
  'Fur Coat':{statMult:{def:2}},'Marvel Scale':{statMultIfStatus:{def:1.5}},
  'Guts':{statMultIfStatus:{atk:1.5}},'Hustle':{statMult:{atk:1.5},accuracyMult:0.8},
  'Sand Force':{weatherBoost:{weather:'sandstorm',types:['Rock','Ground','Steel'],mult:1.3}},
  'Drizzle':{setsWeather:'rain'},'Drought':{setsWeather:'sun'},
  'Sand Stream':{setsWeather:'sandstorm'},'Snow Warning':{setsWeather:'hail'},
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
  'Contrary':{reverseStatChanges:true},'Simple':{doubleStatChanges:true},
  'Unaware':{ignoreStatBoosts:true},'Magic Guard':{immuneIndirect:true},
  'Rock Head':{noRecoil:true},'Reckless':{recoilBoost:1.2},
  'Scrappy':{hitGhost:true},'Tinted Lens':{resistMult:2},'Sniper':{critMult:1.5},
  'Regenerator':{healOnSwitch:1/3},'Natural Cure':{cureOnSwitch:true},
  'Poison Heal':{healInPoison:1/8},'Magic Bounce':{reflectsStatus:true},
  'Prankster':{statusPriority:1},'Analytic':{lastMoveBoost:1.3},
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

const TRUE_DAMAGE_OVERRIDES = {
  'Seismic Toss':{type:'fixed',value:'level'},'Night Shade':{type:'fixed',value:'level'},
  'SonicBoom':{type:'fixed',value:20},'Dragon Rage':{type:'fixed',value:40},
  'Super Fang':{type:'percent',value:0.5},'Endeavor':{type:'hp_diff'},'Final Gambit':{type:'user_hp'},
  'Counter':{type:'skip'},'Mirror Coat':{type:'skip'},'Metal Burst':{type:'skip'},
  'Guillotine':{type:'ohko'},'Horn Drill':{type:'ohko'},'Fissure':{type:'ohko'},'Sheer Cold':{type:'ohko'}
};

/* ============ DADOS CARREGADOS ============ */
const POKEMON = {}, MOVES = {}, POKEMON_NAMES = [];
let FLAGS_MAP = {}, DEX_MAP = {};

/* ============ HELPERS ============ */
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
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200);
}
function titleCase(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }
function typeBadge(type) { return el('span', {class:'type-badge types-' + type}, type); }

/* ============================================================
   IMAGENS (pokemondb.net)
   ============================================================ */
function pokemonSlug(name) {
  return name
    .replace(/♀/g, '-f')
    .replace(/♂/g, '-m')
    .replace(/\./g, '')
    .replace(/'/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function itemSlug(name) {
  if (name === 'None') return '';
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[.']/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function spriteUrl(name) {
  return 'https://img.pokemondb.net/sprites/x-y/normal/' + pokemonSlug(name) + '.png';
}

function itemUrl(name) {
  return 'https://img.pokemondb.net/sprites/items/' + itemSlug(name) + '.png';
}

/* ============ UTIL ============ */
function statStageMult(stage) {
  if (stage === 0) return 1;
  return stage > 0 ? (2 + stage) / 2 : 2 / (2 - stage);
}

/* ============ CARREGAMENTO ============ */
async function loadData() {
  for (const [flag, moves] of Object.entries(FLAG_LISTS)) {
    for (const m of moves) {
      if (!FLAGS_MAP[m]) FLAGS_MAP[m] = new Set();
      FLAGS_MAP[m].add(flag);
    }
  }
  const [monsters, movesList, evolutionsList] = await Promise.all([
    fetch('monster.json').then(r => r.json()),
    fetch('moves.json').then(r => r.json()),
    fetch('evolutions.json').then(r => r.json())
  ]);
  let dexData = [];
  try { dexData = await fetch('dex.json').then(r => r.json()); }
  catch(e) { console.warn('dex.json não encontrado — filtro de região desabilitado'); }
  for (const entry of dexData) DEX_MAP[entry.id] = entry;

  for (const m of movesList) {
    const cat = m.skill_damage_type === 'PHYSICAL' ? 'Physical'
             : m.skill_damage_type === 'SPECIAL' ? 'Special' : 'Status';
    MOVES[m.name] = {
      name:m.name, type:titleCase(m.type), category:cat,
      power:m.base_power, accuracy:m.base_accuracy, pp:m.base_pp, priority:m.priority,
      trueDamage:m.true_damage, flags:FLAGS_MAP[m.name] || new Set(),
      hasSecondary:MOVES_WITH_SECONDARY.has(m.name)
    };
  }
  const evolutionSet = new Set();
  for (const chain of evolutionsList) for (let i = 0; i < chain.length - 1; i++) evolutionSet.add(chain[i]);

  for (const m of monsters) {
    if (m.forms && m.forms.length && !m.forms[0].is_released) continue;
    const types = [...new Set(m.types.map(titleCase))];
    const abilities = [...new Set(m.abilities.map(a => a.name))];
    const learnset = [...new Set(m.moves.map(mv => mv.name))];
    const de = DEX_MAP[m.id];
    const regions = [];
    if (de) {
      if (de.kanto > 0) regions.push('Kanto');
      if (de.johto > 0) regions.push('Johto');
      if (de.hoenn > 0) regions.push('Hoenn');
      if (de.sinnoh > 0) regions.push('Sinnoh');
      if (de.unova > 0) regions.push('Unova');
    }
    POKEMON[m.name] = {
      id:m.id, name:m.name, types,
      base:{hp:m.stats.hp,atk:m.stats.attack,def:m.stats.defense,spa:m.stats.sp_attack,spd:m.stats.sp_defense,spe:m.stats.speed},
      weight:m.weight/10, abilities, learnset,
      canEvolve:evolutionSet.has(m.id), regions
    };
  }
  POKEMON_NAMES.push(...Object.keys(POKEMON).sort());
}

/* ============ CÁLCULOS ============ */
function typeEffectiveness(moveType, defTypes) {
  let m = 1;
  for (const t of defTypes) { const c = TYPE_CHART[moveType]; if (c && c[t] !== undefined) m *= c[t]; }
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
  const p = POKEMON[set.species]; if (!p) return null;
  const iv = set.ivs || [31,31,31,31,31,31];
  const ev = set.evs || [0,0,0,0,0,0];
  return {
    hp:calcHp(p.base.hp, iv[0], ev[0], level),
    atk:calcStat(p.base.atk, iv[1], ev[1], level, natureMult(set.nature,'atk')),
    def:calcStat(p.base.def, iv[2], ev[2], level, natureMult(set.nature,'def')),
    spa:calcStat(p.base.spa, iv[3], ev[3], level, natureMult(set.nature,'spa')),
    spd:calcStat(p.base.spd, iv[4], ev[4], level, natureMult(set.nature,'spd')),
    spe:calcStat(p.base.spe, iv[5], ev[5], level, natureMult(set.nature,'spe'))
  };
}
function getEffectiveStats(set, boosts, hpPercent) {
  const p = POKEMON[set.species]; if (!p) return null;
  const base = getSetStats(set, state.level); if (!base) return null;
  const item = ITEMS[set.item] || {};
  const ae = ABILITY_EFFECTS[set.ability] || {};
  const res = {...base};
  if (item.statMult) for (const k in item.statMult) res[k] = Math.floor(res[k] * item.statMult[k]);
  if (ae.statMult) for (const k in ae.statMult) res[k] = Math.floor(res[k] * ae.statMult[k]);
  if (ae.statMultIfStatus && set._status && set._status !== 'none')
    for (const k in ae.statMultIfStatus) res[k] = Math.floor(res[k] * ae.statMultIfStatus[k]);
  if (ae.weatherSpeed && ae.weatherSpeed.weather === state.field.weather) res.spe = Math.floor(res.spe * ae.weatherSpeed.mult);
  for (const k of ['atk','def','spa','spd','spe']) res[k] = Math.floor(res[k] * statStageMult(boosts[k] || 0));
  if (item.halveSpeed) res.spe = Math.floor(res.spe / 2);
  res._hpPercent = hpPercent;
  return res;
}
function getActualPower(moveName, atkSet, defSet, opts) {
  const atkP = POKEMON[atkSet.species], defP = POKEMON[defSet.species];
  const wAtk = atkP ? atkP.weight : 1, wDef = defP ? defP.weight : 1;
  if (moveName === 'Low Kick' || moveName === 'Grass Knot') {
    if (wDef < 10) return 20; if (wDef < 25) return 40; if (wDef < 50) return 60;
    if (wDef < 100) return 80; if (wDef < 200) return 100; return 120;
  }
  if (moveName === 'Heavy Slam' || moveName === 'Heat Crash') {
    const r = wAtk / Math.max(0.1, wDef);
    if (r >= 5) return 120; if (r >= 4) return 100; if (r >= 3) return 80; if (r >= 2) return 60; return 40;
  }
  if (moveName === 'Gyro Ball') {
    const A = getSetStats(atkSet, state.level), D = getSetStats(defSet, state.level);
    if (!A || !D) return 1;
    return Math.min(150, Math.floor(25 * D.spe / Math.max(1, A.spe)) + 1);
  }
  if (moveName === 'Electro Ball') {
    const A = getSetStats(atkSet, state.level), D = getSetStats(defSet, state.level);
    if (!A || !D) return 1;
    const r = A.spe / Math.max(1, D.spe);
    if (r >= 4) return 150; if (r >= 3) return 120; if (r >= 2) return 80; if (r >= 1) return 60; return 40;
  }
  if (moveName === 'Flail' || moveName === 'Reversal') {
    const hp = opts.atkHp / 100;
    if (hp >= 0.6875) return 20; if (hp >= 0.3542) return 40; if (hp >= 0.2083) return 80;
    if (hp >= 0.1042) return 100; if (hp >= 0.0417) return 150; return 200;
  }
  if (moveName === 'Wring Out' || moveName === 'Crush Grip') return Math.max(1, Math.floor(120 * (opts.defHp / 100)));
  if (moveName === 'Water Spout' || moveName === 'Eruption') return Math.max(1, Math.floor(150 * (opts.atkHp / 100)));
  if (moveName === 'Return' || moveName === 'Frustration') return 102;
  if (moveName === 'Stored Power') return 20 + 20 * (opts.atkBoosts.atk + opts.atkBoosts.spa + opts.atkBoosts.spe);
  if (moveName === 'Spit Up') return 100;
  if (moveName === 'Magnitude') return 70;
  if (moveName === 'Present') return 40;
  return MOVES[moveName] ? MOVES[moveName].power : 0;
}

/* ============ DANO ============ */
function calcDamage(atkSet, defSet, moveName, opts) {
  const move = MOVES[moveName]; if (!move) return null;
  if (move.category === 'Status') return {status:true, moveType:move.type};
  const atkP = POKEMON[atkSet.species], defP = POKEMON[defSet.species];
  if (!atkP || !defP) return null;

  if (move.trueDamage) {
    const ov = TRUE_DAMAGE_OVERRIDES[moveName];
    if (ov) {
      if (ov.type === 'fixed') { const d = ov.value === 'level' ? state.level : ov.value; return {min:d,max:d,pct:[d,d],fixed:true,moveType:move.type}; }
      if (ov.type === 'ohko') return {ohko:true,moveType:move.type};
      if (ov.type === 'skip') return {skip:true,moveType:move.type};
      if (ov.type === 'hp_diff') {
        const dH = getSetStats(defSet,state.level).hp*opts.defHp/100, aH = getSetStats(atkSet,state.level).hp*opts.atkHp/100;
        const d = Math.max(0, Math.floor(dH-aH)); return {min:d,max:d,fixed:true,moveType:move.type};
      }
      if (ov.type === 'user_hp') {
        const d = Math.floor(getSetStats(atkSet,state.level).hp*opts.atkHp/100); return {min:d,max:d,fixed:true,moveType:move.type};
      }
      if (ov.type === 'percent') {
        const d = Math.floor(getSetStats(defSet,state.level).hp*opts.defHp/100*ov.value); return {min:d,max:d,fixed:true,moveType:move.type};
      }
    }
  }

  const defAE = ABILITY_EFFECTS[defSet.ability] || {};
  if (defAE.immuneTo === move.type) return {immune:true, moveType:move.type};
  if (move.type === 'Ground' && defSet.ability === 'Levitate') return {immune:true, moveType:move.type};
  const defItem = ITEMS[defSet.item] || {};
  if (move.type === 'Ground' && defItem.immuneTo && defItem.immuneTo.includes('Ground')) return {immune:true, moveType:move.type};
  if (defSet.ability === 'Wonder Guard' && typeEffectiveness(move.type, defP.types) <= 1) return {immune:true, moveType:move.type};

  const atkStats = getEffectiveStats(atkSet, opts.atkBoosts, opts.atkHp);
  const defStats = getEffectiveStats(defSet, opts.defBoosts, opts.defHp);
  if (!atkStats || !defStats) return null;

  const isPhysical = move.category === 'Physical';
  let A = isPhysical ? atkStats.atk : atkStats.spa;
  let D = isPhysical ? defStats.def : defStats.spd;

  let power = getActualPower(moveName, atkSet, defSet, opts);
  if (!power || power < 1) power = 1;
  const atkAE = ABILITY_EFFECTS[atkSet.ability] || {};
  if (atkAE.powerBoost) {
    const pb = atkAE.powerBoost;
    if (pb.maxPower && power <= pb.maxPower) power = Math.floor(power * pb.mult);
    else if (pb.flag && move.flags.has(pb.flag)) power = Math.floor(power * pb.mult);
    else if (pb.secondary && move.hasSecondary) power = Math.floor(power * pb.mult);
  }
  if (atkAE.weatherBoost && atkAE.weatherBoost.weather === opts.weather && atkAE.weatherBoost.types.includes(move.type))
    power = Math.floor(power * atkAE.weatherBoost.mult);
  const atkItem = ITEMS[atkSet.item] || {};
  if (atkItem.typeBoost === move.type) power = Math.floor(power * atkItem.typeMult);

  let typeEff = typeEffectiveness(move.type, defP.types);
  if (moveName === 'Freeze-Dry' && defP.types.includes('Water')) typeEff *= 2;
  if (atkSet.ability === 'Scrappy' && defP.types.includes('Ghost') && (move.type === 'Normal' || move.type === 'Fighting'))
    typeEff = typeEffectiveness(move.type, defP.types.filter(t => t !== 'Ghost'));
  if (typeEff === 0) return {immune:true, moveType:move.type};

  const level = opts.level || 50;
  let damage = Math.floor(Math.floor(Math.floor(2*level/5 + 2) * power * A / D) / 50) + 2;
  let mult = 1;
  if (atkP.types.includes(move.type)) mult *= (atkAE.stabMult) || 1.5;
  mult *= typeEff;
  if (opts.crit) mult *= 2 * (atkSet.ability === 'Sniper' ? 1.5 : 1);
  if (opts.weather === 'sun') { if (move.type === 'Fire') mult *= 1.5; if (move.type === 'Water') mult *= 0.5; }
  else if (opts.weather === 'rain') { if (move.type === 'Water') mult *= 1.5; if (move.type === 'Fire') mult *= 0.5; }
  if (isPhysical && opts.reflect) mult *= 0.5;
  if (!isPhysical && opts.lightScreen) mult *= 0.5;
  if (defAE.typeResist && defAE.typeResist.types.includes(move.type)) mult *= defAE.typeResist.mult;
  if (defAE.superEffResist && typeEff > 1) mult *= defAE.superEffResist;
  if (defAE.fullHpResist && opts.defHp >= 100) mult *= defAE.fullHpResist;
  if (atkAE.resistMult && typeEff < 1) mult *= atkAE.resistMult;
  if (atkSet._status === 'burned' && isPhysical && atkSet.ability !== 'Guts') mult *= 0.5;
  if (atkItem.damageMult) {
    if (!(atkItem.physicalOnly && !isPhysical) && !(atkItem.specialOnly && isPhysical)) mult *= atkItem.damageMult;
  }
  if (atkItem.superEffMult && typeEff > 1) mult *= atkItem.superEffMult;

  const min = Math.max(1, Math.floor(damage * mult * 0.85));
  const max = Math.max(1, Math.floor(damage * mult * 1.0));
  const defHp = getSetStats(defSet, state.level).hp;
  return {min, max, pct:[Math.min(100,Math.round(min/defHp*1000)/10),Math.min(100,Math.round(max/defHp*1000)/10)], moveType:move.type, typeEff};
}

/* ============================================================
   ADVANCED PICKER
   ============================================================ */
function closePicker() { $id('pickerModal').classList.remove('open'); }

function openPicker(config) {
  const modal = $id('pickerModal');
  $id('pickerTitle').textContent = config.title || 'Selecionar';
  const body = $id('pickerBody');
  body.innerHTML = '';
  modal.classList.add('open');
  if (config.type === 'pokemon') renderPokemonPicker(body, config);
  else if (config.type === 'item') renderItemPicker(body, config);
  else if (config.type === 'move') renderMovePicker(body, config);
}

function renderPokemonPicker(body, config) {
  const st = { query:'', types:new Set(), region:'all', sortBy:'id', sortDir:'asc' };
  const searchInput = el('input', {type:'text', placeholder:'Buscar por nome ou nº da Pokédex...', class:'picker-search'});
  searchInput.oninput = () => { st.query = searchInput.value; renderList(); };

  const typeChips = el('div', {class:'picker-types'});
  for (const t of TYPES) {
    const chip = el('span', {class:'type-chip type-badge types-' + t}, t);
    chip.onclick = () => {
      if (st.types.has(t)) st.types.delete(t); else st.types.add(t);
      chip.classList.toggle('active');
      renderList();
    };
    typeChips.appendChild(chip);
  }

  const regionSel = el('select');
  regionSel.appendChild(el('option', {value:'all'}, 'Todas as regiões'));
  for (const r of ['Kanto','Johto','Hoenn','Sinnoh','Unova']) regionSel.appendChild(el('option', {value:r}, r));
  regionSel.onchange = () => { st.region = regionSel.value; renderList(); };

  const sortSel = el('select');
  const sortOpts = [['id','Nº Pokédex'],['name','Nome'],['hp','HP'],['atk','Atk'],['def','Def'],['spa','SpA'],['spd','SpD'],['spe','Spe'],['bst','Total (BST)']];
  for (const [v,l] of sortOpts) sortSel.appendChild(el('option', {value:v}, l));
  sortSel.onchange = () => { st.sortBy = sortSel.value; renderList(); };

  const sortDirBtn = el('button', {class:'picker-sort-dir', type:'button'}, '↑');
  sortDirBtn.onclick = () => {
    st.sortDir = st.sortDir === 'asc' ? 'desc' : 'asc';
    sortDirBtn.textContent = st.sortDir === 'asc' ? '↑' : '↓';
    renderList();
  };

  const filters = el('div', {class:'picker-filters'},
    searchInput, typeChips,
    el('div', {class:'picker-options'}, regionSel, sortSel, sortDirBtn)
  );
  const listContainer = el('div', {class:'picker-list'});

  function renderList() {
    listContainer.innerHTML = '';
    let items = Object.values(POKEMON);
    if (st.query) {
      const q = st.query.toLowerCase().trim();
      if (/^\d+$/.test(q)) {
        const n = parseInt(q);
        items = items.filter(p => p.id === n || String(p.id) === q);
      } else {
        items = items.filter(p => p.name.toLowerCase().includes(q));
      }
    }
    if (st.types.size > 0) items = items.filter(p => p.types.some(t => st.types.has(t)));
    if (st.region !== 'all') items = items.filter(p => p.regions && p.regions.includes(st.region));

    items.sort((a,b) => {
      let va, vb;
      if (st.sortBy === 'id') { va = a.id; vb = b.id; }
      else if (st.sortBy === 'name') { va = a.name; vb = b.name; }
      else if (st.sortBy === 'bst') {
        va = Object.values(a.base).reduce((x,y)=>x+y,0);
        vb = Object.values(b.base).reduce((x,y)=>x+y,0);
      } else { va = a.base[st.sortBy]; vb = b.base[st.sortBy]; }
      if (va < vb) return st.sortDir === 'asc' ? -1 : 1;
      if (va > vb) return st.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    if (items.length === 0) { listContainer.appendChild(el('p', {class:'hint'}, 'Nenhum resultado.')); return; }
    const slice = items.slice(0, 250);
    for (const p of slice) {
      const img = el('img', {class:'picker-sprite', loading:'lazy'});
      img.src = spriteUrl(p.name);
      img.onerror = () => img.style.display = 'none';
      const bst = Object.values(p.base).reduce((x,y)=>x+y,0);
      listContainer.appendChild(el('div', {class:'picker-item', on:{click:() => {
        config.onSelect(p.name); closePicker();
      }}},
        img,
        el('div', {class:'picker-info'},
          el('div', {class:'picker-name'}, p.name),
          el('div', {class:'picker-meta'}, '#' + String(p.id).padStart(3,'0') + ' · BST ' + bst),
          el('div', {class:'picker-types'}, ...p.types.map(typeBadge))
        )
      ));
    }
    if (items.length > 250) listContainer.appendChild(el('p', {class:'hint', style:'grid-column:1/-1'}, `Mostrando 250 de ${items.length}. Refine a busca.`));
  }

  body.appendChild(filters);
  body.appendChild(listContainer);
  renderList();
  setTimeout(() => searchInput.focus(), 100);
}

function renderItemPicker(body, config) {
  const st = { query:'', category:'all' };
  const cats = ['Todos','Nenhum','Elementais','Climáticos','Recuperação','Escolha','Defensivos','Ofensivos','Reativos','Utilidade','Berries','Velocidade'];
  const searchInput = el('input', {type:'text', placeholder:'Buscar item...', class:'picker-search'});
  searchInput.oninput = () => { st.query = searchInput.value; renderList(); };
  const catChips = el('div', {class:'picker-categories'});
  for (const c of cats) {
    const chip = el('span', {class:'cat-chip' + (c === 'Todos' ? ' active' : '')}, c);
    chip.onclick = () => {
      st.category = c === 'Todos' ? 'all' : c;
      catChips.querySelectorAll('.cat-chip').forEach(x => x.classList.remove('active'));
      chip.classList.add('active');
      renderList();
    };
    catChips.appendChild(chip);
  }
  const filters = el('div', {class:'picker-filters'}, searchInput, catChips);
  const listContainer = el('div', {class:'picker-list'});

  function renderList() {
    listContainer.innerHTML = '';
    let items = Object.entries(ITEMS);
    if (st.category !== 'all') items = items.filter(([n,d]) => d.category === st.category);
    if (st.query) { const q = st.query.toLowerCase(); items = items.filter(([n]) => n.toLowerCase().includes(q)); }
    if (items.length === 0) { listContainer.appendChild(el('p', {class:'hint'}, 'Nenhum item.')); return; }
    for (const [name, data] of items) {
      const img = el('img', {class:'picker-sprite', loading:'lazy'});
      img.src = itemUrl(name);
      img.onerror = () => img.style.display = 'none';
      listContainer.appendChild(el('div', {class:'picker-item', on:{click:() => {
        config.onSelect(name); closePicker();
      }}},
        img,
        el('div', {class:'picker-info'},
          el('div', {class:'picker-name'}, name),
          el('div', {class:'picker-meta'}, data.category || '')
        )
      ));
    }
  }
  body.appendChild(filters);
  body.appendChild(listContainer);
  renderList();
  setTimeout(() => searchInput.focus(), 100);
}

function renderMovePicker(body, config) {
  const st = { query:'' };
  const restrict = config.restrictTo || Object.keys(MOVES);
  const searchInput = el('input', {type:'text', placeholder:'Buscar golpe...', class:'picker-search'});
  searchInput.oninput = () => { st.query = searchInput.value; renderList(); };
  const filters = el('div', {class:'picker-filters'}, searchInput);
  const listContainer = el('div', {class:'picker-list'});

  function renderList() {
    listContainer.innerHTML = '';
    let items = restrict.filter(m => MOVES[m]);
    if (st.query) { const q = st.query.toLowerCase(); items = items.filter(m => m.toLowerCase().includes(q)); }
    items.sort();
    if (items.length === 0) { listContainer.appendChild(el('p', {class:'hint'}, 'Nenhum golpe.')); return; }
    for (const name of items) {
      const m = MOVES[name];
      listContainer.appendChild(el('div', {class:'picker-item', on:{click:() => {
        config.onSelect(name); closePicker();
      }}},
        el('div', {class:'picker-info'},
          el('div', {class:'picker-name'}, name),
          el('div', {class:'picker-meta'}, m.category + ' · ' + (m.power || '—') + ' BP'),
          el('div', {class:'picker-types'}, typeBadge(m.type))
        )
      ));
    }
  }
  body.appendChild(filters);
  body.appendChild(listContainer);
  renderList();
  setTimeout(() => searchInput.focus(), 100);
}

/* ============ ADVANCED SELECT HELPERS ============ */
function createPokemonSelect(current, onChange) {
  const btn = el('button', {type:'button', class:'adv-select'});
  function update() {
    btn.innerHTML = '';
    if (current && POKEMON[current]) {
      const img = el('img', {class:'adv-sprite'});
      img.src = spriteUrl(current);
      img.onerror = () => img.style.display = 'none';
      btn.appendChild(img);
      btn.appendChild(el('span', {class:'adv-label'}, current));
    } else {
      btn.appendChild(el('span', {class:'adv-label'}, '— Selecionar Pokémon —'));
    }
    btn.appendChild(el('span', {class:'adv-arrow'}, '▼'));
  }
  btn.onclick = () => openPicker({
    type:'pokemon', title:'Selecionar Pokémon',
    onSelect: (name) => { current = name; update(); onChange(name); }
  });
  update();
  return btn;
}

function createItemSelect(current, onChange) {
  const btn = el('button', {type:'button', class:'adv-select'});
  function update() {
    btn.innerHTML = '';
    if (current && current !== 'None') {
      const img = el('img', {class:'adv-sprite'});
      img.src = itemUrl(current);
      img.onerror = () => img.style.display = 'none';
      btn.appendChild(img);
      btn.appendChild(el('span', {class:'adv-label'}, current));
    } else {
      btn.appendChild(el('span', {class:'adv-label'}, 'Sem item'));
    }
    btn.appendChild(el('span', {class:'adv-arrow'}, '▼'));
  }
  btn.onclick = () => openPicker({
    type:'item', title:'Selecionar Item',
    onSelect: (name) => { current = name; update(); onChange(name); }
  });
  update();
  return btn;
}

function createMoveSelect(current, restrictTo, onChange) {
  const btn = el('button', {type:'button', class:'adv-select'});
  function update() {
    btn.innerHTML = '';
    const label = current && MOVES[current] ? current : '— Golpe —';
    btn.appendChild(el('span', {class:'adv-label'}, label));
    if (current && MOVES[current]) btn.appendChild(el('span', {class:'adv-arrow', style:'color:var(--wine-accent)'}, MOVES[current].type));
    btn.appendChild(el('span', {class:'adv-arrow'}, '▼'));
  }
  btn.onclick = () => openPicker({
    type:'move', title:'Selecionar Golpe', restrictTo,
    onSelect: (name) => { current = name; update(); onChange(name); }
  });
  update();
  return btn;
}

/* ============ TEAM ============ */
function renderTeam() {
  const grid = $id('teamGrid'); grid.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const set = state.team[i];
    if (!set) {
      grid.appendChild(el('div', {class:'slot', on:{click:() => openEditor(i)}}, el('div', {class:'empty-icon'}, '+'), el('div', {}, 'Adicionar')));
    } else {
      const p = POKEMON[set.species];
      if (!p) { grid.appendChild(el('div', {class:'slot'}, 'Erro')); continue; }
      const img = el('img', {class:'pkm-sprite', alt:p.name, loading:'lazy'});
      img.src = spriteUrl(p.name); img.onerror = () => img.style.display = 'none';
      grid.appendChild(el('div', {class:'slot filled'},
        img,
        el('div', {class:'p-name'}, p.name),
        el('div', {class:'p-types'}, ...p.types.map(typeBadge)),
        el('div', {class:'p-moves'},
          el('div', {}, (set.item && set.item !== 'None' ? set.item : 'Sem item') + ' · ' + set.nature),
          ...(set.moves || []).slice(0,4).map(m => el('div', {}, '• ' + m))
        ),
        el('div', {class:'p-actions'},
          el('button', {class:'small', on:{click:() => openEditor(i)}}, 'Editar'),
          el('button', {class:'small danger', on:{click:() => { state.team[i] = null; renderTeam(); refreshDamageSelectors(); }}}, '×')
        )
      ));
    }
  }
}

/* ============ EDITOR ============ */
function openEditor(slot) {
  state.editingSlot = slot;
  const existing = state.team[slot];
  $id('modalTitle').textContent = existing ? 'Editar Pokémon' : 'Adicionar Pokémon';
  const body = $id('modalBody'); body.innerHTML = '';
  const set = existing ? JSON.parse(JSON.stringify(existing)) : {
    species:'', nature:'Adamant', ability:'', item:'None',
    evs:[0,0,0,0,0,0], ivs:[31,31,31,31,31,31], moves:['','','','']
  };

  const natureSel = el('select');
  for (const n in NATURES) natureSel.appendChild(el('option', {value:n}, n + (NATURES[n] ? ` (+${NATURES[n][0]}/-${NATURES[n][1]})` : '')));
  natureSel.value = set.nature;
  natureSel.onchange = () => { set.nature = natureSel.value; updateStats(); };

  const abilitySel = el('select');
  abilitySel.onchange = () => { set.ability = abilitySel.value; };

  const evGrid = el('div', {class:'ev-grid'});
  const L = ['HP','Atk','Def','SpA','SpD','Spe'];
  for (let i = 0; i < 6; i++) {
    const inp = el('input', {type:'number', min:0, max:252, value:set.evs[i]});
    inp.oninput = () => { set.evs[i] = Math.max(0, Math.min(252, parseInt(inp.value)||0)); inp.value = set.evs[i]; updateStats(); };
    evGrid.appendChild(el('div', {class:'ev-col'}, el('label', {}, L[i]), inp));
  }
  const evTotal = el('div', {class:'ev-total'});

  const ivGrid = el('div', {class:'ev-grid'});
  for (let i = 0; i < 6; i++) {
    const inp = el('input', {type:'number', min:0, max:31, value:set.ivs[i]});
    inp.oninput = () => { set.ivs[i] = Math.max(0, Math.min(31, parseInt(inp.value)||0)); inp.value = set.ivs[i]; updateStats(); };
    ivGrid.appendChild(el('div', {class:'ev-col'}, el('label', {}, L[i]), inp));
  }

  const movesWrapper = el('div', {class:'move-selects'});
  const statsDisplay = el('div', {class:'stats-display'});

  function updateStats() {
    if (!set.species) { statsDisplay.innerHTML = ''; evTotal.textContent = ''; return; }
    const s = getSetStats(set, state.level); if (!s) return;
    statsDisplay.innerHTML = '';
    for (const k of ['hp','atk','def','spa','spd','spe']) statsDisplay.appendChild(el('div', {}, el('span', {}, k.toUpperCase()), el('span', {}, String(s[k]))));
    const tot = set.evs.reduce((a,b)=>a+b,0);
    evTotal.textContent = `${tot} / 510`;
    evTotal.className = 'ev-total' + (tot > 510 ? ' over' : tot > 480 ? ' warn' : '');
  }

  function rebuildMoves() {
    movesWrapper.innerHTML = '';
    const learnset = set.species && POKEMON[set.species] ? POKEMON[set.species].learnset : [];
    for (let i = 0; i < 4; i++) {
      const mSel = createMoveSelect(set.moves[i], learnset, (val) => { set.moves[i] = val; });
      movesWrapper.appendChild(mSel);
    }
  }

  function updateAll() {
    const p = POKEMON[set.species];
    if (p) {
      abilitySel.innerHTML = '';
      for (const a of p.abilities) abilitySel.appendChild(el('option', {value:a}, a));
      if (!p.abilities.includes(set.ability)) set.ability = p.abilities[0];
      abilitySel.value = set.ability;
    }
    rebuildMoves();
    updateStats();
  }

  const pokemonSelect = createPokemonSelect(set.species, (name) => {
    set.species = name;
    set.ability = POKEMON[name] ? POKEMON[name].abilities[0] : '';
    set.moves = ['','','',''];
    updateAll();
  });
  const itemSelect = createItemSelect(set.item, (val) => { set.item = val; updateStats(); });

  body.appendChild(el('div', {class:'form-row'},
    el('div', {class:'form-group'}, el('label', {}, 'Pokémon'), pokemonSelect),
    el('div', {class:'form-group'}, el('label', {}, 'Natureza'), natureSel),
    el('div', {class:'form-group'}, el('label', {}, 'Habilidade'), abilitySel),
    el('div', {class:'form-group'}, el('label', {}, 'Item'), itemSelect)
  ));
  body.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'EVs'), evGrid, evTotal));
  body.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'IVs'), ivGrid));
  body.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'Golpes'), movesWrapper));
  body.appendChild(el('div', {class:'mt'}, el('h3', {}, 'Stats (Nv. 50)'), statsDisplay));
  body.appendChild(el('div', {class:'inline-flex mt'},
    el('button', {class:'primary', on:{click:() => {
      if (!set.species) { showToast('Selecione um Pokémon'); return; }
      const cm = set.moves.filter(m => m);
      if (!cm.length) { showToast('Adicione pelo menos 1 golpe'); return; }
      state.team[state.editingSlot] = { species:set.species, nature:set.nature, ability:set.ability, item:set.item, evs:[...set.evs], ivs:[...set.ivs], moves:cm };
      closeModal(); renderTeam(); refreshDamageSelectors();
    }}}, 'Salvar'),
    el('button', {on:{click:closeModal}}, 'Cancelar'),
    existing ? el('button', {class:'danger', on:{click:() => {
      state.team[state.editingSlot] = null; closeModal(); renderTeam(); refreshDamageSelectors();
    }}}, 'Remover') : null
  ));

  updateAll();
  $id('modal').classList.add('open');
}
function closeModal() { $id('modal').classList.remove('open'); state.editingSlot = null; }

/* ============ DAMAGE CALC ============ */
function refreshDamageSelectors() { renderDamageSide('atk'); renderDamageSide('def'); }

function renderDamageSide(side) {
  const container = $id(side === 'atk' ? 'atkPanel' : 'defPanel');
  container.innerHTML = '';
  let working = (side === 'atk' ? state.damageAtk : state.damageDef);
  if (!working) working = { species:'', nature:'Adamant', ability:'', item:'None', evs:[0,0,0,0,0,0], ivs:[31,31,31,31,31,31], moves:['','','',''] };
  else working = JSON.parse(JSON.stringify(working));

  function saveSide() {
    if (side === 'atk') state.damageAtk = working; else state.damageDef = working;
    updateDamageResults();
  }

  const pSel = createPokemonSelect(working.species, (name) => {
    const p = POKEMON[name];
    working = { species:name, nature:'Adamant', ability:p.abilities[0], item:'None', evs:[0,0,0,0,0,0], ivs:[31,31,31,31,31,31], moves:p.learnset.slice(0,4) };
    saveSide();
    renderDamageSide(side);
  });
  container.appendChild(el('div', {class:'form-group'}, el('label', {}, 'Pokémon'), pSel));

  if (!working.species) { container.appendChild(el('p', {class:'hint'}, 'Selecione um Pokémon.')); return; }
  const p = POKEMON[working.species];

  const natureSel = el('select');
  for (const n in NATURES) natureSel.appendChild(el('option', {value:n}, n));
  natureSel.value = working.nature;
  natureSel.onchange = () => { working.nature = natureSel.value; saveSide(); };

  const abilitySel = el('select');
  for (const a of p.abilities) abilitySel.appendChild(el('option', {value:a}, a));
  abilitySel.value = working.ability;
  abilitySel.onchange = () => { working.ability = abilitySel.value; saveSide(); };

  const itemSel = createItemSelect(working.item, (val) => { working.item = val; saveSide(); });

  container.appendChild(el('div', {class:'form-row'},
    el('div', {class:'form-group'}, el('label', {}, 'Natureza'), natureSel),
    el('div', {class:'form-group'}, el('label', {}, 'Habilidade'), abilitySel),
    el('div', {class:'form-group'}, el('label', {}, 'Item'), itemSel)
  ));

  const evGrid = el('div', {class:'ev-grid'});
  const L = ['HP','Atk','Def','SpA','SpD','Spe'];
  for (let i = 0; i < 6; i++) {
    const inp = el('input', {type:'number', min:0, max:252, value:working.evs[i]});
    inp.onchange = () => { working.evs[i] = Math.max(0, Math.min(252, parseInt(inp.value)||0)); saveSide(); };
    evGrid.appendChild(el('div', {class:'ev-col'}, el('label', {}, L[i]), inp));
  }
  container.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'EVs'), evGrid));

  const ivGrid = el('div', {class:'ev-grid'});
  for (let i = 0; i < 6; i++) {
    const inp = el('input', {type:'number', min:0, max:31, value:working.ivs[i]});
    inp.onchange = () => { working.ivs[i] = Math.max(0, Math.min(31, parseInt(inp.value)||0)); saveSide(); };
    ivGrid.appendChild(el('div', {class:'ev-col'}, el('label', {}, L[i]), inp));
  }
  container.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'IVs'), ivGrid));

  if (side === 'atk') {
    const mv = el('div', {class:'form-group mt'}, el('label', {}, 'Golpes'));
    const mvWrap = el('div', {class:'move-selects'});
    for (let i = 0; i < 4; i++) {
      const ms = createMoveSelect(working.moves[i], p.learnset, (val) => { working.moves[i] = val; saveSide(); });
      mvWrap.appendChild(ms);
    }
    mv.appendChild(mvWrap);
    container.appendChild(mv);
  }

  const hpInput = el('input', {type:'number', min:1, max:100, value: side === 'atk' ? state.field.atkHp : state.field.defHp});
  hpInput.onchange = () => {
    if (side === 'atk') state.field.atkHp = Math.max(1, Math.min(100, parseInt(hpInput.value)||100));
    else state.field.defHp = Math.max(1, Math.min(100, parseInt(hpInput.value)||100));
    updateDamageResults();
  };
  container.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'HP atual (%)'), hpInput));

  const boostStats = side === 'atk' ? ['atk','spa','spe'] : ['def','spd','spe'];
  const boostObj = side === 'atk' ? state.field.atkBoosts : state.field.defBoosts;
  const boostContainer = el('div', {class:'mt'});
  for (const stat of boostStats) {
    const inp = el('input', {type:'range', min:-6, max:6, value:boostObj[stat], style:'width:100%'});
    const val = el('span', {class:'val'}, (boostObj[stat] >= 0 ? '+' : '') + boostObj[stat]);
    inp.oninput = () => { boostObj[stat] = parseInt(inp.value); val.textContent = (parseInt(inp.value)>=0?'+':'') + inp.value; updateDamageResults(); };
    boostContainer.appendChild(el('div', {class:'boost-row'}, el('span', {}, stat.toUpperCase()), inp, val));
  }
  container.appendChild(el('div', {class:'form-group mt'}, el('label', {}, 'Boosts'), boostContainer));

  const stats = getSetStats(working, state.level);
  const preview = el('div', {class:'stats-display mt'});
  if (stats) for (const k of ['hp','atk','def','spa','spd','spe']) preview.appendChild(el('div', {}, el('span', {}, k.toUpperCase()), el('span', {}, String(stats[k]))));
  container.appendChild(preview);
}

function renderFieldOpts() {
  const c = $id('fieldOpts'); c.innerHTML = '';
  const ws = el('select');
  ws.appendChild(el('option', {value:'none'}, 'Nenhum'));
  ws.appendChild(el('option', {value:'sun'}, 'Sol'));
  ws.appendChild(el('option', {value:'rain'}, 'Chuva'));
  ws.appendChild(el('option', {value:'sandstorm'}, 'Temp. de Areia'));
  ws.appendChild(el('option', {value:'hail'}, 'Granizo'));
  ws.value = state.field.weather;
  ws.onchange = () => { state.field.weather = ws.value; updateDamageResults(); };
  c.appendChild(el('label', {}, 'Clima: ', ws));
  const critCb = el('input', {type:'checkbox', checked:state.field.crit, on:{change:() => { state.field.crit = critCb.checked; updateDamageResults(); }}});
  c.appendChild(el('label', {}, critCb, ' Crítico'));
  const refCb = el('input', {type:'checkbox', checked:state.field.reflect, on:{change:() => { state.field.reflect = refCb.checked; updateDamageResults(); }}});
  c.appendChild(el('label', {}, refCb, ' Reflect'));
  const lsCb = el('input', {type:'checkbox', checked:state.field.lightScreen, on:{change:() => { state.field.lightScreen = lsCb.checked; updateDamageResults(); }}});
  c.appendChild(el('label', {}, lsCb, ' Light Screen'));
}

function updateDamageResults() {
  const c = $id('damageResults');
  const atk = state.damageAtk, def = state.damageDef;
  if (!atk || !atk.species || !def || !def.species) { c.innerHTML = '<p class="hint">Selecione atacante e defensor.</p>'; return; }
  if (!atk.moves || !atk.moves.length) { c.innerHTML = '<p class="hint">Atacante sem golpes.</p>'; return; }
  atk._status = atk._status || 'none'; def._status = def._status || 'none';

  const opts = {
    level:state.level, weather:state.field.weather, crit:state.field.crit,
    reflect:state.field.reflect, lightScreen:state.field.lightScreen,
    atkBoosts:state.field.atkBoosts, defBoosts:state.field.defBoosts,
    atkHp:state.field.atkHp, defHp:state.field.defHp
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
  for (const mn of atk.moves) {
    if (!mn) continue;
    const r = calcDamage(atk, def, mn, opts);
    if (!r) continue;
    if (r.status) { tbody.appendChild(el('tr', {}, el('td', {}, mn), el('td', {}, typeBadge(r.moveType)), el('td', {}, '—'), el('td', {}, '—'), el('td', {}, el('span', {class:'ko-none'}, 'Status')))); continue; }
    if (r.skip) { tbody.appendChild(el('tr', {}, el('td', {}, mn), el('td', {}, typeBadge(r.moveType)), el('td', {}, 'Reativo'), el('td', {}, '—'), el('td', {}, el('span', {class:'ko-none'}, '—')))); continue; }
    if (r.ohko) { tbody.appendChild(el('tr', {}, el('td', {}, mn), el('td', {}, typeBadge(r.moveType)), el('td', {}, 'OHKO'), el('td', {}, '100%'), el('td', {}, el('span', {class:'ko-guaranteed'}, 'OHKO')))); continue; }
    if (r.immune) { tbody.appendChild(el('tr', {}, el('td', {}, mn), el('td', {}, typeBadge(r.moveType)), el('td', {}, 'Imune'), el('td', {}, '0%'), el('td', {}, el('span', {class:'ko-none'}, 'IMUNE')))); continue; }
    let kl, kc;
    if (r.fixed) { kl = 'Fixo'; kc = 'ko-possible'; }
    else if (r.pct[0] >= 100) { kl = 'OHKO garantido'; kc = 'ko-guaranteed'; }
    else if (r.pct[1] >= 100) { kl = 'OHKO possível'; kc = 'ko-possible'; }
    else if (r.pct[1] >= 50) { kl = '2HKO possível'; kc = 'ko-possible'; }
    else { kl = Math.ceil(100 / Math.max(0.1, r.pct[1])) + 'HKO'; kc = 'ko-none'; }
    const pb = el('div', {class:'pct-bar'}, el('div', {class:'pct-bar-fill', style:`width:${Math.min(100, r.pct[1])}%`}));
    tbody.appendChild(el('tr', {},
      el('td', {}, mn), el('td', {}, typeBadge(r.moveType)),
      el('td', {}, `${r.min} - ${r.max}`),
      el('td', {}, `${r.pct[0]}% - ${r.pct[1]}%`, pb),
      el('td', {}, el('span', {class:'ko-badge ' + kc}, kl))
    ));
  }
  c.innerHTML = '';
  c.appendChild(table);
  c.appendChild(el('p', {class:'hint'}, `HP do defensor: ${defHp}. Nível ${state.level}.`));
}

/* ============ BUFFS ============ */
function renderBuffs() {
  const pWrap = $id('buffPokemonWrap');
  pWrap.innerHTML = '';
  const pSel = createPokemonSelect(state.buffPokemon || '', (name) => {
    state.buffPokemon = name;
    state.buffAbility = null;
    renderBuffs();
  });
  pWrap.appendChild(pSel);

  const iWrap = $id('buffItemWrap');
  iWrap.innerHTML = '';
  const iSel = createItemSelect(state.buffItem || 'None', (name) => {
    state.buffItem = name;
    renderBuffs();
  });
  iWrap.appendChild(iSel);

  const nSel = $id('buffNature');
  if (nSel.options.length === 0) for (const n in NATURES) nSel.appendChild(el('option', {value:n}, n));
  nSel.value = state.buffNature;
  nSel.onchange = () => { state.buffNature = nSel.value; renderBuffDetails(); };

  const statusContainer = $id('buffStatus');
  statusContainer.innerHTML = '';
  const statuses = ['none','burned','poisoned','badly_poisoned','paralyzed','frozen','asleep'];
  const labels = {none:'Nenhum',burned:'Queimado',poisoned:'Envenenado',badly_poisoned:'Tóxico',paralyzed:'Paralisado',frozen:'Congelado',asleep:'Dormindo'};
  for (const s of statuses) {
    const btn = el('button', {class:'small', style: state.buffStatus === s ? 'background:var(--wine);border-color:var(--wine-light)' : '', on:{
      click: () => { state.buffStatus = s; renderBuffs(); }
    }}, labels[s]);
    statusContainer.appendChild(btn);
  }
  if (!state.buffStatus) state.buffStatus = 'none';

  renderBuffDetails();
}

function renderBuffDetails() {
  const species = state.buffPokemon;
  const nature = state.buffNature;
  const item = state.buffItem;
  const result = $id('buffResult');
  if (!species || !POKEMON[species]) { result.innerHTML = '<p class="hint">Selecione um Pokémon.</p>'; return; }
  const p = POKEMON[species];

  const abilitySel = $id('buffAbility');
  if (abilitySel.dataset.species !== species) {
    abilitySel.innerHTML = '';
    for (const a of p.abilities) abilitySel.appendChild(el('option', {value:a}, a));
    abilitySel.dataset.species = species;
    abilitySel.onchange = renderBuffDetails;
  }
  const ability = abilitySel.value || p.abilities[0];

  const evContainer = $id('buffEVs');
  if (!evContainer.dataset.built) {
    evContainer.innerHTML = '';
    const L = ['HP','Atk','Def','SpA','SpD','Spe'];
    for (let i = 0; i < 6; i++) {
      const inp = el('input', {type:'number', min:0, max:252, value:state.buffEvs[i] || 0});
      inp.onchange = () => { state.buffEvs[i] = Math.max(0, Math.min(252, parseInt(inp.value)||0)); renderBuffDetails(); };
      evContainer.appendChild(el('div', {class:'ev-col'}, el('label', {}, L[i]), inp));
    }
    evContainer.dataset.built = '1';
  }
  const totalEv = state.buffEvs.reduce((a,b)=>a+b,0);
  const evTotalEl = $id('buffEvTotal');
  evTotalEl.textContent = `${totalEv} / 510`;
  evTotalEl.className = 'ev-total' + (totalEv > 510 ? ' over' : totalEv > 480 ? ' warn' : '');

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

  const set = {species, nature, ability, item, evs:state.buffEvs, ivs:[31,31,31,31,31,31], moves:[]};
  const base = getSetStats(set, state.level);
  const finalStats = { ...base };
  for (const k of ['atk','def','spa','spd','spe']) finalStats[k] = Math.floor(base[k] * statStageMult(state.buffBoosts[k]));
  let note = '';
  if (state.buffStatus === 'burned') { finalStats.atk = Math.floor(finalStats.atk/2); note = 'Queimado: Atk ÷ 2'; }
  else if (state.buffStatus === 'paralyzed') { finalStats.spe = Math.floor(finalStats.spe/2); note = 'Paralisado: Spe ÷ 2'; }

  result.innerHTML = '';
  const grid = el('div', {class:'stat-changes'});
  grid.appendChild(el('div', {class:'stat-box'}, el('div', {class:'lbl'}, 'HP'), el('div', {class:'num'}, String(base.hp)), el('div', {class:'mult'}, '—')));
  const lbls = {atk:'Atk',def:'Def',spa:'SpA',spd:'SpD',spe:'Spe'};
  for (const k of ['atk','def','spa','spd','spe']) {
    grid.appendChild(el('div', {class:'stat-box'},
      el('div', {class:'lbl'}, lbls[k]),
      el('div', {class:'num'}, String(finalStats[k])),
      el('div', {class:'mult'}, `base ${base[k]} × ${(finalStats[k]/base[k]).toFixed(2)}`)
    ));
  }
  result.appendChild(grid);
  result.appendChild(el('p', {class:'hint'}, `Nível ${state.level}. ${note}`));
}

/* ============ ANÁLISE ============ */
function renderAnalysis() {
  const defC = $id('defAnalysis');
  defC.innerHTML = '';
  const tt = [];
  for (const p of state.team) if (p && POKEMON[p.species]) tt.push(...POKEMON[p.species].types);
  if (tt.length === 0) defC.innerHTML = '<p class="hint">Adicione Pokémon ao time.</p>';
  else {
    for (const at of TYPES) {
      let w4=0,w2=0,r4=0,r2=0,im=0;
      for (const p of state.team) {
        if (!p || !POKEMON[p.species]) continue;
        const e = typeEffectiveness(at, POKEMON[p.species].types);
        if (e === 0) im++; else if (e === 0.25) r4++; else if (e === 0.5) r2++; else if (e === 2) w2++; else if (e === 4) w4++;
      }
      let cls = 'type-cell', cnt = '';
      if (im > 0) { cls += ' immune'; cnt = `×${im}`; }
      else if (w4 > 0) { cls += ' weak-4'; cnt = `-${w4*4}`; }
      else if (w2 > 0) { cls += ' weak-2'; cnt = `-${w2*2}`; }
      else if (r4 > 0) { cls += ' resist-4'; cnt = `+${r4*4}`; }
      else if (r2 > 0) { cls += ' resist-2'; cnt = `+${r2*2}`; }
      const cell = el('div', {class:cls}, typeBadge(at));
      if (cnt) cell.appendChild(el('span', {class:'cnt'}, cnt));
      defC.appendChild(cell);
    }
  }
  const enemySel = $id('enemyTeam');
  if (enemySel.options.length === 0) for (const n of POKEMON_NAMES) enemySel.appendChild(el('option', {value:n}, n));
  enemySel.onchange = updateOffensiveAnalysis;
  updateOffensiveAnalysis();
}

function updateOffensiveAnalysis() {
  const enemySel = $id('enemyTeam');
  const enemies = Array.from(enemySel.selectedOptions).map(o => o.value);
  const c = $id('offAnalysis');
  c.innerHTML = '';
  if (!enemies.length) { c.innerHTML = '<p class="hint">Selecione inimigos.</p>'; return; }
  const mt = new Set();
  for (const p of state.team) {
    if (!p) continue;
    for (const m of p.moves || []) if (MOVES[m] && MOVES[m].category !== 'Status') mt.add(MOVES[m].type);
  }
  const table = el('table', {class:'result-table'},
    el('thead', {}, el('tr', {}, el('th', {}, 'Inimigo'), el('th', {}, 'Tipos'), el('th', {}, 'Fraco a'), el('th', {}, 'Resiste a'))),
    el('tbody')
  );
  const tbody = table.querySelector('tbody');
  for (const name of enemies) {
    const p = POKEMON[name]; if (!p) continue;
    const weak = [], res = [];
    for (const t of mt) {
      const e = typeEffectiveness(t, p.types);
      if (e > 1) weak.push(t); else if (e < 1 && e > 0) res.push(t);
    }
    tbody.appendChild(el('tr', {},
      el('td', {}, name),
      el('td', {}, ...p.types.map(typeBadge)),
      el('td', {}, ...weak.map(t => typeBadge(t))),
      el('td', {}, ...res.map(t => typeBadge(t)))
    ));
  }
  c.appendChild(table);
}

/* ============ SHARE / IMPORT ============ */
function encodeTeam(team) {
  const compact = team.map(p => p ? [p.species,p.nature,p.ability,p.item,p.evs,p.ivs,p.moves] : null);
  return btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
}
function decodeTeam(str) {
  try {
    const c = JSON.parse(decodeURIComponent(escape(atob(str))));
    return c.map(p => p ? {species:p[0],nature:p[1],ability:p[2],item:p[3],evs:p[4]||[0,0,0,0,0,0],ivs:p[5]||[31,31,31,31,31,31],moves:p[6]||[]} : null);
  } catch(e) { return null; }
}
function loadFromUrl() {
  const h = location.hash;
  if (h.startsWith('#team=')) {
    const d = decodeTeam(h.substring(6));
    if (d) state.team = d;
  }
}
function shareTeam() {
  if (!state.team.some(p => p)) { showToast('Time vazio'); return; }
  const enc = encodeTeam(state.team);
  const url = location.origin + location.pathname + '#team=' + enc;
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => showToast('Link copiado!')).catch(() => prompt('Copie:', url));
  else prompt('Copie:', url);
  history.replaceState(null, '', '#team=' + enc);
}
function importTeam() {
  const i = prompt('Cole o link ou código:'); if (!i) return;
  let e = i.trim(); if (e.includes('#team=')) e = e.split('#team=')[1];
  const d = decodeTeam(e);
  if (d) { state.team = d; renderTeam(); refreshDamageSelectors(); showToast('Importado!'); }
  else showToast('Código inválido');
}

/* ============ TABS ============ */
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

/* ============ INIT ============ */
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
  $id('pickerClose').addEventListener('click', closePicker);
  $id('pickerModal').addEventListener('click', e => { if (e.target.id === 'pickerModal') closePicker(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if ($id('pickerModal').classList.contains('open')) closePicker();
      else if ($id('modal').classList.contains('open')) closeModal();
    }
  });

  try { await loadData(); }
  catch(e) { console.error(e); showToast('Erro ao carregar dados. Verifique os JSONs.'); return; }

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
