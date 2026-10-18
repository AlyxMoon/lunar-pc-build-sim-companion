import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createStore } from 'vuex'
import PageTracker from '@/plugins/Gtag/pageTracker'

const paths = ['/', '/settings', '/parts', '/privacy-policy']
let scripts: HTMLScriptElement[]
let reload: ReturnType<typeof vi.fn>

beforeEach(() => {
  scripts = []
  reload = vi.fn()
  vi.stubGlobal('window', {
    location: { href: 'https://example.test/settings', reload },
  })
  vi.stubGlobal('document', {
    title: '',
    createElement: () => ({}),
    head: { appendChild: (script: HTMLScriptElement) => scripts.push(script) },
  })
})

afterEach(() => vi.unstubAllGlobals())

async function setup (
  consent: unknown = false,
  initialPath = '/settings',
  enabled = true,
  containerId = 'GTM-TEST',
) {
  const store = createStore({
    state: { analyticsEnabled: consent, playerLevel: 1 },
    mutations: {
      consent: (state, value: boolean) => { state.analyticsEnabled = value },
      level: (state, value: number) => { state.playerLevel = value },
    },
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: paths.map(path => ({
      path,
      name: path === '/' ? 'Home' : path.slice(1),
      meta: { title: path === '/' ? 'Home' : path.slice(1) },
      component: {},
    })),
  })
  createApp({}).use(store).use(router).use(new PageTracker(), {
    store, enabled, containerId, titlePrefix: 'Companion | ',
  })
  await router.push(initialPath)
  await router.isReady()
  return { router, store }
}

function pageViews () {
  return window.dataLayer?.filter(item => item.event === 'page_view') || []
}

describe('Consent-controlled tag manager', () => {
  it.each(paths)('makes no script request on a first visit to %s or later navigation', async path => {
    const { router } = await setup(false, path)
    await router.push('/parts?sort=price')
    expect(scripts).toHaveLength(0)
    expect(window.dataLayer).toBeUndefined()
    expect(document.title).toBe('Companion | parts')
  })

  it.each([undefined, null, 'true', 1])('requires an explicit boolean opt-in, received %s', async consent => {
    await setup(consent)
    expect(scripts).toHaveLength(0)
    expect(window.dataLayer).toBeUndefined()
  })

  it('loads once after opt-in and sends the current page and each successful route', async () => {
    const { store, router } = await setup()
    store.commit('consent', true)
    expect(scripts).toHaveLength(1)
    expect(scripts[0]).toMatchObject({
      async: true,
      src: 'https://www.googletagmanager.com/gtm.js?id=GTM-TEST',
    })
    expect(window.dataLayer?.[0]).toMatchObject({ event: 'gtm.js', 'gtm.start': expect.any(Number) })
    expect(pageViews()).toEqual([{
      event: 'page_view',
      page_path: '/settings',
      page_location: 'https://example.test/settings',
      page_title: 'Companion | settings',
    }])

    window.location.href = 'https://example.test/parts?sort=price#table'
    await router.push('/parts?sort=price#table')
    await router.push('/privacy-policy')
    store.commit('level', 20)
    expect(scripts).toHaveLength(1)
    expect(pageViews().map(view => view.page_path)).toEqual([
      '/settings', '/parts?sort=price#table', '/privacy-policy',
    ])
    expect(pageViews()[1]).toMatchObject({
      page_location: 'https://example.test/parts?sort=price#table',
      page_title: 'Companion | parts',
    })
  })

  it('tracks one initial page with saved opt-in and ignores failed or duplicate navigation', async () => {
    const { router } = await setup(true)
    await router.push('/settings')
    router.beforeEach(to => to.path !== '/parts')
    await router.push('/parts')
    expect(scripts).toHaveLength(1)
    expect(pageViews()).toHaveLength(1)
    expect(document.title).toBe('Companion | settings')
  })

  it('reloads on revocation and sends no more page views while the reload is pending', async () => {
    const { store, router } = await setup(true)
    store.commit('consent', false)
    expect(reload).toHaveBeenCalledOnce()
    await router.push('/parts')
    store.commit('level', 10)
    store.commit('consent', true)
    await router.push('/privacy-policy')
    expect(reload).toHaveBeenCalledOnce()
    expect(pageViews()).toHaveLength(1)
    expect(scripts).toHaveLength(1)
  })

  it.each<[boolean, string]>([[false, 'GTM-TEST'], [true, '']])('honors deployment availability (%s, %s)', async (enabled, code) => {
    const { store, router } = await setup(true, '/', enabled, code)
    store.commit('consent', false)
    store.commit('consent', true)
    await router.push('/parts')
    expect(scripts).toHaveLength(0)
    expect(window.dataLayer).toBeUndefined()
    expect(reload).not.toHaveBeenCalled()
  })
})
