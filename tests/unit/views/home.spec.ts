import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createStore } from 'vuex'
import Home from '@/views/Home.vue'
import BuildModel from '@/models/Build.model'
import * as actions from '@/store/actions'
import * as mutations from '@/store/mutations'

afterEach(() => vi.unstubAllGlobals())

describe('Home newcomer content and backups', () => {
  it('offers all three first steps before the data tools and rules', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: ['/', '/builds', '/will-it-run', '/parts'].map(path => ({ path, component: {} })),
    })
    await router.push('/')
    const html = await renderToString(createSSRApp(Home).use(router))
    expect(html).toContain('Plan your PC Building Simulator builds')
    for (const path of ['/builds', '/will-it-run', '/parts']) {
      expect(html).toContain(`href="${path}"`)
      expect(html.indexOf(`href="${path}"`)).toBeLessThan(html.indexOf('Data and Build Rules'))
    }
    expect(html.indexOf('Data and Build Rules')).toBeLessThan(html.indexOf('Export Data'))
    expect(html.indexOf('Data and Build Rules')).toBeLessThan(html.indexOf('id="import-data"'))
    expect(html.indexOf('Data and Build Rules')).toBeLessThan(html.indexOf('Build Validation Rules'))
  })

  it('round-trips the exported file through the Home data section', async () => {
    const build = new BuildModel({ id: 'saved', name: 'Saved build', budget: 1500 })
    const state = { builds: [build], playerLevel: 24, colorMode: 'dark', allowModdedPartsHEM: true, analyticsEnabled: false }
    const store = createStore({ state, actions, mutations })
    const expected = JSON.parse(JSON.stringify({ builds: state.builds, playerLevel: state.playerLevel }))
    const anchor = { setAttribute: vi.fn(), click: vi.fn(), remove: vi.fn() }
    vi.stubGlobal('document', { createElement: () => anchor, body: { appendChild: vi.fn() } })
    vi.stubGlobal('alert', vi.fn())
    const file = { text: '' }
    vi.stubGlobal('FileReader', class {
      onload: any
      onloadend: any
      readAsText (input: typeof file) {
        this.onload({ target: { result: input.text } })
        this.onloadend()
      }
    })
    const context = {
      $store: store,
      $refs: { importData: { files: [file], value: 'export.json' } },
      handlingImport: false,
      importPlayerData: (data: unknown) => store.dispatch('importPlayerData', data),
    } as unknown as InstanceType<typeof Home>
    await Home.methods!.exportPlayerData.call(context)
    file.text = decodeURIComponent(anchor.setAttribute.mock.calls.find(([key]) => key === 'href')![1].split(',')[1])
    expect(JSON.parse(file.text)).toEqual(expected)
    store.commit('SET_ALL_BUILDS', [])
    store.commit('UPDATE_PLAYER_LEVEL', 1)
    store.commit('UPDATE_COLOR_MODE', 'light')
    store.commit('UPDATE_ALLOW_MODDED_PARTS_HEM', false)
    store.commit('UPDATE_ANALYTICS_ENABLED', true)
    Home.methods!.handleFileInput.call(context)
    expect(JSON.parse(JSON.stringify(store.state))).toEqual({
      ...expected, colorMode: 'light', allowModdedPartsHEM: false, analyticsEnabled: true,
    })
    expect(store.state.builds[0]).toBeInstanceOf(BuildModel)
    expect(context.handlingImport).toBe(false)
    expect(context.$refs.importData).toMatchObject({ value: '' })
    expect(alert).toHaveBeenCalledWith('Import successful!')
  })

  it('ignores tracking and appearance settings in an imported file', async () => {
    const store = createStore({
      state: { builds: [], playerLevel: 1, colorMode: 'light', allowModdedPartsHEM: false, analyticsEnabled: false },
      actions,
      mutations,
    })
    await store.dispatch('importPlayerData', {
      builds: [], playerLevel: 24, colorMode: 'invalid', allowModdedPartsHEM: true, analyticsEnabled: true,
    })
    expect(store.state).toEqual({
      builds: [], playerLevel: 24, colorMode: 'light', allowModdedPartsHEM: false, analyticsEnabled: false,
    })
  })
})
