import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import type { BaseContent, ContentIndex, LinkEntry, PageContent, ProjectEntry } from '../types/content'
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

export function loadContentIndex(): ContentIndex {
  const index: ContentIndex = { pages: [], guides: [], links: [], projects: [] }

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

export const contentIndex = loadContentIndex()

export function findPage(slug: string): PageContent | undefined {
  return contentIndex.pages.find((page) => page.slug === slug)
}

export function findGuide(slug: string): PageContent | undefined {
  return contentIndex.guides.find((guide) => guide.slug === slug)
}
