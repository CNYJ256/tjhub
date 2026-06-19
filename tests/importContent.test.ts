import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const script = readFileSync('scripts/import-content.mjs', 'utf8')

describe('content import script', () => {
  it('requires INITIAL_ADMIN_EMAIL for bootstrap', () => {
    expect(script).toContain('INITIAL_ADMIN_EMAIL')
  })

  it('imports all Phase 1 content families', () => {
    for (const path of ['content/pages', 'content/guides', 'content/collections/links', 'content/collections/projects', 'content/taxonomies/categories.yaml']) {
      expect(script).toContain(path)
    }
  })
})
