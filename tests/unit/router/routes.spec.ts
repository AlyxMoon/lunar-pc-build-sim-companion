import { describe, expect, it } from 'vitest'
import routes from '@/router/routes'

const pages = routes.filter(route => 'component' in route)

describe('Page titles', () => {
  it('covers every page route', () => {
    expect(pages.length).toBeGreaterThan(0)
  })

  it.each(pages.map(route => [route.path, route]))('gives %s a title made of words', (_path, route) => {
    expect(route.meta?.title).toMatch(/^[A-Z][a-z]+( [A-Z][a-z]+)*$/)
  })
})
