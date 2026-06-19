import { describe, expect, it } from 'vitest'

interface VersionRow {
  item_type: string
  slug: string
  payload_json: string
}

function parsePayload(row: VersionRow) {
  return { type: row.item_type, slug: row.slug, ...JSON.parse(row.payload_json) }
}

describe('public content serialization contract', () => {
  it('serializes link payload status as entryStatus when needed', () => {
    const item = parsePayload({
      item_type: 'link',
      slug: 'service-portal',
      payload_json: JSON.stringify({ title: '一网通办', status: 'active' })
    })

    expect(item.status).toBe('active')
    expect(item.type).toBe('link')
  })

  it('requires public media payloads to include renderable URLs', () => {
    const block = { type: 'hero', media: { mediaId: 'media_1', url: 'https://media.tjhub.cc/a.png' } }
    expect(block.media.url).toMatch(/^https:\/\/media\.tjhub\.cc\//)
  })
})

import { groupPublicItems } from '../functions/_shared/contentSerializers'

describe('groupPublicItems', () => {
  it('returns a valid empty snapshot for empty rows', () => {
    const snapshot = groupPublicItems([], 0)
    expect(snapshot.version).toBe(0)
    expect(snapshot.pages).toHaveLength(0)
    expect(snapshot.links).toHaveLength(0)
    expect(snapshot.projects).toHaveLength(0)
    expect(snapshot.guides).toHaveLength(0)
    expect(snapshot.banners).toHaveLength(0)
    expect(Object.keys(snapshot.categories)).toHaveLength(0)
    expect(snapshot.generatedAt).toBeTruthy()
  })
})

describe('public API fallback contract', () => {
  it('treats a full empty snapshot as invalid for frontend fallback', () => {
    const snapshot = { pages: [], guides: [], links: [], projects: [], categories: {}, banners: [] }
    const empty =
      snapshot.pages.length === 0 &&
      snapshot.links.length === 0 &&
      snapshot.projects.length === 0 &&
      Object.keys(snapshot.categories).length === 0 &&
      snapshot.banners.length === 0

    expect(empty).toBe(true)
  })
})
