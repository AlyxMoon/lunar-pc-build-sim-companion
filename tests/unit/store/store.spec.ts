import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import BuildModel from '@/models/Build.model'
import * as actions from '@/store/actions'
import * as mutations from '@/store/mutations'
import { modifiedCategoryHeaders } from '@/store/getters'

beforeEach(() => vi.resetModules())
afterEach(() => vi.unstubAllGlobals())

const makeBuild = (id: string) => new BuildModel({
  id, name: `Build ${id}`, budget: 1500, objectives: ['Upgrade storage'],
  parts: [{ type: 'Storage', name: 'SSD', price: 100, isBeingKept: true }],
})

describe('Player data actions', () => {
  it('exports builds and player level and imports them as working models', async () => {
    const store = createStore({ state: { builds: [makeBuild('one'), makeBuild('two')], playerLevel: 24 }, actions, mutations })
    const attributes = store.state.builds.map(build => JSON.parse(JSON.stringify(build.attributes)))
    const anchor = { setAttribute: vi.fn(), click: vi.fn(), remove: vi.fn() }
    const appendChild = vi.fn()
    vi.stubGlobal('document', { createElement: vi.fn(() => anchor), body: { appendChild } })
    await store.dispatch('exportPlayerData')
    const href = anchor.setAttribute.mock.calls.find(([name]) => name === 'href')![1] as string
    const exported = JSON.parse(decodeURIComponent(href.split(',')[1]))
    expect(Object.keys(exported).sort()).toEqual(['builds', 'playerLevel'])
    expect(anchor.setAttribute).toHaveBeenCalledWith('download', 'export.json')
    expect(appendChild).toHaveBeenCalledWith(anchor)
    expect(anchor.click).toHaveBeenCalledOnce()
    expect(anchor.remove).toHaveBeenCalledOnce()
    store.commit('SET_ALL_BUILDS', [])
    store.commit('UPDATE_PLAYER_LEVEL', 1)
    await store.dispatch('importPlayerData', exported)
    expect(store.state.playerLevel).toBe(24)
    expect(store.state.builds.map(build => build.attributes)).toEqual(attributes)
    for (const build of store.state.builds) {
      expect(build).toBeInstanceOf(BuildModel)
      expect(build.findPartOfType('Storage')).toHaveLength(1)
    }
  })

  it('leaves omitted fields alone and accepts an empty build list', async () => {
    const store = createStore({ state: { builds: [makeBuild('one')], playerLevel: 24 }, actions, mutations })
    await store.dispatch('importPlayerData', {})
    expect(store.state.builds).toHaveLength(1)
    expect(store.state.playerLevel).toBe(24)
    await store.dispatch('importPlayerData', { builds: [] })
    expect(store.state.builds).toEqual([])
    expect(store.state.playerLevel).toBe(24)
    await store.dispatch('importPlayerData', { playerLevel: 0 })
    expect(store.state.playerLevel).toBe(0)
  })
})

describe('Build mutations', () => {
  it('creates, replaces, removes and sets builds while preserving order', () => {
    const one = makeBuild('one')
    const two = makeBuild('two')
    const three = makeBuild('three')
    const state = { builds: [one] }
    mutations.CREATE_BUILD(state, two)
    expect(state.builds).toEqual([one, two])
    mutations.UPDATE_BUILD(state, { index: 0, data: three })
    expect(state.builds).toEqual([three, two])
    mutations.REMOVE_BUILD(state, 0)
    expect(state.builds).toEqual([two])
    mutations.SET_ALL_BUILDS(state, [one, three])
    expect(state.builds).toEqual([one, three])
    mutations.SET_ALL_BUILDS(state, [])
    expect(state.builds).toEqual([])
  })
})

describe('Category headers', () => {
  it('adds the HEM header only when enabled without mutating category headers', () => {
    const categories = [{ headers: [{ name: 'name', displayName: 'Name' }] }, { headers: [] }]
    const original = JSON.parse(JSON.stringify(categories))
    const state = { categories, allowModdedPartsHEM: false }
    expect(modifiedCategoryHeaders(state)).toEqual(categories.map(category => category.headers))
    state.allowModdedPartsHEM = true
    const expected = categories.map(category => [...category.headers, { name: 'moddedPartHEM', displayName: 'HEM Part' }])
    expect(modifiedCategoryHeaders(state)).toEqual(expected)
    expect(modifiedCategoryHeaders(state)).toEqual(expected)
    expect(categories).toEqual(original)
  })
})

describe('Persisted build rehydration', () => {
  it.each([true, false])('restores model methods with saved builds present: %s', async hasBuilds => {
    const attributes = [makeBuild('one').attributes, makeBuild('two').attributes]
    const saved = new Map([['vuex', JSON.stringify({ playerLevel: 17, ...(hasBuilds ? { builds: attributes.map(_attributes => ({ _attributes })) } : {}) })]])
    vi.stubGlobal('window', { localStorage: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => { saved.set(key, value) },
      removeItem: (key: string) => { saved.delete(key) },
    } })
    const store = (await import('@/store')).default
    const Model = (await import('@/models/Build.model')).default
    expect(store.state.playerLevel).toBe(17)
    expect(store.state.builds).toHaveLength(hasBuilds ? 2 : 0)
    store.state.builds.forEach((build: BuildModel, index: number) => {
      expect(build).toBeInstanceOf(Model)
      expect(build.attributes).toEqual(attributes[index])
      expect(build.findPartOfType('Storage')).toHaveLength(1)
    })
  })
})
