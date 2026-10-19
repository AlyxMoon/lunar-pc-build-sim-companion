import { describe, expect, it, vi } from 'vitest'
import BaseModel from '@/models/_BaseModel'
import BuildModel from '@/models/Build.model'

describe('BaseModel', () => {
  it('copies every nested object and array while preserving values', () => {
    const input = { parts: [{ details: { sockets: ['AM4', { name: 'AM5' }] } }], empty: null, missing: undefined }
    const copy = new BaseModel().deepCopy(input)
    expect(copy).toEqual(input)
    const checkReferences = (original: unknown, copied: unknown): void => {
      if (original === null || typeof original !== 'object') return
      expect(copied).not.toBe(original)
      for (const key of Object.keys(original)) {
        checkReferences(Reflect.get(original, key), Reflect.get(copied as object, key))
      }
    }
    checkReferences(input, copy)
  })

  it.each([{ result: false }, { result: 'Invalid build' }, { result: [false, 'Invalid build'] }])('reports a failed rule: %j', ({ result }) => {
    const model = new BaseModel()
    vi.spyOn(model, 'validations').mockReturnValue([() => result, () => true] as ReturnType<BaseModel['validations']>)
    expect(model.validate()).toBe(true)
    expect(model.hasErrors).toBe(true)
    expect(model.errors).toEqual(result === false ? [] : ['Invalid build'])
    vi.spyOn(model, 'validations').mockReturnValue([() => true])
    expect(model.validate()).toBe(false)
    expect(model.hasErrors).toBe(false)
    expect(model.errors).toEqual([])
  })

  it('reports no errors when every rule passes or there are no rules', () => {
    const model = new BaseModel()
    expect(model.validate()).toBe(false)
    vi.spyOn(model, 'validations').mockReturnValue([() => true, () => true])
    expect(model.validate()).toBe(false)
    expect(model.hasErrors).toBe(false)
  })

  it('constructs copies of builds without modifying or sharing their source attributes', () => {
    const source = { id: 'saved', startingParts: [{ type: 'Storage' }], objectives: ['Original'] }
    const build = new BuildModel(source)
    expect(source.startingParts).toEqual([{ type: 'Storage' }])
    const copy = new BuildModel(build)
    expect(copy.id).toBe(build.id)
    copy.parts[0].isBeingKept = true
    copy.objectives.push('Edited')
    expect(build.parts[0].isBeingKept).toBe(false)
    expect(build.objectives).toEqual(['Original'])
  })
})
