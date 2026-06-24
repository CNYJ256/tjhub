import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('global CSS', () => {
  it('does not override Tailwind text color utilities on links', () => {
    const css = readFileSync('src/style.css', 'utf8')

    expect(css).not.toMatch(/a\s*\{[^}]*color:\s*inherit/i)
  })

  it('defines shared light UI tokens', () => {
    const css = readFileSync('src/style.css', 'utf8')

    expect(css).toContain('--color-page:')
    expect(css).toContain('--color-surface:')
    expect(css).toContain('--color-border:')
    expect(css).toContain('--color-text:')
    expect(css).toContain('--color-muted:')
    expect(css).toContain('--color-accent:')
    expect(css).toContain('--color-focus:')
    expect(css).toContain('--radius-control:')
    expect(css).toContain('--shadow-soft:')
  })

  it('does not define blue custom interaction states', () => {
    const css = readFileSync('src/style.css', 'utf8')

    expect(css).not.toMatch(/#(?:0ea5e9|0284c7|2563eb|1d4ed8|3b82f6|60a5fa)/i)
    expect(css).not.toMatch(/rgb\(\s*(?:14\s+165\s+233|37\s+99\s+235|59\s+130\s+246)/i)
  })
})
