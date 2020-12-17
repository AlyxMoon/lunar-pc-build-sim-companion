import BaseModel from './_BaseModel'

const nameMap = {
  adobe_photoshop: 'Adobe Photoshop CC',
  adobe_premiere: 'Adobe Premiere Pro CC',
  battlefield: 'Battlefield 1',
  civ_six: 'Sid Meier\'s Civilization VI',
  counter_strike: 'Counter-strike: Source',
  deadstick: 'Deadstick - Bush Flight Simulator',
  deerhuntingsim: 'Deer Hunting Simulator',
  doom: 'Doom',
  dota2: 'DOTA 2',
  eurotruck_sim: 'Eurotruck Simulator',
  f1: 'F1 2017',
  fable_fortune: 'Fable Fortune',
  farcry: 'Far Cry 5',
  farming_sim: 'Farming Simulator',
  feudalfantasy: 'Feudal Fantasy',
  flightsim: 'Flight Simulator',
  football_manager: 'Football Manager 2017',
  gtav: 'Grand Theft Auto V',
  hatoful: 'Hatoful Boyfriend: A School of Hope and White Wings',
  hearthstone: 'Hearthstone: Heroes of Warcraft',
  league: 'League of Legends',
  minecraft: 'Minecraft',
  overwatch: 'Overwatch',
  pubg: 'PlaterUnknown\'s Battlegrounds',
  rocket_league: 'Rocket League',
  sailaway: 'Sailaway - The Sailing Simulator',
  sublevel_zero: 'Sublevel Zero Redux',
  subsim: 'SubSim X',
  tanks: 'World of Tanks',
  warcraft: 'World of Warcraft',
}

const specsMap = {
  min: 'Minimum',
  rec: 'Recommended',
  x4k: 'Recommended 4k',
}

class ModelProgramRequirements extends BaseModel {
  fieldAliases () {
    return {
      Name: 'name',
      Level: 'level',
      'Is Game': 'isGame',
      Type: 'type',
      'Storage (GB)': 'storage',
      'RAM (GB)': 'memory',
      'CPU score': 'cpuScore',
      'GPU score': 'gpuScore',
      VRAM: 'gpuVram',
      Benchmark: 'benchmark',
    }
  }

  keepAttributes () {
    return [
      'name',
      'level',
      'type',
      'storage',
      'memory',
      'cpuScore',
      'gpuScore',
      'gpuVram',
      'benchmark',
    ]
  }

  mutations () {
    return {
      level: Number,
      storage: Number,
      memory: Number,
      cpuScore: Number,
      gpuScore: Number,
      gpuVram: Number,
      benchmark: Number,
    }
  }

  displayFilters () {
    return {
      name: val => nameMap[val] || val,
      type: val => specsMap[val] || val,
      gpuVram: val => `${val} GB`,
      memory: val => `${val} GB`,
      storage: val => `${val} GB`,
    }
  }
}

export default ModelProgramRequirements
