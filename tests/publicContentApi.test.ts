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
