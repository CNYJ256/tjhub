import { describe, expect, it } from 'vitest'
import { linkSchema, pageSchema } from '../src/services/contentSchemas'

describe('content schemas', () => {
  it('accepts a public approved link with aliases and guideSlug', () => {
    const parsed = linkSchema.parse({
      type: 'link',
      title: '同济大学一网通办',
      slug: 'tongji-service-portal',
      url: 'https://example.com',
      description: '常用校园事务办理入口。',
      category: 'official',
      tags: ['官方', '办事'],
      aliases: ['一网通办', '网上办事大厅', 'service portal'],
      sourceKind: 'official',
      official: true,
      featured: true,
      placements: ['home'],
      audience: ['all'],
      priority: 100,
      status: 'active',
      visibility: 'public',
      reviewStatus: 'approved',
      contributors: ['cnyj'],
      lastCheckedAt: '2026-06-19',
      guideSlug: 'service-portal-guide'
    })

    expect(parsed.aliases).toContain('一网通办')
    expect(parsed.guideSlug).toBe('service-portal-guide')
  })

  it('rejects unknown enum values', () => {
    expect(() =>
      linkSchema.parse({
        type: 'link',
        title: '错误示例',
        slug: 'bad',
        url: 'https://example.com',
        description: '错误示例。',
        category: 'official',
        sourceKind: 'school',
        status: 'active',
        visibility: 'public',
        reviewStatus: 'approved'
      })
    ).toThrow()
  })

  it('accepts a page with block metadata', () => {
    const parsed = pageSchema.parse({
      type: 'page',
      title: 'TJHub',
      slug: 'home',
      visibility: 'public',
      reviewStatus: 'approved',
      blocks: [
        { type: 'hero', title: 'TJHub', description: '同济学生常用信息入口' },
        { type: 'banner', source: 'banners' },
        { type: 'collectionPreview', collection: 'links', placement: 'home', limit: 8 }
      ]
    })

    expect(parsed.blocks).toHaveLength(3)
  })
})
