import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('global CSS', () => {
  it('does not override Tailwind text color utilities on links', () => {
    const css = readFileSync('src/style.css', 'utf8')

    expect(css).not.toMatch(/a\s*\{[^}]*color:\s*inherit/i)
  })
})
