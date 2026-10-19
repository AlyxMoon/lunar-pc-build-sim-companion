import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const BASE_PATH = '/pc-build-sim-companion/'
export const STORAGE_KEY = 'vuex'

export const ROUTES = [
  '/',
  '/builds',
  '/build-planner',
  '/overclocking',
  '/parts',
  '/will-it-run',
  '/settings',
  '/privacy-policy',
]

export const VIEWPORTS = {
  desktop: { width: 1280, height: 900, isMobile: false },
  phone: { width: 390, height: 844, isMobile: true },
}

export const MODES = ['light', 'dark']

const ALL_WIDTHS = Object.keys(VIEWPORTS)

const SEED_PART_FILES = [
  { file: 'cpus.json', count: 1 },
  { file: 'cpucoolers.json', count: 1 },
  { file: 'motherboards.json', count: 1 },
  { file: 'memory.json', count: 2 },
  { file: 'gpus.json', count: 1 },
  { file: 'storage.json', count: 1 },
  { file: 'powersupplies.json', count: 1 },
  { file: 'cases.json', count: 1 },
]

/**
 * Takes the first purchasable, unmodded entries of each shipped part file.
 * The files come from convert-raw-data, so the build run before the audit
 * is the one that wrote them.
 */
export function loadSeedParts (root) {
  return SEED_PART_FILES.flatMap(({ file, count }) => {
    const items = JSON.parse(readFileSync(join(root, 'src/assets/data/parts', file), 'utf8'))

    return items
      .filter(item => item.availableInShop && !item.moddedPartHEM)
      .slice(0, count)
      .map(item => ({
        ...item,
        isNewPart: true,
        isBeingKept: true,
        isNewUsedPart: false,
        isPartOfCase: false,
      }))
  })
}

/**
 * The persisted store as the app writes it: each build is serialised as its
 * model, whose attributes sit under `_attributes`.
 */
export function seedFor (mode, seedParts) {
  return {
    builds: [{
      _attributes: {
        id: 'audit-build',
        name: 'Audit build',
        budget: 1500,
        jobType: 'Gaming',
        objectives: ['Stay under budget', 'Run at 60 fps at 1080p'],
        estimatedScore: 0,
        parts: seedParts,
      },
      _hasErrors: false,
      _errors: [],
    }],
    playerLevel: 10,
    colorMode: mode,
    allowModdedPartsHEM: false,
    analyticsEnabled: false,
  }
}

async function clickByText (page, selector, text) {
  const handle = await page.evaluateHandle(
    (sel, label) => [...document.querySelectorAll(sel)].find(el => el.textContent.includes(label)) ?? null,
    selector,
    text,
  )
  const element = handle.asElement()
  if (!element) throw new Error(`no ${selector} containing "${text}"`)
  await element.click()
}

const steps = {
  async openMenu (page) {
    await page.click('button.expand')
    await page.waitForSelector('#navbar-links.open')
  },

  async expandCard (page) {
    await page.click('article .card-toggle')
    await page.waitForSelector('article.expanded')
  },

  async openAccordions (page) {
    for (const text of ['Errors With Build', 'Objectives', 'Parts']) {
      await clickByText(page, '.accordion-header', text)
    }
    await page.waitForFunction(() => document.querySelectorAll('.accordion.show').length === 3)
  },

  async openPartsAccordion (page) {
    await clickByText(page, '.accordion-header', 'Parts')
    await page.waitForSelector('.accordion.show .add-new-button')
  },

  async editCard (page) {
    await page.click('button[title="Edit Build"]')
    await page.waitForSelector('input[aria-label="Build name"]')
  },

  async openDialog3dmark (page) {
    await clickByText(page, 'button', 'Add parts to meet 3Dmark score')
    await page.waitForSelector('[role="dialog"][aria-label="Add Parts to Meet 3Dmark score"]')
  },

  async runCalculation (page) {
    await page.click('#desired-3dmark-score', { count: 3 })
    await page.type('#desired-3dmark-score', '1000')
    await clickByText(page, 'button', 'Run Calculation')
    await page.waitForSelector('[role="dialog"] h3.section-large', { timeout: 240000 })
  },

  async openPartLookup (page) {
    await page.click('.add-new-button')
    await page.waitForSelector('[role="dialog"][aria-label="Part Lookup"]')
  },
}

/**
 * Every page state the audit measures. A state with no steps is the route as
 * it loads; the rest reach a state the page does not show at load.
 */
export const SCENARIOS = [
  ...ROUTES.map(route => ({
    name: `route ${route}`,
    route,
    widths: ALL_WIDTHS,
    steps: [],
  })),

  ...ROUTES.map(route => ({
    name: `menu open on ${route}`,
    route,
    widths: ['phone'],
    steps: [steps.openMenu],
  })),

  {
    name: 'card expanded with accordions open',
    route: '/builds',
    widths: ALL_WIDTHS,
    steps: [steps.expandCard, steps.openAccordions],
  },

  {
    name: 'card in edit mode',
    route: '/builds',
    widths: ALL_WIDTHS,
    steps: [steps.expandCard, steps.editCard],
  },

  {
    name: 'dialog 3Dmark generator',
    route: '/builds',
    widths: ALL_WIDTHS,
    steps: [steps.expandCard, steps.openDialog3dmark],
  },

  {
    name: 'dialog 3Dmark generator after calculation',
    route: '/builds',
    widths: ALL_WIDTHS,
    steps: [steps.expandCard, steps.openDialog3dmark, steps.runCalculation],
  },

  {
    name: 'dialog part lookup',
    route: '/builds',
    widths: ALL_WIDTHS,
    steps: [steps.expandCard, steps.openPartsAccordion, steps.openPartLookup],
  },
]
