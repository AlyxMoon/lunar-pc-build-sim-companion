import BaseModel from './_BaseModel'

const ensureNewPartsUnderBudget = (build: any) => {
  const { budget, newParts } = build
  const sumOfNewParts = newParts.reduce((sum: number, part: any) => sum + part.Price, 0)

  return (
    budget >= sumOfNewParts ||
    'You are over budget.'
  )
}

const checkCpuCompatibleWithMotherboard = (build: any) => {
  const { startingParts, newParts } = build

  const cpu = (
    newParts.find((part: any) => part['Part Type'] === 'CPU') ||
    startingParts.find((part: any) => part['Part Type'] === 'CPU')
  )

  const motherboard = (
    newParts.find((part: any) => part['Part Type'] === 'Motherboard') ||
    startingParts.find((part: any) => part['Part Type'] === 'Motherboard')
  )

  if (!cpu || !motherboard) return true

  const isSkyOrKabyCpu = (
    cpu.Socket.endsWith('(Skylake)') ||
    cpu.Socket.endsWith('(Kaby Lake)')
  )

  const isSkyOrKabyMotherboard = (
    motherboard['CPU Socket'].endsWith('(Skylake)') ||
    motherboard['CPU Socket'].endsWith('(Kaby Lake)')
  )

  return (
    (isSkyOrKabyCpu && isSkyOrKabyMotherboard) ||
    (!isSkyOrKabyCpu && motherboard['CPU Socket'] === cpu.Socket) ||
    'The cpu will not fit in the motherboard.'
  )
}

const checkMotherboardFitsInCase = (build: any) => {
  const { startingParts, newParts } = build

  const computerCase = (
    newParts.find((part: any) => part['Part Type'] === 'Case') ||
    startingParts.find((part: any) => part['Part Type'] === 'Case')
  )

  const motherboard = (
    newParts.find((part: any) => part['Part Type'] === 'Motherboard') ||
    startingParts.find((part: any) => part['Part Type'] === 'Motherboard')
  )

  if (!computerCase || !motherboard) return true

  return (
    computerCase[motherboard.Size] ||
    'The motherboard will not fit in the case.'
  )
}

const checkPowerSupplyFitsInCase = (build: any) => {
  const { startingParts, newParts } = build

  const computerCase = (
    newParts.find((part: any) => part['Part Type'] === 'Case') ||
    startingParts.find((part: any) => part['Part Type'] === 'Case')
  )

  const powerSupply = (
    newParts.find((part: any) => part['Part Type'] === 'Power Supply') ||
    startingParts.find((part: any) => part['Part Type'] === 'Power Supply')
  )

  if (!computerCase || !powerSupply) return true

  return (
    computerCase[`PSU ${powerSupply.Size}`] ||
    'The power supply will not fit in the case.'
  )
}

class BuildModel extends BaseModel {
  [key: string]: any

  defaults () {
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

  runBenchmark () {
    const cpu = this.findPartOfType('CPU')

    const gpus = (this.findPartOfType('GPU') || []).sort((a: any, b: any) => {
      return a['Base Core Freq'] - b['Base Core Freq']
    })

    const memory = (this.findPartOfType('Memory') || [])

    if (!cpu || !gpus.length || !memory.length) {
      this.estimatedScore = 0
      return
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

    this.estimatedScore = Math.floor(1 / (
      (0.85 / gpuScore) +
      (0.15 / cpuScore)
    ))

    return this.estimatedScore
  }

  findPartOfType (type: string) {
    const startingPartsOfType = this.startingParts.filter((part: any) => {
      return part['Part Type'] === type
    })

    const newPartsOfType = this.newParts.filter((part: any) => {
      return part['Part Type'] === type
    })

    const parts = newPartsOfType.length ? newPartsOfType : startingPartsOfType

    if (type === 'GPU') {
      return parts.slice(0, 2)
    }

    if (
      ['Case Fan', 'Memory'].includes(type) ||
      type.startsWith('Storage')
    ) return parts

    return parts[0]
  }

  validations () {
    return [
      ensureNewPartsUnderBudget,
      checkMotherboardFitsInCase,
      checkPowerSupplyFitsInCase,
      checkCpuCompatibleWithMotherboard,
    ]
  }

  afterCreate () {
    this.runBenchmark()
  }
}

export default BuildModel
