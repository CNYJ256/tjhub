import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'

function walkMarkdown(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const fullPath = join(dir, name)
    return statSync(fullPath).isDirectory() ? walkMarkdown(fullPath) : fullPath.endsWith('.md') ? [fullPath] : []
  })
}

const contentFiles = walkMarkdown('content')
const linkEntries = walkMarkdown('content/collections/links').map((file) => {
  const parsed = matter(readFileSync(file, 'utf8'))
  return { file, body: parsed.content, data: parsed.data as Record<string, unknown> }
})

const linksBySlug = new Map(linkEntries.map((entry) => [entry.data.slug, entry]))

function dateValue(value: unknown): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value)
}

const requiredLinks = [
  ['undergraduate-system', 'https://1.tongji.edu.cn', 'official'],
  ['mail', 'https://mail.tongji.edu.cn', 'official'],
  ['canvas', 'https://canvas.tongji.edu.cn', 'learning'],
  ['undergraduate-college', 'https://jwc.tongji.edu.cn', 'official'],
  ['graduate-system', 'https://gs.tongji.edu.cn', 'official'],
  ['look', 'https://look.tongji.edu.cn', 'learning'],
  ['library', 'https://www.lib.tongji.edu.cn', 'official'],
  ['software', 'https://software.tongji.edu.cn', 'tools'],
  ['cloud-disk', 'https://yunpan.tongji.edu.cn', 'tools'],
  ['ai-agent-platform', 'https://agent.tongji.edu.cn', 'tools'],
  ['freshman-welcome', 'https://1.tongji.edu.cn/welcome', 'life'],
  ['service-portal', 'https://all.tongji.edu.cn', 'official'],
  ['second-classroom', 'https://itongjis.tongji.edu.cn', 'life'],
  ['logistics', 'https://tjhq.tongji.edu.cn', 'official'],
  ['innovation-training', 'https://cxcy.tongji.edu.cn', 'learning'],
  ['network-service', 'https://nic.tongji.edu.cn', 'official'],
  ['finance-office', 'https://paycwc.tongji.edu.cn', 'official'],
  ['work-study', 'http://myportal.tongji.edu.cn', 'life'],
  ['vpn', 'https://nic.tongji.edu.cn', 'tools'],
  ['sports', 'https://stadium.tongji.edu.cn', 'tools'],
  ['advanced-math-sync', 'https://gaoshutongbu.tongji.edu.cn', 'learning'],
  ['physics-lab', 'http://phyvr.tongji.edu.cn', 'learning']
]

describe('Tongji curated link content', () => {
  it('includes the requested official and freshman entrances with real URLs', () => {
    for (const [slug, url, category] of requiredLinks) {
      const entry = linksBySlug.get(slug)
      expect(entry, slug).toBeDefined()
      expect(entry?.data.url).toBe(url)
      expect(entry?.data.category).toBe(category)
      expect(entry?.data.visibility).toBe('public')
      expect(entry?.data.reviewStatus).toBe('approved')
      expect(dateValue(entry?.data.lastCheckedAt)).toBe('2026-06-30')
    }
  })

  it('places onboarding links in the freshman section', () => {
    for (const slug of ['undergraduate-system', 'mail', 'canvas', 'freshman-welcome', 'service-portal', 'finance-office']) {
      const placements = linksBySlug.get(slug)?.data.placements
      expect(placements).toContain('freshman')
    }
  })

  it('keeps imported student-facing content refreshed for 2026 with the copyright notice', () => {
    const combinedContent = contentFiles.map((file) => readFileSync(file, 'utf8')).join('\n')
    expect(combinedContent).not.toMatch(/2023/)
    expect(combinedContent).toContain('版权归乌龙茶 tongji.icu 所有，如有侵权请联系删除')
  })
})
