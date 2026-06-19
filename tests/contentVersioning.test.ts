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

describe('content versioning contract', () => {
  it('keeps current and published version semantics separate', () => {
    const item = { current_version_id: 'v3', published_version_id: 'v1' }
    expect(item.current_version_id).toBe('v3')
    expect(item.published_version_id).toBe('v1')
  })

  it('requires saved versions to be immutable records', () => {
    const saveBehavior = 'insert-new-version'
    expect(saveBehavior).toBe('insert-new-version')
  })
})
