import { describe, expect, it } from 'vitest'
import { selectHomeQuickEntries } from '../src/services/homeQuickEntries'
import type { LinkEntry } from '../src/types/content'

function link(slug: string, overrides: Partial<LinkEntry> = {}): LinkEntry {
  return {
    type: 'link',
    title: slug,
    slug,
    visibility: 'public',
    reviewStatus: 'approved',
    body: '',
    html: '',
    url: `https://example.com/${slug}`,
    description: `${slug} description`,
    category: 'tools',
    tags: [],
    aliases: [],
    sourceKind: 'official',
    official: true,
    featured: false,
    placements: [],
    audience: ['all'],
    priority: 0,
    status: 'active',
    contributors: [],
    ...overrides
  }
}

describe('selectHomeQuickEntries', () => {
  it('selects home placement first, then featured, then higher priority, then original order', () => {
    const entries = [
      link('plain-a'),
      link('featured-low', { featured: true, priority: 1 }),
      link('home-low', { placements: ['home'], priority: 1 }),
      link('priority-high', { priority: 99 }),
      link('home-high', { placements: ['home'], priority: 9 }),
      link('featured-high', { featured: true, priority: 8 }),
      link('plain-b')
    ]

    expect(selectHomeQuickEntries(entries).map((entry) => entry.slug)).toEqual([
      'home-high',
      'home-low',
      'featured-high',
      'featured-low',
      'priority-high',
      'plain-a'
    ])
  })

  it('caps the list and does not mutate the source array', () => {
    const entries = [
      link('a', { priority: 1 }),
      link('b', { priority: 2 }),
      link('c', { priority: 3 }),
      link('d', { priority: 4 }),
      link('e', { priority: 5 }),
      link('f', { priority: 6 }),
      link('g', { priority: 7 })
    ]

    const originalOrder = entries.map((entry) => entry.slug)

    expect(selectHomeQuickEntries(entries)).toHaveLength(6)
    expect(entries.map((entry) => entry.slug)).toEqual(originalOrder)
  })
})
