import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { beforeAll, describe, expect, it } from 'vitest'
import { caseFitsMotherboard } from '@/lib/buildValidationRules'
import BuildModel from '@/models/Build.model'
import type { Parts } from '@/typings'

describe('Converted case motherboard support', () => {
  let cases: Parts.CaseInterface[]
  let motherboards: Parts.MotherboardInterface[]
  const rows = readFileSync('scripts/convertRawData/data/cases.csv', 'utf8')
    .trim().split(/\r?\n/)
    .map(row => row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map(value => value.replace(/^"|"$/g, '').replace(/""/g, '"')))
  const headers = rows.shift()!
  const nameColumn = headers.indexOf('Full Part Name')
  const microAtxColumn = headers.indexOf('Micro-ATX')

  beforeAll(() => {
    execFileSync(process.execPath, ['scripts/convertRawData/convertRawData.ts'], {
      timeout: 30000,
    })
    cases = JSON.parse(readFileSync('src/assets/data/parts/cases.json', 'utf8'))
    motherboards = JSON.parse(readFileSync('src/assets/data/parts/motherboards.json', 'utf8'))
  }, 35000)

  it('preserves the Micro-ATX CSV flag for every case without introducing Micro-ITX', () => {
    expect(nameColumn).toBeGreaterThanOrEqual(0)
    expect(microAtxColumn).toBeGreaterThanOrEqual(0)
    expect(rows.some(row => row[microAtxColumn] === 'Y')).toBe(true)
    expect(cases).toHaveLength(rows.length)

    for (const row of rows) {
      const pcCase = cases.find(part => part.nameFull === row[nameColumn])
      expect(pcCase, row[nameColumn]).toBeDefined()
      expect(pcCase!.supportedMotherboards.includes('Micro-ATX'), row[nameColumn])
        .toBe(row[microAtxColumn] === 'Y')
      expect(pcCase!.supportedMotherboards).not.toContain('Micro-ITX')
    }
  })

  it('fits converted Micro-ATX motherboards in every case marked as supporting them', () => {
    const microAtxBoards = motherboards.filter(part => part.sizeType === 'Micro-ATX')
    const supportingRows = rows.filter(row => row[microAtxColumn] === 'Y')
    expect(microAtxBoards.length).toBeGreaterThan(0)
    expect(supportingRows.length).toBeGreaterThan(0)

    for (const row of supportingRows) {
      const pcCase = cases.find(part => part.nameFull === row[nameColumn])!
      expect(pcCase).toBeDefined()
      for (const motherboard of microAtxBoards) {
        const build = new BuildModel({
          parts: [
            { ...pcCase, isBeingKept: true },
            { ...motherboard, isBeingKept: true },
          ],
        })
        expect(caseFitsMotherboard(build), `${pcCase.nameFull}: ${motherboard.nameFull}`).toBe(true)
      }
    }
  })
})
