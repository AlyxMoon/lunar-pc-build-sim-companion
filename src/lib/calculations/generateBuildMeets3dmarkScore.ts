import { BuildModelInterface, Parts } from '@/typings'
import BuildModel from '@/models/Build.model'

import calculateCpuStats from './calculateCpuStats'

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
  const gpus: Parts.GpuInterface[] = availablePartsByCategory.gpus.filter((part: Parts.GpuInterface) => {
    const meetsLevel = !args.usePlayerLevel || part.level <= args.playerLevel
    const meetsBudget = !args.useBudget || part.price <= args.budget
    const scoreToMeet = args.desiredScore * 0.85

    return (
      meetsLevel &&
      meetsBudget &&
      (part.scoreSingle >= scoreToMeet || part.scoreDual >= scoreToMeet)
    )
  })

  const cpus: Parts.CpuInterface[] = availablePartsByCategory.cpus.filter((part: Parts.CpuInterface) => {
    const meetsLevel = !args.usePlayerLevel || part.level <= args.playerLevel
    const meetsBudget = !args.useBudget || part.price <= args.budget
    const scoreToMeet = args.desiredScore * 0.15

    return (
      meetsLevel &&
      meetsBudget &&
      part.score >= scoreToMeet
    )
  })

  const memory: Parts.MemoryInterface[] = availablePartsByCategory.memory.filter((part: Parts.MemoryInterface) => {
    const meetsLevel = !args.usePlayerLevel || part.level <= args.playerLevel
    const meetsBudget = !args.useBudget || part.price <= args.budget

    return meetsLevel && meetsBudget
  })

  const validCombinations: BuildModelInterface[] = []

  for (const gpu of gpus) {
    for (const cpu of cpus) {
      for (const mem of memory) {
        const cpuScore = calculateCpuStats(cpu, mem.frequency, 1).score

        const score = Math.floor(1 / (
          (0.85 / gpu.scoreSingle) +
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
