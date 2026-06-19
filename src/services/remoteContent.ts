import { z } from 'zod'
import type { PublicContentSnapshot } from '../types/content'

const snapshotSchema = z.object({
  version: z.number(),
  generatedAt: z.string(),
  pages: z.array(z.any()),
  guides: z.array(z.any()),
  links: z.array(z.any()),
  projects: z.array(z.any()),
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

export async function fetchRemoteContent(timeoutMs = 2000): Promise<PublicContentSnapshot> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch('/api/public/content', { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`Public content API failed: ${response.status}`)
    }
    const parsed = snapshotSchema.parse(await response.json()) as PublicContentSnapshot
    if (snapshotIsEmpty(parsed)) {
      throw new Error('Public content API returned an empty snapshot')
    }
    return parsed
  } finally {
    window.clearTimeout(timeout)
  }
}
