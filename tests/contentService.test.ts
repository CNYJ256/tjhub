import { describe, expect, it } from 'vitest'
import { normalizeMarkdownContent, parseCategoryTaxonomy, publicApproved } from '../src/services/content'

const linkMarkdown = `---
type: link
title: 同济大学一网通办
slug: service-portal
url: https://example.com
description: 常用校园事务办理入口。
category: official
tags: [官方, 办事]
aliases: [一网通办, 网上办事大厅]
sourceKind: official
official: true
featured: true
placements: [home]
audience: [all]
priority: 100
status: active
visibility: public
reviewStatus: approved
contributors: [cnyj]
guideSlug: service-portal-guide
---
正文说明。`

describe('content service', () => {
  it('normalizes Markdown into a public approved link', () => {
    const item = normalizeMarkdownContent('/content/collections/links/official/service-portal.md', linkMarkdown)

    expect(item.type).toBe('link')
    expect(item.title).toBe('同济大学一网通办')
    expect(item.body).toContain('正文说明')
    expect(item.html).toContain('正文说明')
  })

  it('filters only public approved content', () => {
    expect(publicApproved({ visibility: 'public', reviewStatus: 'approved' })).toBe(true)
    expect(publicApproved({ visibility: 'draft', reviewStatus: 'approved' })).toBe(false)
    expect(publicApproved({ visibility: 'public', reviewStatus: 'pending' })).toBe(false)
  })

  it('parses category taxonomy labels for public UI', () => {
    const categories = parseCategoryTaxonomy(`official:
  label: 官方网站
  description: 学校官方系统和服务入口
tools:
  label: 常用工具
  description: 多数同学都会用到的校园工具
`)

    expect(categories.official.label).toBe('官方网站')
    expect(categories.tools.description).toBe('多数同学都会用到的校园工具')
  })
})
