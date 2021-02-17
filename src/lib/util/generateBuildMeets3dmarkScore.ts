import { BuildModelInterface, parts } from '@/typings/interface'
import BuildModel from '@/models/Build.model'

// assumes highest amount of RAM sticks / frequency to be as permissive as possible
const getCpuScore = (part: parts.BaseInterface, memFreq?: number, memCount?: number): number => {
  const coreClockMultiplier = part.CoreClockMultiplier as number
  const finalAdjustment = part.FinalAdjustment as number
  const frequency = part.Frequency as number
  const memChannelsMultiplier = part.MemChannelsMultiplier as number
  const memClockMultiplier = part.MemClockMultiplier as number

  const memoryChannels = (memCount || part['Max Memory Channels']) as number
  const memorySpeed = (memFreq || part['Default Memory Speed']) as number

  return Math.floor((
    (coreClockMultiplier * frequency) +
    (memChannelsMultiplier * memoryChannels) +
    (memClockMultiplier * memorySpeed) +
    finalAdjustment
  ) * 298)
}

const getGpuSingleScore = (part: parts.BaseInterface): number => {
  const gpuBaseCoreFreq = part['Base Core Freq'] as number
  const gpuBaseMemFreq = part['Base Mem Freq'] as number

  const gpuCoreClockMult1 = part['GT1 Single Core Clock Multiplier'] as number
  const gpuCoreClockMult2 = part['GT2 Single Core Clock Multiplier'] as number

  const gpuMemClockMult1 = part['GT1 Single Mem Clock Multiplier'] as number
  const gpuMemClockMult2 = part['GT2 Single Mem Clock Multiplier'] as number

  const gpuAdjust1 = part['GT1 Single Benchmark Adjustment'] as number
  const gpuAdjust2 = part['GT2 Single Benchmark Adjustment'] as number

  return Math.floor(164 / (
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
}

const getGpuDualScore = (part: parts.BaseInterface): number => {
  const gpuBaseCoreFreq = part['Base Core Freq'] as number
  const gpuBaseMemFreq = part['Base Mem Freq'] as number

  const gpuCoreClockMult1 = part['GT1 Dual Core Clock Multiplier'] as number
  const gpuCoreClockMult2 = part['GT2 Dual Core Clock Multiplier'] as number

  const gpuMemClockMult1 = part['GT1 Dual Mem Clock Multiplier'] as number
  const gpuMemClockMult2 = part['GT2 Dual Mem Clock Multiplier'] as number

  const gpuAdjust1 = part['GT1 Dual Benchmark Adjustment'] as number
  const gpuAdjust2 = part['GT2 Dual Benchmark Adjustment'] as number

  return Math.floor(164 / (
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
}

const generateBuildMeets3dmarkScore = async (
  availablePartsByCategory: Record<string, parts.BaseInterface>,
  args: {
    desiredScore: number,
    budget: number,
    playerLevel: number,
    limit: number,
    usePlayerLevel: boolean,
    useBudget: boolean,
  },
): Promise<BuildModelInterface[]> => {
  const gpus = availablePartsByCategory.gpus.filter((part: parts.BaseInterface) => {
    const meetsLevel = !args.usePlayerLevel || part.Level <= args.playerLevel
    const meetsBudget = !args.useBudget || part.Price <= args.budget
    const scoreToMeet = args.desiredScore * 0.85

    return (
      meetsLevel &&
      meetsBudget &&
      (getGpuSingleScore(part) >= scoreToMeet || getGpuDualScore(part) >= scoreToMeet)
    )
  })

  const cpus = availablePartsByCategory.cpus.filter((part: parts.BaseInterface) => {
    const meetsLevel = !args.usePlayerLevel || part.Level <= args.playerLevel
    const meetsBudget = !args.useBudget || part.Price <= args.budget
    const scoreToMeet = args.desiredScore * 0.15

    return meetsLevel && meetsBudget && (getCpuScore(part) >= scoreToMeet)
  })

  const memory = availablePartsByCategory.memory.filter((part: parts.BaseInterface) => {
    const meetsLevel = !args.usePlayerLevel || part.Level <= args.playerLevel
    const meetsBudget = !args.useBudget || part.Price <= args.budget

    return meetsLevel && meetsBudget
  })

  const validCombinations: BuildModelInterface[] = []

  for (const gpu of gpus) {
    for (const cpu of cpus) {
      for (const mem of memory) {
        const cpuScore = getCpuScore(cpu, mem.Frequency, 1)
        const gpuScore = getGpuSingleScore(gpu)

        const score = Math.floor(1 / (
          (0.85 / gpuScore) +
          (0.15 / cpuScore)
        ))

        const price = gpu.Price + cpu.Price + mem.Price

        if (
          score >= args.desiredScore &&
          (!args.useBudget || price <= args.budget)
        ) {
          validCombinations.push(new BuildModel({
            parts: [gpu, cpu, mem],
          }))
        }

        if (validCombinations.length >= args.limit) break
      }

      if (validCombinations.length >= args.limit) break
    }

    if (validCombinations.length >= args.limit) break
  }

  return validCombinations
}

export default generateBuildMeets3dmarkScore
