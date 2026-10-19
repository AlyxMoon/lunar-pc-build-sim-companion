import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createStore } from 'vuex'
import Navbar from '@/components/layout/Navbar.vue'
import DataTable from '@/components/DataTable/index.vue'

describe('Navbar menu button', () => {
  it('is a named button that reports its closed state and controls the links', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: ['ActiveBuilds', 'PartsList', 'WillItRun', 'Settings']
        .map(name => ({ path: `/${name}`, name, component: {} })),
    })
    await router.push('/ActiveBuilds')
    const html = await renderToString(createSSRApp(Navbar).use(router).component('FontAwesomeIcon', {}))
    expect(html).toMatch(/<button[^>]*class="expand"/)
    expect(html).toMatch(/<button[^>]*aria-label="Menu"/)
    expect(html).toMatch(/<button[^>]*aria-expanded="false"/)
    expect(html).toMatch(/<button[^>]*aria-controls="navbar-links"/)
    expect(html).toContain('id="navbar-links"')
    expect(html).not.toMatch(/<div[^>]*class="expand"/)
  })
})

describe('DataTable sortable headers', () => {
  it('renders each sortable header as a button with its sort state', async () => {
    const store = createStore({ state: { allowModdedPartsHEM: true, playerLevel: 99 } })
    const app = createSSRApp({
      render: () => h(DataTable, {
        headers: [{ name: 'Cost' }, { name: 'GPU', displayName: 'Graphics' }],
        items: [],
      }),
    })
    const html = await renderToString(app.use(store).component('FontAwesomeIcon', {}))
    expect(html.match(/<th[^>]*aria-sort="none"/g)).toHaveLength(2)
    expect(html.match(/<button type="button" class="sort-button"/g)).toHaveLength(2)
    expect(html).toContain('Graphics')
  })
})
