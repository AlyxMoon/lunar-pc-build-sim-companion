import { BuildModelInterface, Parts } from '@/typings'
import BuildModel from '@/models/Build.model'

// assumes highest amount of RAM sticks / frequency to be as permissive as possible
const getCpuScore = (
  cpu: Parts.CpuInterface,
  memFreq = cpu.defaultMemSpeed,
  memCount = cpu.maxMemChannels,
): number => {
  return Math.floor((
    (cpu.multCoreClock * cpu.frequency) +
    (cpu.multMemChannels * memCount) +
    (cpu.multMemClock * memFreq) +
    cpu.multAdjust
  ) * 298)
}

const getGpuScore = (
  gpu: Parts.GpuInterface,
  dual = false,
): number => {
  const calcType = dual ? 'Dual' : 'Single'

  const gpuCoreClockMult1 = gpu[`multCore${calcType}1`] as number
  const gpuCoreClockMult2 = gpu[`multCore${calcType}2`] as number

  const gpuMemClockMult1 = gpu[`multMem${calcType}1`] as number
  const gpuMemClockMult2 = gpu[`multMem${calcType}2`] as number

  const gpuAdjust1 = gpu[`multAdjust${calcType}1`] as number
  const gpuAdjust2 = gpu[`multAdjust${calcType}2`] as number

  return Math.floor(164 / (
    0.5 / (
      (gpuCoreClockMult1 * gpu.baseCoreFreq) +
      (gpuMemClockMult1 * gpu.baseMemFreq) +
      gpuAdjust1
    ) +
    0.5 / (
      (gpuCoreClockMult2 * gpu.baseCoreFreq) +
      (gpuMemClockMult2 * gpu.baseMemFreq) +
      gpuAdjust2
    )
  ))
}

const generateBuildMeets3dmarkScore = async (
  availablePartsByCategory: Parts.ByCategoryInterface,
  args: {
    desiredScore: number,
    budget: number,
    playerLevel: number,
    limit: number,
    usePlayerLevel: boolean,
    useBudget: boolean,
  },
): Promise<BuildModelInterface[]> => {
  const gpus = availablePartsByCategory.gpus.filter((part: Parts.GpuInterface) => {
    const meetsLevel = !args.usePlayerLevel || part.level <= args.playerLevel
    const meetsBudget = !args.useBudget || part.price <= args.budget
    const scoreToMeet = args.desiredScore * 0.85

    return (
      meetsLevel &&
      meetsBudget &&
      (getGpuScore(part) >= scoreToMeet || getGpuScore(part, true) >= scoreToMeet)
    )
  })

  const cpus = availablePartsByCategory.cpus.filter((part: Parts.CpuInterface) => {
    const meetsLevel = !args.usePlayerLevel || part.level <= args.playerLevel
    const meetsBudget = !args.useBudget || part.price <= args.budget
    const scoreToMeet = args.desiredScore * 0.15

    return (
      meetsLevel && meetsBudget &&
      (getCpuScore(part) >= scoreToMeet)
    )
  })

  const memory = availablePartsByCategory.memory.filter((part: Parts.MemoryInterface) => {
    const meetsLevel = !args.usePlayerLevel || part.level <= args.playerLevel
    const meetsBudget = !args.useBudget || part.price <= args.budget

    return meetsLevel && meetsBudget
  })

  const validCombinations: BuildModelInterface[] = []

  for (const gpu of gpus) {
    for (const cpu of cpus) {
      for (const mem of memory) {
        const cpuScore = getCpuScore(cpu, mem.frequency, 1)
        const gpuScore = getGpuScore(gpu)

        const score = Math.floor(1 / (
          (0.85 / gpuScore) +
          (0.15 / cpuScore)
        ))

        const price = gpu.price + cpu.price + mem.price

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
