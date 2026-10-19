import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import type { SSRContext } from 'vue/server-renderer'
import { createStore } from 'vuex'
import Dialog from '@/components/DialogGenerate3dmark/index.vue'
import PartLookup from '@/components/DialogPartLookup.vue'
import BuildModel from '@/models/Build.model'
import filtersMixin from '@/lib/filters'

async function renderDialog (component: unknown, props: Record<string, unknown>) {
  const ctx = {} as SSRContext
  const app = createSSRApp({ render: () => h(component as never, props) })
  app.mixin(filtersMixin).use(createStore({ state: { parts: {}, playerLevel: 1, categories: [] } })).component('FontAwesomeIcon', {})
  await renderToString(app, ctx)
  return ctx.teleports?.body ?? ''
}

describe('dialog semantics', () => {
  it('marks the 3Dmark dialog as a labelled modal dialog that can take focus', async () => {
    const html = await renderDialog(Dialog, { build: new BuildModel() })
    expect(html).toMatch(/<div[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-label="Add Parts to Meet 3Dmark Score"[^>]*tabindex="-1"/)
    expect(html).not.toMatch(/<aside/)
  })

  it('marks the part lookup as a labelled modal dialog that can take focus', async () => {
    const html = await renderDialog(PartLookup, { partType: '' })
    expect(html).toMatch(/<div[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-label="Part Lookup"[^>]*tabindex="-1"/)
    expect(html).not.toMatch(/<aside/)
  })
})
