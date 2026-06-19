import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import type { BaseContent, CategoryMeta, ContentIndex, LinkEntry, PageContent, ProjectEntry } from '../types/content'
import { linkSchema, pageSchema, projectSchema } from './contentSchemas'

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true })

type VisibilityShape = Pick<BaseContent, 'visibility' | 'reviewStatus'>

export function publicApproved(item: VisibilityShape): boolean {
  return item.visibility === 'public' && item.reviewStatus === 'approved'
}

export function normalizeMarkdownContent(path: string, raw: string): PageContent | LinkEntry | ProjectEntry {
  const parsed = matter(raw)
  const body = parsed.content.trim()
  const html = markdown.render(body)
  const data = parsed.data

  if (data.type === 'link') {
    return { ...linkSchema.parse(data), body, html }
  }

  if (data.type === 'project') {
    return { ...projectSchema.parse(data), body, html }
  }

  if (data.type === 'page' || data.type === 'guide') {
    return { ...pageSchema.parse(data), body, html }
  }

  throw new Error(`Unsupported content type in ${path}`)
}

function loadRawMarkdown(): Array<{ path: string; raw: string }> {
  const modules = import.meta.glob('/content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true
  }) as Record<string, string>

  return Object.entries(modules).map(([path, raw]) => ({ path, raw }))
}

function loadRawTaxonomies(): Array<{ path: string; raw: string }> {
  const modules = import.meta.glob('/content/taxonomies/*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true
  }) as Record<string, string>

  return Object.entries(modules).map(([path, raw]) => ({ path, raw }))
}

export function parseCategoryTaxonomy(raw: string): Record<string, CategoryMeta> {
  const categories: Record<string, CategoryMeta> = {}
  let currentKey = ''

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trimEnd()

    if (!line.trim()) {
      continue
    }

    const topLevelMatch = /^([A-Za-z0-9_-]+):$/.exec(line)
    if (topLevelMatch) {
      currentKey = topLevelMatch[1]
      categories[currentKey] = { key: currentKey, label: currentKey, description: '' }
      continue
    }

    const fieldMatch = /^\s+(label|description):\s*(.+)$/.exec(line)
    if (fieldMatch && currentKey) {
      if (fieldMatch[1] === 'label') {
        categories[currentKey].label = fieldMatch[2].trim()
      } else {
        categories[currentKey].description = fieldMatch[2].trim()
      }
    }
  }

  return categories
}

function loadCategories(): Record<string, CategoryMeta> {
  const categories: Record<string, CategoryMeta> = {}

  for (const entry of loadRawTaxonomies()) {
    if (entry.path.endsWith('/categories.yaml')) {
      Object.assign(categories, parseCategoryTaxonomy(entry.raw))
    }
  }

  return categories
}

export function loadContentIndex(): ContentIndex {
  const index: ContentIndex = { pages: [], guides: [], links: [], projects: [], categories: loadCategories(), banners: [] }

  for (const entry of loadRawMarkdown()) {
    try {
      const item = normalizeMarkdownContent(entry.path, entry.raw)

      if (!publicApproved(item)) {
        continue
      }

      if (item.type === 'page') index.pages.push(item)
      if (item.type === 'guide') index.guides.push(item)
      if (item.type === 'link') index.links.push(item)
      if (item.type === 'project') index.projects.push(item)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(`[TJHub] Invalid content skipped: ${entry.path}`, error)
      }
    }
  }

  index.links.sort((a, b) => b.priority - a.priority)
  index.projects.sort((a, b) => b.priority - a.priority)
  return index
}

export const staticContentIndex = loadContentIndex()

export function findStaticPage(slug: string): PageContent | undefined {
  return staticContentIndex.pages.find((page) => page.slug === slug)
}

export function findStaticGuide(slug: string): PageContent | undefined {
  return staticContentIndex.guides.find((guide) => guide.slug === slug)
}
