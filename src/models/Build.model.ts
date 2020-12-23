import { BuildModelInterface, PlainObject, ValidationFunctionArray } from '@/typings/interface'
import BaseModel from './_BaseModel'
import {
  caseFitsMotherboard,
  caseFitsPowersupply,
  gpuMultiCompatible,
  motherboardFitsCpu,
  motherboardSupportsMultiGpu,
  newPartsUnderBudget,
} from '@/lib/buildValidationRules'

class BuildModel extends BaseModel implements BuildModelInterface {
  defaults (): PlainObject {
    return {
      name: 'New Build',
      jobType: '',
      budget: 0,
      estimatedScore: 0,
      objectives: [],
      startingParts: [],
      newParts: [],
    }
  }

  runBenchmark (): number {
    const cpu = this.findPartOfType('CPU')

    const gpus = (this.findPartOfType('GPU') || []).sort((a: any, b: any) => {
      return a['Base Core Freq'] - b['Base Core Freq']
    })

    const memory = (this.findPartOfType('Memory') || [])

    if (!cpu || !gpus.length || !memory.length) {
      return (this.attributes.estimatedScore = 0)
    }

    const memoryChannels = Math.min(cpu['Max Memory Channels'], memory.length)
    const memorySpeed = memory[0].Frequency

    const cpuScore = Math.floor((
      (cpu.CoreClockMultiplier * cpu.Frequency) +
      (cpu.MemChannelsMultiplier * memoryChannels) +
      (cpu.MemClockMultiplier * memorySpeed) +
      cpu.FinalAdjustment
    ) * 298)

    const gpuBaseCoreFreq = gpus[0]['Base Core Freq']
    const gpuBaseMemFreq = gpus[0]['Base Mem Freq']
    const calcType = gpus.length === 1 ? 'Single' : 'Dual'
    const gpu = gpus[0]

    const gpuCoreClockMult1 = gpu[`GT1 ${calcType} Core Clock Multiplier`]
    const gpuCoreClockMult2 = gpu[`GT2 ${calcType} Core Clock Multiplier`]

    const gpuMemClockMult1 = gpu[`GT1 ${calcType} Mem Clock Multiplier`]
    const gpuMemClockMult2 = gpu[`GT2 ${calcType} Mem Clock Multiplier`]

    const gpuAdjust1 = gpu[`GT1 ${calcType} Benchmark Adjustment`]
    const gpuAdjust2 = gpu[`GT2 ${calcType} Benchmark Adjustment`]

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

    this.attributes.estimatedScore = Math.floor(1 / (
      (0.85 / gpuScore) +
      (0.15 / cpuScore)
    ))

    return this.attributes.estimatedScore
  }

  findPartOfType (
    type: string,
    { limit = true, combineStartAndNew = false } = {},
  ): PlainObject {
    const startingPartsOfType = this.attributes.startingParts.filter((part: any) => {
      return part['Part Type'] === type
    })

    const newPartsOfType = this.attributes.newParts.filter((part: any) => {
      return part['Part Type'] === type
    })

    const parts = combineStartAndNew
      ? [...startingPartsOfType, ...newPartsOfType]
      : newPartsOfType.length ? newPartsOfType : startingPartsOfType

    if (type === 'GPU') {
      return limit ? parts.slice(0, 2) : parts
    }

    if (
      ['Case Fan', 'Memory'].includes(type) ||
      type.startsWith('Storage')
    ) return parts

    return parts[0]
  }

  validations (): ValidationFunctionArray {
    return [
      caseFitsMotherboard,
      caseFitsPowersupply,
      gpuMultiCompatible,
      motherboardFitsCpu,
      motherboardSupportsMultiGpu,
      newPartsUnderBudget,
    ]
  }

  afterCreate (): void {
    this.runBenchmark()
  }
}

export default BuildModel
