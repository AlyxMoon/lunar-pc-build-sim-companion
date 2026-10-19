import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createStore } from 'vuex'
import BuildPartsList from '@/components/BuildCard/BuildPartsList.vue'
import BuildCard from '@/components/BuildCard/index.vue'
import BuildModel from '@/models/Build.model'
import newPartsUnderBudget from '@/lib/buildValidationRules/newPartsUnderBudget'
import filtersMixin from '@/lib/filters'

const statuses = [
  { label: 'New', isNewPart: true, isNewUsedPart: false, isBeingKept: true, isPartOfCase: false },
  { label: 'New - Used Part', isNewPart: true, isNewUsedPart: true, isBeingKept: true, isPartOfCase: false },
  { label: 'New - Comes With Case', isNewPart: true, isNewUsedPart: false, isBeingKept: true, isPartOfCase: true },
  { label: 'Old - Keeping', isNewPart: false, isNewUsedPart: false, isBeingKept: true, isPartOfCase: false },
  { label: 'Old - Replacing', isNewPart: false, isNewUsedPart: false, isBeingKept: false, isPartOfCase: false },
]

describe('BuildPartsList', () => {
  it.each(statuses)('maps $label to flags and back', ({ label, ...flags }) => {
    expect(BuildPartsList.methods!.newOldStatusLabel(flags)).toBe(label)
    const events: unknown[] = []
    BuildPartsList.methods!.changePartStatus.call({ $emit: (...args: unknown[]) => events.push(args) } as never, 3, label)
    expect(events).toEqual([['updatePart', { index: 3, newValues: flags }]])
  })

  it('defaults missing flags to old replacing and gives case inclusion priority', () => {
    expect(BuildPartsList.methods!.newOldStatusLabel({})).toBe('Old - Replacing')
    expect(BuildPartsList.methods!.newOldStatusLabel({ isNewUsedPart: true, isBeingKept: true })).toBe('Old - Keeping')
    expect(BuildPartsList.methods!.newOldStatusLabel({ isPartOfCase: true, isNewUsedPart: true })).toBe('New - Comes With Case')
  })

  it('preserves seeded displayed prices and budget boundaries', async () => {
    const build = new BuildModel({
      budget: 141,
      parts: statuses.map(({ label, ...flags }) => ({ ...flags, type: 'Case Fan', nameFull: label, price: 100 })),
    })
    const app = createSSRApp({ render: () => h(BuildPartsList, { parts: build.parts }) })
    app.mixin(filtersMixin).use(createStore({
      state: { categories: [{ name: 'casefans', displayName: 'Case Fans', partType: 'Case Fan' }] },
    })).component('FontAwesomeIcon', { render: () => null })
    const html = await renderToString(app)
    const prices = [...html.matchAll(/<dd\s+data-v-[^>]*>(.*?)<\/dd>/gs)].map(match => match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim())
    expect(prices).toEqual(['$100', '$41 (New: $100)', '$0 (New: $100)', '$0 (New: $100)', '$0 (New: $100)'])
    const cardApp = createSSRApp({ render: () => h(BuildCard, { build }) })
    cardApp.mixin(filtersMixin).use(createStore({
      state: { categories: [{ name: 'casefans', displayName: 'Case Fans', partType: 'Case Fan' }] },
    })).component('FontAwesomeIcon', { render: () => null })
    const cardHtml = await renderToString(cardApp)
    const budgetGroup = cardHtml.match(/class="budget-group"[^>]*>(.*?)<\/div>/s)![1]
    expect(budgetGroup.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()).toBe('$141 / $141')
    expect(newPartsUnderBudget(build)).toBe(true)
    build.budget = 140
    expect(newPartsUnderBudget(build)).toBe('You are over budget.')
    build.budget = 0
    expect(newPartsUnderBudget(build)).toBe(true)
  })
})
