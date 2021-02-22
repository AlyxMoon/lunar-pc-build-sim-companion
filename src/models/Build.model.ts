import { BuildModelInterface, PlainObject, ValidationFunctionArray, Parts } from '@/typings'
import BaseModel from './_BaseModel'
import {
  caseFitsCpuCooler,
  caseFitsGpu,
  caseFitsMotherboard,
  caseFitsPowersupply,
  cpuSupportsCooler,
  gpuMultiCompatible,
  memoryIsCompatible,
  motherboardFitsCpu,
  motherboardSupportsMultiGpu,
  newPartsUnderBudget,
  psuProvidesEnoughWattage,
} from '@/lib/buildValidationRules'

class BuildModel extends BaseModel implements BuildModelInterface {
  budget?: number
  parts?: Parts.BaseInterface[]
  estimatedScore?: number

  defaults (): PlainObject {
    return {
      name: 'New Build',
      jobType: '',
      budget: 0,
      estimatedScore: 0,
      objectives: [],
      parts: [],
    }
  }

  runBenchmark (): number {
    const cpu = this.findPartOfType('CPU') as Parts.CpuInterface
    const gpus = this.findPartOfType('GPU') as Parts.GpuInterface[]
    const memory = this.findPartOfType('Memory') as Parts.MemoryInterface[]

    gpus.sort((a, b) => a.baseCoreFreq - b.baseCoreFreq)

    if (!cpu || !gpus.length || !memory.length) {
      return (this.attributes.estimatedScore = 0)
    }

    const memoryChannels = Math.min(cpu.maxMemChannels, memory.length)
    const memorySpeed = memory[0].frequency

    const cpuScore = Math.floor((
      (cpu.multCoreClock * cpu.frequency) +
      (cpu.multMemChannels * memoryChannels) +
      (cpu.multMemClock * memorySpeed) +
      cpu.multAdjust
    ) * 298)

    const gpuBaseCoreFreq = gpus[0].baseCoreFreq
    const gpuBaseMemFreq = gpus[0].baseMemFreq
    const calcType = gpus.length === 1 ? 'Single' : 'Dual'
    const gpu = gpus[0]

    const gpuCoreClockMult1 = gpu[`multCore${calcType}1`] as number
    const gpuCoreClockMult2 = gpu[`multCore${calcType}2`] as number

    const gpuMemClockMult1 = gpu[`multMem${calcType}1`] as number
    const gpuMemClockMult2 = gpu[`multMem${calcType}2`] as number

    const gpuAdjust1 = gpu[`multAdjust${calcType}1`] as number
    const gpuAdjust2 = gpu[`multAdjust${calcType}2`] as number

    const gpuScore = Math.floor(164 / (
      0.5 / (
        (gpuCoreClockMult1 * gpuBaseCoreFreq) +
        (gpuMemClockMult1 * gpuBaseMemFreq) +
        gpuAdjust1
      ) +
      0.5 / (
        (gpuCoreClockMult2 * gpuBaseCoreFreq) +
        (gpuMemClockMult2 * gpuBaseMemFreq) +
        gpuAdjust2
      )
    ))

    this.estimatedScore = Math.floor(1 / (
      (0.85 / gpuScore) +
      (0.15 / cpuScore)
    ))

    return this.estimatedScore
  }

  findPartOfType (
    type: string,
    { limit = true } = {},
  ): Parts.BaseInterface | Parts.BaseInterface[] {
    const parts = this.parts?.filter(part => part.type === 'GPU') ?? []

    if (type === 'GPU') {
      return limit ? parts.slice(0, 2) : parts
    }

    if (['Case Fan', 'Memory', 'Storage'].includes(type)) return parts

    return parts[0]
  }

  validations (): ValidationFunctionArray {
    return [
      caseFitsCpuCooler,
      caseFitsGpu,
      caseFitsMotherboard,
      caseFitsPowersupply,
      cpuSupportsCooler,
      gpuMultiCompatible,
      memoryIsCompatible,
      motherboardFitsCpu,
      motherboardSupportsMultiGpu,
      newPartsUnderBudget,
      psuProvidesEnoughWattage,
    ]
  }

  beforeCreate (attributes: PlainObject): void {
    // apply migration to handle change of how parts are handled
    // can remove this in about a month 2021-02-01

    const startingParts: PlainObject[] = attributes.startingParts || []
    const newParts: PlainObject[] = attributes.newParts || []

    delete attributes.startingParts
    delete attributes.newParts

    if (!startingParts.length && !newParts.length) return

    attributes.parts = []

    attributes.parts.push(...startingParts.map(part => ({
      ...part,
      isNewPart: false,
      isBeingKept: false,
    })))

    attributes.parts.push(...newParts.map(part => ({
      ...part,
      isNewPart: true,
      isBeingKept: true,
    })))
  }

  afterCreate (): void {
    this.runBenchmark()
  }
}

export default BuildModel
