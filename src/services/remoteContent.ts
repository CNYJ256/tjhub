import { z } from 'zod'
import type { PublicContentSnapshot } from '../types/content'

export const DEFAULT_REMOTE_CONTENT_TIMEOUT_MS = 10000

const linkItemSchema = z.object({
  type: z.literal('link'),
  slug: z.string(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  sourceKind: z.enum(['official', 'student', 'third_party', 'internal']).default('official'),
  status: z.enum(['active', 'stale', 'unavailable', 'archived']).default('active'),
  guideSlug: z.string().optional()
}).passthrough()

const projectItemSchema = z.object({
  type: z.literal('project'),
  slug: z.string(),
  title: z.string()
}).passthrough()

const snapshotSchema = z.object({
  version: z.number(),
  generatedAt: z.string(),
  pages: z.array(z.any()),
  guides: z.array(z.any()),
  links: z.array(linkItemSchema),
  projects: z.array(projectItemSchema),
  categories: z.record(z.string(), z.any()),
  banners: z.array(z.any()).default([])
})

export function snapshotIsEmpty(snapshot: Pick<PublicContentSnapshot, 'pages' | 'links' | 'projects' | 'categories' | 'banners'>): boolean {
  return (
    snapshot.pages.length === 0 &&
    snapshot.links.length === 0 &&
    snapshot.projects.length === 0 &&
    Object.keys(snapshot.categories).length === 0 &&
    snapshot.banners.length === 0
  )
}

export async function fetchRemoteContent(timeoutMs = DEFAULT_REMOTE_CONTENT_TIMEOUT_MS): Promise<PublicContentSnapshot> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch('/api/public/content', { signal: controller.signal, cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`Public content API failed: ${response.status}`)
    }
    const parsed = snapshotSchema.parse(await response.json()) as unknown as PublicContentSnapshot
    if (snapshotIsEmpty(parsed)) {
      throw new Error('Public content API returned an empty snapshot')
    }
    return parsed
  } finally {
    window.clearTimeout(timeout)
  }
}
