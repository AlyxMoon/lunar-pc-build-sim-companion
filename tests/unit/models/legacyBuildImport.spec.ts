import { describe, expect, it } from 'vitest'
import { createStore } from 'vuex'
import BuildModel from '@/models/Build.model'
import { importPlayerData } from '@/store/actions'
import { SET_ALL_BUILDS } from '@/store/mutations'

describe('Legacy build import', () => {
  it.each([false, true])('imports startingParts with newParts present: %s', includeNewParts => {
    const startingPart = { type: 'Storage', name: 'Existing drive', price: 50 }
    const newPart = { type: 'Storage', name: 'New drive', price: 100 }
    const exported = JSON.stringify({
      builds: [{
        _attributes: {
          id: 'legacy-build',
          name: 'Saved build',
          startingParts: [startingPart],
          ...(includeNewParts ? { newParts: [newPart] } : {}),
        },
      }],
    })
    const store = createStore({
      state: { builds: [] as BuildModel[] },
      actions: { importPlayerData },
      mutations: { SET_ALL_BUILDS },
    })

    store.dispatch('importPlayerData', JSON.parse(exported))

    expect(store.state.builds).toHaveLength(1)
    const build = store.state.builds[0]
    expect(build).toBeInstanceOf(BuildModel)
    expect(build.id).toBe('legacy-build')
    expect(build.name).toBe('Saved build')
    expect(build.parts).toEqual([
      { ...startingPart, isNewPart: false, isBeingKept: false },
      ...(includeNewParts ? [{ ...newPart, isNewPart: true, isBeingKept: true }] : []),
    ])
    expect(build.attributes).not.toHaveProperty('startingParts')
    expect(build.attributes).not.toHaveProperty('newParts')
  })
})
