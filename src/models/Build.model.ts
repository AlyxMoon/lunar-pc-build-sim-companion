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

import {
  calculateCpuStats,
  calculateGpuStats,
} from '@/lib/calculations'

class BuildModel extends BaseModel implements BuildModelInterface {
  id!: string

  name!: string
  budget!: number
  jobType!: string
  objectives!: string[]
  estimatedScore!: number
  parts!: Parts.BaseInterface[]

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

    if (!cpu || !gpus.length || !memory.length) {
      return (this.attributes.estimatedScore = 0)
    }

    gpus.sort((a, b) => a.baseCoreFreq - b.baseCoreFreq)

    const memoryChannels = Math.min(cpu.maxMemChannels, memory.length)
    const memorySpeed = memory[0].frequency

    const { score: cpuScore } = calculateCpuStats(cpu, memorySpeed, memoryChannels)
    const { scoreSingle, scoreDual } = calculateGpuStats(gpus[0])

    this.estimatedScore = Math.floor(1 / (
      (0.85 / (gpus.length === 1 ? scoreSingle : scoreDual)) +
      (0.15 / cpuScore)
    ))

    return this.estimatedScore
  }

  findPartOfType (
    type: string,
    { limit = true } = {},
  ): Parts.BaseInterface | Parts.BaseInterface[] {
    const parts = this.parts.filter(part => part.type === type) ?? []

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
