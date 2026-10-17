import { afterEach, describe, expect, it, vi } from 'vitest'
import { build } from 'vite'
import viteConfig from '../../../vite.config.mts'

afterEach(() => vi.unstubAllEnvs())

async function buildHtml (enabled?: string, code?: string): Promise<string> {
  vi.stubEnv('VUE_APP_ENABLE_ANALYTICS', enabled ?? '')
  vi.stubEnv('VUE_APP_ANALYTICS_CODE', code ?? '')
  const config = viteConfig({ command: 'build', mode: 'production' })
  const result = await build({
    ...config,
    configFile: false,
    logLevel: 'silent',
    build: { ...config.build, write: false },
  })

  if (Array.isArray(result) || !('output' in result)) {
    throw new Error('Expected one application build')
  }
  const html = result.output.find(file => file.fileName === 'index.html')
  if (!html || html.type !== 'asset') throw new Error('Missing built index.html')
  return String(html.source)
}

describe('Production HTML', () => {
  it('loads assets from the deployment base and omits analytics by default', async () => {
    const html = await buildHtml()
    expect(html).toMatch(/src="\/pc-build-sim-companion\/assets\/[^" ]+\.js"/)
    expect(html).toMatch(/href="\/pc-build-sim-companion\/assets\/[^" ]+\.css"/)
    expect(html).toContain('href="/pc-build-sim-companion/favicon.ico"')
    expect(html).not.toContain('gtm.js')
    expect(html).not.toContain('dataLayer')
  })

  it('includes the existing tag manager when both deployment settings are provided', async () => {
    const html = await buildHtml('true', 'GTM-TEST')
    expect(html).toContain('https://metrics.allisterbytes.com/gtm.js?id=')
    expect(html).toContain('GTM-TEST')
    expect(html).toContain('dataLayer')
  })

  it.each([
    ['false', 'GTM-TEST'],
    ['true', undefined],
  ])('omits analytics with enable=%s and code=%s', async (enabled, code) => {
    const html = await buildHtml(enabled, code)
    expect(html).not.toContain('gtm.js')
    expect(html).not.toContain('dataLayer')
  })
})
