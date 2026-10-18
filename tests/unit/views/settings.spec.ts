import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import type { Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import Settings from '@/views/Settings.vue'
import Navbar from '@/components/layout/Navbar.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'

let saved: Map<string, string>

beforeEach(() => {
  saved = new Map()
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => { saved.set(key, value) },
      removeItem: (key: string) => { saved.delete(key) },
    },
  })
})

afterEach(() => vi.unstubAllGlobals())

async function loadStore () {
  vi.resetModules()
  return (await import('@/store')).default
}

async function render (component: Component, store: Awaited<ReturnType<typeof loadStore>>) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: ['Home', 'Settings', 'PrivacyPolicy', 'ActiveBuilds', 'PartsList', 'WillItRun']
      .map(name => ({ path: name === 'Home' ? '/' : `/${name}`, name, component: {} })),
  })
  await router.push('/')
  return renderToString(createSSRApp(component).use(store).use(router).component('FontAwesomeIcon', {}))
}

describe('Settings and persistence', () => {
  it('starts analytics off for new and existing visitors without a saved choice', async () => {
    let store = await loadStore()
    expect(store.state.analyticsEnabled).toBe(false)
    saved.set('vuex', JSON.stringify({ playerLevel: 22, colorMode: 'dark', allowModdedPartsHEM: true }))
    store = await loadStore()
    expect(store.state.analyticsEnabled).toBe(false)
    const html = await render(Settings, store)
    expect(html).toMatch(/id="player-level"[^>]*value="22"/)
    expect(html).toMatch(/id="allow-modded-parts-hem"[^>]*checked/)
    expect(html).toMatch(/value="dark" selected/)
    expect(html).toMatch(/id="analytics-enabled"[^>]*role="switch"/)
    expect(html).not.toMatch(/id="analytics-enabled"[^>]*checked/)
  })

  it('saves all four options across reload and saves revocation before tracker subscribers run', async () => {
    let store = await loadStore()
    store.commit('UPDATE_PLAYER_LEVEL', 25)
    store.commit('UPDATE_COLOR_MODE', 'dark')
    store.commit('UPDATE_ALLOW_MODDED_PARTS_HEM', true)
    store.commit('UPDATE_ANALYTICS_ENABLED', true)
    store = await loadStore()
    expect(store.state).toMatchObject({
      playerLevel: 25, colorMode: 'dark', allowModdedPartsHEM: true, analyticsEnabled: true,
    })
    const html = await render(Settings, store)
    expect(html).toMatch(/id="analytics-enabled"[^>]*checked/)
    let persistedAtNotification: unknown
    store.subscribe(() => { persistedAtNotification = JSON.parse(saved.get('vuex')!).analyticsEnabled })
    store.commit('UPDATE_ANALYTICS_ENABLED', false)
    expect(persistedAtNotification).toBe(false)
    store = await loadStore()
    expect(store.state.analyticsEnabled).toBe(false)
  })

  it('links Settings from the navbar and explains consent and no ads in the policy', async () => {
    const store = await loadStore()
    expect(await render(Navbar, store)).toContain('href="/Settings"')
    const policy = await render(PrivacyPolicy, store)
    expect(policy).toContain('href="/Settings"')
    expect(policy).toContain('Analytics is off by default')
    expect(policy).toContain('from Google (googletagmanager.com)')
    expect(policy).not.toMatch(/metrics\.allisterbytes\.com/)
    expect(await render(Settings, store)).not.toMatch(/metrics\.allisterbytes\.com/)
    expect(policy).toContain('This site shows no ads.')
  })
})
