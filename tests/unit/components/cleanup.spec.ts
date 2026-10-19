import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createStore } from 'vuex'
import DataTable from '@/components/DataTable/index.vue'
import Dialog from '@/components/DialogGenerate3dmark/index.vue'
import Home from '@/views/Home.vue'
import BuildModel from '@/models/Build.model'
import filtersMixin from '@/lib/filters'
import type { Parts } from '@/typings'

async function instance<T> (component: T, props = {}, state = {}) {
  let vm: any
  const app = createSSRApp({ render: () => h(component as any, props) })
  app.mixin({ created () { if (this.$options.name === (component as any).name) vm = this as InstanceType<typeof DataTable> } })
  app.mixin(filtersMixin).use(createStore({ state })).component('FontAwesomeIcon', {})
  await renderToString(app)
  return vm as T extends typeof DataTable ? InstanceType<typeof DataTable> : T extends typeof Dialog ? InstanceType<typeof Dialog> : InstanceType<typeof Home>
}

describe('cleanup regressions', () => {
  it.each([0, 10, 20, 21])('disables next on the last page for %i rows', async total => {
    const items = Array.from({ length: total }, (_, index) => ({ nameFull: String(index) }))
    const table = await instance(DataTable, { items }, { playerLevel: 1 })
    const lastPage = Math.max(0, Math.ceil(total / 10) - 1)
    for (let page = 0; page <= lastPage; page++) {
      table.pagination.page = page
      expect(table.onLastPage).toBe(page === lastPage)
    }
    expect(table.currentlyDisplayedItems).toHaveLength(total ? total - lastPage * 10 : 0)
    const html = await renderToString(createSSRApp({ render: () => h(DataTable, { items }) })
      .mixin({ created () { if (this.$options.name === 'DataTable') (this as InstanceType<typeof DataTable>).pagination.page = lastPage } })
      .use(createStore({ state: { playerLevel: 1 } })).component('FontAwesomeIcon', {}))
    expect(html).toMatch(/title="next page"[^>]*disabled/)
  })

  it('generates parts without a budget, including when budget consideration is selected', async () => {
    const parts = {
      cpus: [{ type: 'CPU', level: 1, price: 100, score: 1000, frequency: 1, maxMemChannels: 1, defaultMemSpeed: 1, multCoreClock: 1, multMemChannels: 0, multMemClock: 0, multAdjust: 1 }],
      gpus: [{ type: 'GPU', level: 1, price: 100, scoreSingle: 1000, scoreDual: 0 }],
      memory: [{ type: 'Memory', level: 1, price: 100, frequency: 1 }],
    } as unknown as Parts.ByCategoryInterface
    const dialog = await instance(Dialog, { build: new BuildModel() }, { parts, playerLevel: 1 })
    expect(dialog.buildGenerationInfo.useBudget).toBe(false)
    await dialog.beginCalculation()
    expect(dialog.errorMessage).not.toBe('')
    dialog.buildGenerationInfo.desiredScore = 100
    for (const useBudget of [false, true]) {
      dialog.buildGenerationInfo.useBudget = useBudget
      await dialog.beginCalculation()
      expect(dialog.generatedBuilds).toHaveLength(1)
      expect(dialog.generatedBuilds[0].parts).toHaveLength(3)
      expect(dialog.errorMessage).toBe('')
    }
    dialog.build.budget = 1
    await dialog.beginCalculation()
    expect(dialog.generatedBuilds).toHaveLength(0)
  })

  it('keeps import usable when no file is chosen', () => {
    const context = { $refs: { importData: { files: [] } }, handlingImport: false }
    expect(() => Home.methods!.handleFileInput.call(context as unknown as InstanceType<typeof Home>)).not.toThrow()
    expect(context.handlingImport).toBe(false)
  })
})
