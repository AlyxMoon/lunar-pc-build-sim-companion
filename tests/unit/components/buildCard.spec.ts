import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createStore } from 'vuex'
import BuildCard from '@/components/BuildCard/index.vue'
import BuildModel from '@/models/Build.model'
import filtersMixin from '@/lib/filters'
import { updateBuild } from '@/store/actions'
import { UPDATE_BUILD } from '@/store/mutations'

describe('BuildCard saved build isolation', () => {
  it('keeps edits private until saved and isolates subsequent edits from the saved copy', async () => {
    const store = createStore({
      state: { builds: [new BuildModel({ id: 'saved', name: 'Original', objectives: ['Original'], parts: [{ type: 'Storage', isBeingKept: false }] })] },
      actions: { updateBuild },
      mutations: { UPDATE_BUILD },
    })
    let card!: InstanceType<typeof BuildCard>
    const app = createSSRApp({
      render: () => h(BuildCard, {
        build: store.state.builds[0],
        onUpdate: data => { void store.dispatch('updateBuild', { data, index: 0 }) },
      }),
    })
    app.mixin({
      created () {
        if (this.$options.name === 'BuildCard') card = this as InstanceType<typeof BuildCard>
      },
    })
    app.mixin(filtersMixin).use(store).component('FontAwesomeIcon', {})
    await renderToString(app)
    card.toggleEdit()
    card.activeBuild.name = 'Edited'
    card.activeBuild.objectives.push('Edited')
    card.activeBuild.parts[0].isBeingKept = true
    expect(store.state.builds[0].name).toBe('Original')
    expect(store.state.builds[0].objectives).toEqual(['Original'])
    expect(store.state.builds[0].parts[0].isBeingKept).toBe(false)
    card.toggleEdit()
    expect(store.state.builds[0].id).toBe('saved')
    expect(store.state.builds[0].name).toBe('Edited')
    expect(store.state.builds[0].objectives).toEqual(['Original', 'Edited'])
    expect(store.state.builds[0].parts[0].isBeingKept).toBe(true)
    card.activeBuild.objectives.push('Unsaved')
    card.activeBuild.parts[0].isBeingKept = false
    expect(store.state.builds[0].objectives).toEqual(['Original', 'Edited'])
    expect(store.state.builds[0].parts[0].isBeingKept).toBe(true)
  })
})
