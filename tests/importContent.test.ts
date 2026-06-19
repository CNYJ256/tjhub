import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

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

  it('renders Markdown html into imported page payloads', () => {
    const output = execFileSync('node', ['scripts/import-content.mjs'], {
      encoding: 'utf8',
      env: { ...process.env, INITIAL_ADMIN_EMAIL: 'admin@example.com' }
    })

    expect(output).toContain('"html":"<p>TJHub 是面向同济学生的非官方校园信息入口。</p>')
  })

  it('emits SQLite string literals that can contain JSON double quotes', () => {
    const output = execFileSync('node', ['scripts/import-content.mjs'], {
      encoding: 'utf8',
      env: { ...process.env, INITIAL_ADMIN_EMAIL: 'admin@example.com' }
    })

    expect(output).toContain(`'{"type":"page","title":"TJHub"`)
    expect(output).not.toContain(`"{\\"type\\":\\"page\\"`)
  })
})
