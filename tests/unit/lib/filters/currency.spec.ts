import { describe, expect, it } from 'vitest'
import currency from '@/lib/filters/currency'

describe('Currency filter', () => {
  it.each([
    [0, '$0'], [12, '$12'], [123, '$123'], [1234, '$1,234'],
    [1234567, '$1,234,567'], [1234.56, '$1,234.56'], ['1234.50', '$1,234.50'],
    [-1234, '-$1,234'], [-123, '-$123'], [-1234567.89, '-$1,234,567.89'],
    ['-0.50', '-$0.50'], ['001234.50', '$1,234.50'],
  ])('formats %s as %s', (value, expected) => {
    expect(currency(value)).toBe(expected)
  })

  it.each([null, undefined, false, true, '', {}, []])('passes unsupported input %s through', value => {
    expect(currency(value)).toBe(value)
  })
})
