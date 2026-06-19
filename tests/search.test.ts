import { describe, expect, it } from 'vitest'
import type { LinkEntry } from '../src/types/content'
import { searchLinks } from '../src/services/search'

const baseLink: LinkEntry = {
  type: 'link',
  title: '同济大学信息门户',
  slug: 'portal',
  url: 'https://example.com',
  description: '统一身份认证相关入口。',
  category: 'official',
  tags: ['官方'],
  aliases: ['统一认证', 'identity portal'],
  sourceKind: 'official',
  official: true,
  featured: true,
  placements: ['home'],
  audience: ['all'],
  priority: 10,
  status: 'active',
  visibility: 'public',
  reviewStatus: 'approved',
  contributors: [],
  body: '登录入口。',
  html: '<p>登录入口。</p>'
}

describe('searchLinks', () => {
  it('matches aliases', () => {
    expect(searchLinks([baseLink], '统一认证')).toHaveLength(1)
    expect(searchLinks([baseLink], 'identity')).toHaveLength(1)
  })

  it('matches description and tags', () => {
    expect(searchLinks([baseLink], '入口')).toHaveLength(1)
    expect(searchLinks([baseLink], '官方')).toHaveLength(1)
  })

  it('returns all links for empty query', () => {
    expect(searchLinks([baseLink], '')).toHaveLength(1)
  })
})
