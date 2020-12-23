
// cpucoolers
// cpus
// gpus
// memory
// motherboards
// powersupplies
// storage

declare namespace Parts {
  export interface BaseInterface {
    [key: string]: number | string,
  }

  export interface CaseInterface extends PartBaseInterface {
    name: string,
  }

  export interface CaseFanInterface extends PartBaseInterface {
    name: string,
  }

  export interface PartMotherboardInterface extends PartBaseInterface {
    name: string,
  }
}
