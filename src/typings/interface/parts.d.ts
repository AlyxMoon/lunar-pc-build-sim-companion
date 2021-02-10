
// cpucoolers
// cpus
// gpus
// memory
// motherboards
// powersupplies
// storage

export declare namespace Parts {
  export interface BaseInterface {
    [key: string]: number | string | boolean,
  }

  export interface CaseInterface extends BaseInterface {
    name: string,
  }

  export interface CaseFanInterface extends BaseInterface {
    name: string,
  }

  export interface Cpu extends BaseInterface {
    frequency: number,
    coreCount: number,
    socketType: value,
    canOverclock: boolean,
    ocMultStep: number,
    maxMemChannels: number,
    baseVolt: number,
    baseFreq: number,
    multCoreClock: number,
    multMemChannels: number,
    multMemClock: number,
    multAdjust: number,
  }

  export interface Gpu extends BaseInterface {
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
  }

  export interface PartMotherboardInterface extends BaseInterface {
    name: string,
  }
}
