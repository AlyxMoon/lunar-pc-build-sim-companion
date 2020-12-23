
export * from './parts.d.ts'

export as namespace Types

export interface PlainObject {
  [key: string]: any,
}

export interface StringMap {
  [key: string]: string,
}

export type StringArray = string[]

export type ValidationFunction = (val: any) => boolean | string
export type ValidationFunctionReturn = ReturnType<ValidationFunction>
export type ValidationFunctionArray = ValidationFunction[]

export type MutationFunction = (val: any) => any
export interface MutationFunctionMap {
  [key: string]: MutationFunction,
}

export type DisplayFunction = (val: any) => string
export interface DisplayFunctionMap {
  [key: string]: DisplayFunction,
}

export interface AppState {
  [key: string]: any,
}

export interface ImportExportData {
  [key: string]: any,
  builds?: Model[],
  playerLevel?: number,
}

export interface ModelInterface {
  [key: string]: any,
  _attributes: PlainObject,
  _hasErrors: boolean,
  _errors: StringArray,

  defaults: () => PlainObject,
  fieldAliases: () => StringMap,
  keepAttributes: () => StringArray,
  mutations: () => MutationFunctionMap,
  validations: () => ValidationFunctionArray,
  beforeCreate: (attributes: PlainObject) => void,
  afterCreate: () => void,
  displayFilters: () => DisplayFunctionMap,
}

export interface BuildModelInterface extends ModelInterface {
  name?: string,
  jobType?: string,
  budget?: number,
  estimatedScore?: estimatedScore,
  objectives?: string[],
  startingParts?: PlainObject[],
  newParts?: PlainObject[],
}

export interface ProgramRequirementsModelInterface extends ModelInterface {
  cpuScore?: number,
  gpuScore?: number,
  gpuVram?: number,
  memory?: number,
  storage?: number,
}
