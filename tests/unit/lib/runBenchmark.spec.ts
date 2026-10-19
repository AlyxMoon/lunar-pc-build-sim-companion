import { describe, expect, it } from 'vitest'
import BuildModel from '@/models/Build.model'
import { cpu, gpu, gpus, namedPart, ram } from './scoreFixtures'

describe('BuildModel.runBenchmark', () => {
  it.each([
    [1, 1, 1933],
    [2, 1, 3503],
    [1, 2, 1945],
    [1, 4, 1945],
  ])('pins %i GPU(s) and %i memory module(s) to %i', (gpuCount, memoryCount, score) => {
    const build = new BuildModel({
      parts: [cpu(), ...Array.from({ length: gpuCount }, gpu), ...Array.from({ length: memoryCount }, ram)],
    })
    build.estimatedScore = -1
    expect(build.runBenchmark()).toBe(score)
    expect(build.estimatedScore).toBe(score)
  })

  it.each([[1, 1269], [2, 0]])('pins %i GPU(s) without a dual score to %i', (count, score) => {
    const build = new BuildModel({
      parts: [cpu(), ram(), ...Array.from({ length: count }, () =>
        namedPart(gpus, 'Shean GeForce GTX 750 Ti GAMER'))],
    })
    expect(build.runBenchmark()).toBe(score)
    expect(build.estimatedScore).toBe(score)
  })

  it.each(['CPU', 'GPU', 'Memory'])('returns zero when %s is absent', type => {
    const build = new BuildModel({ parts: [cpu(), gpu(), ram()].filter(part => part.type !== type) })
    expect(build.runBenchmark()).toBe(0)
    expect(build.estimatedScore).toBe(0)
  })
})
