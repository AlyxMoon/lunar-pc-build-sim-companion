import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRenderer, h, nextTick, ssrContextKey } from 'vue'
import { createStore } from 'vuex'
import App from '@/App.vue'

vi.mock('@/components/layout/Footer.vue', () => ({ default: { render: () => null } }))
vi.mock('@/components/layout/Navbar.vue', () => ({ default: { render: () => null } }))

afterEach(() => vi.unstubAllGlobals())

describe('app colour mode', () => {
  it.each([false, true])('follows system dark=%s live and respects explicit overrides', async initialDark => {
    const listeners = new Set<() => void>()
    const query = {
      matches: initialDark,
      addEventListener: vi.fn((_event: string, listener: () => void) => listeners.add(listener)),
      removeEventListener: vi.fn((_event: string, listener: () => void) => listeners.delete(listener)),
    }
    const matchMedia = vi.fn(() => query)
    vi.stubGlobal('window', { matchMedia })
    const main = { class: '' }
    const renderer = createRenderer<object, object>({
      createElement: tag => tag === 'main' ? main : {},
      createText: () => ({}), createComment: () => ({}),
      insert: () => {}, remove: () => {}, setText: () => {}, setElementText: () => {},
      parentNode: () => null, nextSibling: () => null,
      patchProp: (node, key, _previous, value) => {
        if (node === main && key === 'class') main.class = value
      },
    })
    const store = createStore({ state: { colorMode: 'system' } })
    const app = renderer.createApp({
      ...App,
      render (this: InstanceType<typeof App>) { return h('main', { class: this.mainClasses }) },
    }).provide(ssrContextKey, {}).use(store)
    app.mount({})
    expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    expect(main.class).toBe(initialDark ? 'mode-dark' : 'mode-light')
    const changeSystem = async (dark: boolean) => {
      query.matches = dark
      listeners.forEach(listener => listener())
      await nextTick()
    }
    await changeSystem(!initialDark)
    expect(main.class).toBe(initialDark ? 'mode-light' : 'mode-dark')
    for (const mode of ['light', 'dark']) {
      store.state.colorMode = mode
      await nextTick()
      await changeSystem(false)
      expect(main.class).toBe(`mode-${mode}`)
      await changeSystem(true)
      expect(main.class).toBe(`mode-${mode}`)
    }
    store.state.colorMode = 'system'
    await nextTick()
    expect(main.class).toBe('mode-dark')
    app.unmount()
    expect(query.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(listeners.size).toBe(0)
  })
})
