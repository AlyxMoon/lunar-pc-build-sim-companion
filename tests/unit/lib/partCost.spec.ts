import { describe, expect, it } from 'vitest'
import partCost from '@/lib/partCost'

describe('partCost', () => {
  it.each([
    { status: 'new', isNewPart: true, isNewUsedPart: false, isPartOfCase: false, isBeingKept: true, expected: 100 },
    { status: 'new used', isNewPart: true, isNewUsedPart: true, isPartOfCase: false, isBeingKept: true, expected: 41 },
    { status: 'included with case', isNewPart: true, isNewUsedPart: false, isPartOfCase: true, isBeingKept: true, expected: 0 },
    { status: 'old keeping', isNewPart: false, isNewUsedPart: false, isPartOfCase: false, isBeingKept: true, expected: 0 },
    { status: 'old replacing', isNewPart: false, isNewUsedPart: false, isPartOfCase: false, isBeingKept: false, expected: 0 },
    { status: 'old with used flag', isNewPart: false, isNewUsedPart: true, isPartOfCase: false, isBeingKept: true, expected: 0 },
    { status: 'included with case with used flag', isNewPart: true, isNewUsedPart: true, isPartOfCase: true, isBeingKept: true, expected: 0 },
    { status: 'new without kept flag', isNewPart: true, isNewUsedPart: false, isPartOfCase: false, isBeingKept: false, expected: 100 },
  ])('charges $expected for $status', ({ expected, ...flags }) => {
    expect(partCost({ ...flags, price: 100 })).toBe(expected)
  })

  it.each([[0, 0], [1, 0], [36, 15], [72, 30], [101, 42]])('floors used price %i to %i', (price, expected) => {
    expect(partCost({ price, isNewPart: true, isNewUsedPart: true, isPartOfCase: false })).toBe(expected)
  })
})
