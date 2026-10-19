import { describe, expect, it } from 'vitest'
import { mutateField, mutatePart } from '../../../scripts/convertRawData/mutate'

describe('Part conversion rules', () => {
  it('collects supported cooler sockets, removes flags and splits the cooler type', () => {
    const sockets = ['LGA 2011-V3', 'AM4', 'LGA 1151 (Skylake)', 'LGA 1151 (Kaby Lake)', 'LGA 1200', 'LGA 2066', 'TR4', 'sTRX4', 'FM2+']
    const flags = Object.fromEntries(sockets.map((socket, i) => mutateField(i % 2 ? 'N' : 'Y', socket, 'cpucoolers')!))
    const input = { type: 'CPU Cooler - Air', ...flags }
    const result = mutatePart.cpucoolers(input)
    expect(result).toEqual({ type: 'CPU Cooler', typeSecondary: 'Air', supportedCpus: sockets.filter((_, i) => i % 2 === 0) })
    expect(input).toEqual({ type: 'CPU Cooler - Air', ...flags })
    expect(mutatePart.cpucoolers({ type: 'CPU Cooler - Water' })).toMatchObject({ supportedCpus: [], typeSecondary: 'Water' })
  })

  it.each([['GPU', false], ['GPU - Air', false], ['GPU - Water', true]])('converts %s GPU cooling and type', (type, waterCooled) => {
    const input = { type }
    expect(mutatePart.gpus(input)).toMatchObject({ type: 'GPU', waterCooled })
    expect(input.type).toBe(type)
  })

  it.each(['HDD', 'SSD', 'M.2'])('splits the storage subtype %s', subtype => {
    const input = { type: `Storage - ${subtype}` }
    expect(mutatePart.storage(input)).toEqual({ type: 'Storage', typeSecondary: subtype })
    expect(input.type).toBe(`Storage - ${subtype}`)
  })

  it('converts RAM speed options into numbers in their original order', () => {
    expect(mutateField('2133,2400,2666,3200', 'RAM Speed Steps', 'motherboards'))
      .toEqual(['ramSpeedOptions', [2133, 2400, 2666, 3200]])
  })

  it.each([['25', 25], ['', 0], [undefined, 0], ['N/A', 0]])('defaults cooler thickness %s to a finite number', (value, expected) => {
    expect(mutateField(value, 'Thickness', 'cpucoolers')).toEqual(['thickness', expected])
  })
})
