import { describe, expect, it } from 'vitest'
import calculateCpuStats from '@/lib/calculations/calculateCpuStats'
import calculateGpuStats from '@/lib/calculations/calculateGpuStats'
import { cpu, cpus, gpus, namedPart } from './scoreFixtures'

describe('calculateCpuStats', () => {
  it.each([
    ['AMD Ryzen 3 Quad Core 1200', 988, 2945],
    ['Intel Core i7-7700K', 1804, 5376],
    ['AMD Ryzen Threadripper Sixteen Core 1950X', 3222, 9602],
  ] as const)('pins rank and default score for %s', (name, rank, score) => {
    expect(calculateCpuStats(namedPart(cpus, name))).toEqual({ rank, score })
  })

  it('uses supplied memory speed and channel count for score while preserving rank', () => {
    expect(calculateCpuStats(cpu(), 2133, 1)).toEqual({ rank: 988, score: 2645 })
    expect(calculateCpuStats(cpu(), 2133, 2)).toEqual({ rank: 988, score: 2795 })
  })
})

describe('calculateGpuStats', () => {
  it.each([
    ['Shean GeForce GTX 750 Ti GAMER', 756, 1163, 0],
    ['MSI GeForce GTX 950 GAMING 2G', 1217, 1846, 3717],
    ['MSI GeForce GTX 960 GAMING 100ME', 1451, 2225, 4386],
  ] as const)('pins rank and single/dual scores for %s', (name, rank, scoreSingle, scoreDual) => {
    expect(calculateGpuStats(namedPart(gpus, name))).toEqual({ rank, scoreSingle, scoreDual })
  })
})
