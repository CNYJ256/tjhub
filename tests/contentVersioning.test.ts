import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const migration = readFileSync('migrations/0001_initial.sql', 'utf8')

describe('D1 schema migration', () => {
  it('creates the core content and admin tables', () => {
    for (const table of ['users', 'content_items', 'content_versions', 'media_assets', 'review_events', 'publish_events', 'public_revisions']) {
      expect(migration).toContain(`CREATE TABLE IF NOT EXISTS ${table}`)
    }
  })

  it('defines current and published version pointers separately', () => {
    expect(migration).toContain('current_version_id TEXT')
    expect(migration).toContain('published_version_id TEXT')
  })

  it('defines archived_at so public queries can exclude archived items', () => {
    expect(migration).toContain('archived_at TEXT')
  })
})
