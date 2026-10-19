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
    expect(html.indexOf('class="expand"')).toBeLessThan(html.indexOf('id="navbar-links"'))
  })
})

describe('DataTable sortable headers', () => {
  it.each(['price', 'name'])('sorts mixed rows by %s in the announced direction through the click cycle', async column => {
    const items = [
      { name: 'Bravo', price: 60 },
      { name: 'Alpha', price: 1300 },
      { name: 'Charlie', price: 40 },
      { name: 'Delta', price: 60 },
    ]
    const descending = column === 'price'
      ? ['Alpha', 'Bravo', 'Delta', 'Charlie']
      : ['Delta', 'Charlie', 'Bravo', 'Alpha']
    const ascending = column === 'price'
      ? ['Charlie', 'Bravo', 'Delta', 'Alpha']
      : ['Alpha', 'Bravo', 'Charlie', 'Delta']
    const original = items.map(item => item.name)

    for (const [clicks, direction, expected] of [
      [0, 'none', original],
      [1, 'descending', descending],
      [2, 'ascending', ascending],
      [3, 'none', original],
    ] as const) {
      const app = createSSRApp({
        render: () => h(DataTable, {
          headers: [{ name: 'name' }, { name: 'price' }],
          items,
        }),
      })
      app.mixin({
        created () {
          if (this.$options.name !== 'DataTable') return
          const table = this as InstanceType<typeof DataTable>
          for (let click = 0; click < clicks; click++) table.toggleSort(column)
        },
      })
      const html = await renderToString(app
        .use(createStore({ state: { allowModdedPartsHEM: true, playerLevel: 99 } }))
        .component('FontAwesomeIcon', { render: () => h('svg') }))
      const headers = [...html.matchAll(/<th\b[^>]*aria-sort="([^"]+)"[^>]*>([\s\S]*?)<\/th>/g)]
      const activeHeader = headers[column === 'name' ? 0 : 1]
      expect(activeHeader[1]).toBe(direction)
      expect(headers[column === 'name' ? 1 : 0][1]).toBe('none')
      expect(activeHeader[2].includes('<svg')).toBe(direction !== 'none')
      expect(activeHeader[2].includes('class="ascending"')).toBe(direction === 'ascending')
      const body = html.match(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/)![1]
        .replace(/<!--[\s\S]*?-->/g, '')
      const names = [...body.matchAll(/<tr\b[^>]*>\s*<td\b[^>]*>([^<]*)<\/td>/g)]
        .map(match => match[1].trim())
      expect(names).toEqual(expected)
      expect(items.map(item => item.name)).toEqual(original)
    }
  })

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
