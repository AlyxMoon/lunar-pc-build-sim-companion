import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import net from 'node:net'
import { once } from 'node:events'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import lighthouse from 'lighthouse'
import puppeteer from 'puppeteer-core'

import {
  BASE_PATH,
  MODES,
  ROUTES,
  SCENARIOS,
  STORAGE_KEY,
  VIEWPORTS,
  loadSeedParts,
  seedFor,
} from './scenarios.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const PORT = 4791
const ORIGIN = `http://localhost:${PORT}`
const CHROME_PATH = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
const FORM_FACTORS = ['desktop', 'phone']
const LIGHTHOUSE_CATEGORIES = ['seo', 'accessibility']
const EXIT_FAILED = 1
const EXIT_SETUP = 2

const tally = { checks: 0, failed: 0 }

const delay = ms => new Promise(resolveDelay => setTimeout(resolveDelay, ms))

function routeUrl (route) {
  return `${ORIGIN}${BASE_PATH}${route.replace(/^\//, '')}`
}

function record (label, problems) {
  tally.checks += 1
  if (problems.length) tally.failed += 1

  const verdict = problems.length ? 'FAIL' : 'PASS'
  const detail = problems.length ? ` - ${problems.join('; ')}` : ''
  console.log(`${verdict} ${label}${detail}`)
}

function setupProblem () {
  if (!existsSync(join(root, 'dist', 'index.html'))) {
    return 'no production build in dist; run corepack yarn@1.22.22 build first'
  }
  if (!existsSync(join(root, 'src', 'assets', 'data', 'parts', 'cpus.json'))) {
    return 'no shipped part data in src/assets/data; run corepack yarn@1.22.22 convert-raw-data first'
  }
  if (!existsSync(CHROME_PATH)) {
    return `Chrome not found at ${CHROME_PATH}; set CHROME_PATH to a Chrome executable`
  }
  return null
}

function portAccepts (host) {
  return new Promise(resolveProbe => {
    const socket = net.createConnection({ host, port: PORT })
    socket.once('connect', () => {
      socket.destroy()
      resolveProbe(true)
    })
    socket.once('error', () => resolveProbe(false))
  })
}

async function portListening () {
  const answers = await Promise.all(['127.0.0.1', '::1'].map(portAccepts))
  return answers.some(Boolean)
}

function startPreview () {
  const viteBin = join(root, 'node_modules', 'vite', 'bin', 'vite.js')
  const child = spawn(process.execPath, [viteBin, 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'pipe'],
    windowsHide: true,
  })

  let stderr = ''
  child.stderr.on('data', chunk => {
    stderr = (stderr + chunk).slice(-2000)
  })

  return { child, stderrText: () => stderr }
}

async function waitForPreview ({ child, stderrText }) {
  const deadline = Date.now() + 60000

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`vite preview exited with ${child.exitCode}: ${stderrText()}`)
    }

    try {
      const response = await fetch(`${ORIGIN}${BASE_PATH}`)
      if (response.ok) return
    } catch {
      // not listening yet
    }

    await delay(300)
  }

  throw new Error('vite preview did not answer within 60 seconds')
}

async function stopPreview ({ child }) {
  if (child.exitCode !== null || child.signalCode !== null) return

  child.kill()
  const exited = await Promise.race([
    once(child, 'exit').then(() => true),
    delay(10000).then(() => false),
  ])

  if (exited) return

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true })
  } else {
    child.kill('SIGKILL')
  }
}

async function axeCheck (browser, seedParts, axeSource, scenario, width, mode) {
  const label = `${scenario.name} | ${width} | ${mode} | axe`
  const page = await browser.newPage()

  try {
    await page.setViewport(VIEWPORTS[width])
    await page.evaluateOnNewDocument(
      (key, value) => window.localStorage.setItem(key, value),
      STORAGE_KEY,
      JSON.stringify(seedFor(mode, seedParts)),
    )
    await page.goto(routeUrl(scenario.route), { waitUntil: 'networkidle0' })

    for (const step of scenario.steps) {
      await step(page)
    }

    await page.addScriptTag({ content: axeSource })
    const violations = await page.evaluate(async tags => {
      const run = await window.axe.run(document, { runOnly: { type: 'tag', values: tags } })
      return run.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map(node => node.target.join(' ')),
      }))
    }, AXE_TAGS)

    record(label, violations.map(v => `${v.id} (${v.impact}) at ${v.targets.slice(0, 3).join(', ')}`))
  } catch (error) {
    record(label, [`error: ${error.message}`])
  } finally {
    await page.close()
  }
}

async function lighthouseCheck (port, route, formFactor) {
  const label = `${route} | ${formFactor} | lighthouse`

  try {
    const flags = {
      port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: LIGHTHOUSE_CATEGORIES,
      ...(formFactor === 'desktop' ? { preset: 'desktop' } : {}),
    }
    const { lhr } = await lighthouse(routeUrl(route), flags)

    const problems = []
    for (const id of LIGHTHOUSE_CATEGORIES) {
      const category = lhr.categories[id]
      if (category.score === null || category.score < 1) {
        const failing = category.auditRefs
          .filter(ref => lhr.audits[ref.id].score !== null && lhr.audits[ref.id].score < 1)
          .map(ref => ref.id)
        problems.push(`${id} ${category.score?.toFixed(2) ?? 'unscored'} (${failing.join(', ')})`)
      }
    }

    record(label, problems)
  } catch (error) {
    record(label, [`error: ${error.message}`])
  }
}

async function runChecks (seedParts, axeSource) {
  const preview = startPreview()

  try {
    await waitForPreview(preview)

    const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true })
    try {
      const lighthousePort = Number(new URL(browser.wsEndpoint()).port)

      for (const scenario of SCENARIOS) {
        for (const width of scenario.widths) {
          for (const mode of MODES) {
            await axeCheck(browser, seedParts, axeSource, scenario, width, mode)
          }
        }
      }

      for (const route of ROUTES) {
        for (const formFactor of FORM_FACTORS) {
          await lighthouseCheck(lighthousePort, route, formFactor)
        }
      }
    } finally {
      await browser.close()
    }
  } finally {
    await stopPreview(preview)
  }
}

async function audit () {
  const problem = setupProblem()
  if (problem) {
    console.error(problem)
    return EXIT_SETUP
  }

  if (await portListening()) {
    console.error(`port ${PORT} already has a listener; stop it before the audit`)
    return EXIT_SETUP
  }

  const seedParts = loadSeedParts(root)
  const axeSource = readFileSync(join(root, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8')

  try {
    await runChecks(seedParts, axeSource)
  } catch (error) {
    console.error(`audit stopped: ${error.message}`)
    tally.failed += 1
  }

  if (await portListening()) {
    console.error(`port ${PORT} still has a listener after the audit stopped`)
    tally.failed += 1
  }

  console.log(`${tally.checks} checks, ${tally.failed} failed`)
  return tally.failed ? EXIT_FAILED : 0
}

process.exitCode = await audit()
