import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('static content browser bootstrap', () => {
  it('installs Buffer before building the static content index', () => {
    const source = readFileSync('src/services/staticContent.ts', 'utf8')
    const bufferAssignment = source.indexOf('globalThis.Buffer = Buffer')
    const indexCreation = source.indexOf('staticContentIndex = loadContentIndex()')

    expect(bufferAssignment).toBeGreaterThanOrEqual(0)
    expect(indexCreation).toBeGreaterThan(bufferAssignment)
  })
})
