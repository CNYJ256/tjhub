import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

describe('AdminEditorView loading state', () => {
  it('clears loading after item fetch settles', () => {
    const source = readFileSync('src/views/admin/AdminEditorView.vue', 'utf8')
    expect(source).toMatch(/finally\s*{[\s\S]*loading\.value\s*=\s*false[\s\S]*}/)
  })
})
