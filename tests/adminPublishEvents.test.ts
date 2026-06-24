import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('admin publish events endpoint', () => {
  it('defines a protected GET endpoint for publish history', () => {
    const source = readFileSync('functions/api/admin/publish-events.ts', 'utf8')

    expect(source).toContain('onRequestGet')
    expect(source).toContain('requireAdminUser')
    expect(source).toContain('publish_events')
    expect(source).toContain('content_items')
    expect(source).toContain('content_versions')
    expect(source).toContain('users')
    expect(source).toContain('ORDER BY pe.created_at DESC')
    expect(source).toContain('LIMIT 50')
  })

  it('returns normalized camelCase publish event fields', () => {
    const source = readFileSync('functions/api/admin/publish-events.ts', 'utf8')

    for (const field of [
      'itemId',
      'itemType',
      'itemSlug',
      'itemTitle',
      'fromVersionId',
      'toVersionId',
      'actorEmail',
      'actorName',
      'createdAt'
    ]) {
      expect(source).toContain(field)
    }
  })

  it('infers rollback events from the existing rollback note', () => {
    const source = readFileSync('functions/api/admin/publish-events.ts', 'utf8')

    expect(source).toContain('回滚发布版本')
    expect(source).toContain('rollback')
    expect(source).toContain('publish')
  })
})
