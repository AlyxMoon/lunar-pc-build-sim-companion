
export interface BaseInterface {
  [key: string]: number | string | boolean,
  name: string,
  nameFull: string,
  type: string,
  manufacturer: string,
  level: number,
  levelPercent: number,
  price: number,
  availableInShop: boolean,
}

export interface CaseInterface extends BaseInterface {
  lighting: string,
  sizeType: string,
  maxFan120: number,
  maxFan140: number,
  maxLengthPsu: number,
  maxLengthGpu: number,
  maxLengthCpuFan: number,
  typeOpenBench: boolean,
  case1Count: number,
  case1Model: string,
  case1Decorator: string,
  case2Count: number,
  case2Model: string,
  case2Decorator: string,
  case3Count: number,
  case3Model: string,
  case3Decorator: string,
  restrictedLengthGpu: number,
  supportedMotherboards: string[],
  supportedPowersupplies: string[],
}

export interface CaseFanInterface extends BaseInterface {
  lighting: string,
  airFlow: number,
  size: number,
  thickness: number,
  airPressure: number,
}

export interface CpuInterface extends BaseInterface {
  frequency: number,
  coreCount: number,
  socket: value,
  wattage: number,
  canOverclock: boolean,
  defaultMemSpeed: number,
  ocMultStep: number,
  maxMemChannels: number,
  baseVolt: number,
  baseFreq: number,
  multCoreClock: number,
  multMemChannels: number,
  multMemClock: number,
  multAdjust: number,
  rank: number,
  score: number,
}

export interface GpuInterface extends BaseInterface {
  lighting: string,
  vramGb: number,
  minCoreFreq: number,
  baseCoreFreq: number,
  baseCoreFreqOc: number,
  maxCoreFreq: number,
  minMemFreq: number,
  baseMemFreq: number,
  baseMemFreqOc: number,
  maxMemFreq: number,
  length: number,
  wattage: number,
  multi: string,
  baseCoreFreq: number,
  baseMemFreq: number,
  multCoreSingle1: number,
  multMemSingle1: number,
  multAdjustSingle1: number,
  multCoreSingle2: number,
  multMemSingle2: number,
  multAdjustSingle2: number,
  multCoreDual1: number,
  multMemDual1: number,
  multAdjustDual1: number,
  multCoreDual2: number,
  multMemDual2: number,
  multAdjustDual2: number,
  rank: number,
  scoreSingle: number,
  scoreDual: number,
  waterCooled: boolean,
}

export interface MemoryInterface extends BaseInterface {
  lighting: string,
  sizeGb: number,
  frequency: number,
  voltage: number,
  nameBase: string,
  ocBaseVoltage: number,
  ocBaseFrequency: number,
}

export interface MotherboardInterface extends BaseInterface {
  lighting: string,
  chipset: string,
  socket: string,
  sizeType: string,
  ramSpeedMax: number,
  gpuCrossFire: boolean,
  gpuSLI: boolean,
  canOverclock: boolean,
  storageMaxM2: number,
  storageMaxHeatsinkM2: number,
  ramMax: number,
  storageMaxSata: number,
  ramSpeedDefault: number,
  ramSpeedOptions: number[],
  ramSpeedMin: number,
  baseClock: number,
}

export interface PowerSupplyInterface extends BaseInterface {
  wattage: number,
  length: number,
  modularType: string,
  sizeType: string,
}

export interface StorageInterface extends BaseInterface {
  lighting: string,
  sizeGb: number,
  transferSpeed: number,
  includesHeatsink: false,
  heatsinkThickness: number,
  typeSecondary: string,
}

export interface ByCategoryInterface {
  cpus: Cpu[],
  gpus: Gpu[],
  memory: Memory[],
}
