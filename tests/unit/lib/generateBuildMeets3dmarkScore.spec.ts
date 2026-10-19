import { describe, expect, it } from 'vitest'
import generateBuild from '@/lib/calculations/generateBuildMeets3dmarkScore'
import type { Parts } from '@/typings'
import { cpu, cpus, gpu, gpus, memory, namedPart, ram } from './scoreFixtures'

const availableParts = (): Parts.ByCategoryInterface => ({
  cpus: [cpu()], gpus: [gpu()], memory: [ram()],
})

const options = () => ({
  desiredScore: 1933,
  budget: 375,
  playerLevel: 17,
  limit: 10,
  useBudget: false,
  usePlayerLevel: false,
  slowDownProcess: false,
})

describe('generateBuildMeets3dmarkScore', () => {
  it('includes the exact score threshold and rejects one point above it', async () => {
    const builds = await generateBuild(availableParts(), options())
    expect(builds).toHaveLength(1)
    expect(builds[0].estimatedScore).toBe(1933)
    expect(builds[0].parts.map(part => part.nameFull)).toEqual([
      'MSI GeForce GTX 950 GAMING 2G',
      'AMD Ryzen 3 Quad Core 1200',
      'ADATA ECC U-DIMM 8 GB 2133 MHz',
    ])
    expect(await generateBuild(availableParts(), { ...options(), desiredScore: 1934 })).toEqual([])
  })

  it('applies the inclusive total budget only when enabled', async () => {
    expect(await generateBuild(availableParts(), { ...options(), useBudget: true })).toHaveLength(1)
    expect(await generateBuild(availableParts(), { ...options(), useBudget: true, budget: 374 })).toEqual([])
    expect(await generateBuild(availableParts(), { ...options(), budget: 1 })).toHaveLength(1)
  })

  it('accepts parts at the player level and rejects the real level 17 memory at level 16', async () => {
    expect(await generateBuild(availableParts(), { ...options(), usePlayerLevel: true })).toHaveLength(1)
    expect(await generateBuild(availableParts(), {
      ...options(), usePlayerLevel: true, playerLevel: 16,
    })).toEqual([])
  })

  it.each(['cpus', 'gpus', 'memory'] as const)('applies the level filter to %s only when enabled', async category => {
    const parts = availableParts()
    parts[category][0].level = 18
    expect(await generateBuild(parts, { ...options(), usePlayerLevel: true })).toEqual([])
    expect(await generateBuild(parts, options())).toHaveLength(1)
  })

  it.each([1, 2, 4, 7, 20])('limits results to %i across GPU, CPU and memory loops in input order', async limit => {
    const parts = availableParts()
    parts.gpus.push(namedPart(gpus, 'MSI GeForce GTX 960 GAMING 100ME'))
    parts.cpus.push(namedPart(cpus, 'Intel Core i7-7700K'))
    parts.memory.push(
      namedPart(memory, 'ADATA ECC U-DIMM 8 GB 2400 MHz'),
      namedPart(memory, 'ADATA ECC U-DIMM 8 GB 2666 MHz'),
    )
    const builds = await generateBuild(parts, { ...options(), limit })
    const combinations = parts.gpus.flatMap(gpu => parts.cpus.flatMap(cpu =>
      parts.memory.map(mem => [gpu.nameFull, cpu.nameFull, mem.nameFull]),
    ))
    expect(builds).toHaveLength(Math.min(limit, 12))
    expect(builds.map(build => build.parts.map(part => part.nameFull))).toEqual(combinations.slice(0, limit))
  })
})
