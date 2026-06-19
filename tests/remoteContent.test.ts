import { describe, expect, it } from 'vitest'

function isEmptySnapshot(snapshot: { pages: unknown[]; links: unknown[]; projects: unknown[]; categories: Record<string, unknown>; banners: unknown[] }) {
  return (
    snapshot.pages.length === 0 &&
    snapshot.links.length === 0 &&
    snapshot.projects.length === 0 &&
    Object.keys(snapshot.categories).length === 0 &&
    snapshot.banners.length === 0
  )
}

describe('remote content validation', () => {
  it('marks only a fully empty snapshot as empty', () => {
    expect(isEmptySnapshot({ pages: [], links: [], projects: [], categories: {}, banners: [] })).toBe(true)
    expect(isEmptySnapshot({ pages: [], links: [], projects: [], categories: { official: {} }, banners: [] })).toBe(false)
  })
})
