import { describe, expect, it } from 'vitest'
import generateBuild from '@/lib/calculations/generateBuildMeetsProgramRequirements'
import { motherboardFitsCpu } from '@/lib/buildValidationRules'
import ProgramRequirements from '@/models/ProgramRequirements.model'
import { Parts } from '@/typings'

const program = new ProgramRequirements({
  name: 'Test', type: 'min', cpuScore: 100, gpuScore: 100,
  gpuVram: 4, memory: 8, storage: 100,
})

const fixtures = (): Parts.ByAllCategoriesInterface => ({
  cpus: [{ type: 'CPU', socket: 'AM4', score: 100, wattage: 50 }],
  gpus: [{ type: 'GPU', scoreSingle: 100, vramGb: 4, wattage: 50, length: 100 }],
  memory: [{ type: 'Memory', sizeGb: 8 }],
  storage: [{ type: 'Storage', sizeGb: 100 }],
  motherboards: [{ type: 'Motherboard', socket: 'AM4', sizeType: 'ATX' }],
  cpucoolers: [{ type: 'CPU Cooler', supportedCpus: ['AM4'], length: 100 }],
  powersupplies: [{ type: 'Power Supply', wattage: 100, sizeType: 'ATX', length: 100 }],
  cases: [{
    type: 'Case', supportedMotherboards: ['ATX'], supportedPowersupplies: ['ATX'],
    maxLengthPsu: 100, maxLengthGpu: 100, maxLengthCpuFan: 100,
  }],
  casefans: [],
} as unknown as Parts.ByAllCategoriesInterface)

const availableParts = () => {
  const parts = fixtures()
  Object.values(parts).forEach(category => category.forEach((part: Parts.BaseInterface) => {
    part.level = 1
    part.price = 100
  }))
  return parts
}

const categories = [
  'cpus', 'gpus', 'memory', 'storage', 'motherboards', 'cpucoolers', 'powersupplies', 'cases',
] as const

describe('generateBuildMeetsProgramRequirements', () => {
  it.each(['AM4', 'LGA 1151 (Skylake)', 'LGA 1151 (Kaby Lake)'])(
    'selects a compatible motherboard for %s', socket => {
      const parts = availableParts()
      parts.cpus[0].socket = socket
      parts.cpucoolers[0].supportedCpus = [socket]
      parts.motherboards[0].socket = socket === 'AM4' ? socket : 'LGA 1151 (Kaby Lake)'
      parts.motherboards.unshift({ ...parts.motherboards[0], socket: 'TR4', price: 1 })
      const result = generateBuild(program, parts, { playerLevel: 1 })
      if ('error' in result) throw new Error(result.error)
      expect(motherboardFitsCpu(result)).toBe(true)
      expect(result.parts.find(part => part.type === 'Motherboard')?.socket).toBe(parts.motherboards[1].socket)
    },
  )

  it.each(categories)('rejects the first %s part when above the player level', category => {
    const parts = availableParts()
    parts[category].unshift({ ...parts[category][0], level: 2, price: 1 } as never)
    const result = generateBuild(program, parts, { playerLevel: 1 })
    if ('error' in result) throw new Error(result.error)
    expect(result.parts.every(part => part.level <= 1)).toBe(true)
  })

  it.each(['cpus', 'gpus'] as const)('rejects the first %s part with an insufficient score', category => {
    const parts = availableParts()
    parts[category].unshift({ ...parts[category][0], score: 0, scoreSingle: 0, price: 1 } as never)
    const result = generateBuild(program, parts, { playerLevel: 1 })
    if ('error' in result) throw new Error(result.error)
    expect(result.parts.find(part => part.type === parts[category][0].type)?.price).toBe(100)
  })

  it.each(categories)('reports the category when no %s part qualifies', category => {
    const parts = availableParts()
    parts[category][0].level = 2
    expect(generateBuild(program, parts, { playerLevel: 1 })).toEqual({
      error: `No matching part for category: ${parts[category][0].type}.`,
    })
  })

  it.each(categories)('reports an empty %s category', category => {
    const parts = availableParts()
    const type = parts[category][0].type
    parts[category] = []
    expect(generateBuild(program, parts, { playerLevel: 1 })).toEqual({
      error: `No matching part for category: ${type}.`,
    })
  })
})
