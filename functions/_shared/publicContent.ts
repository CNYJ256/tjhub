import { groupPublicItems, type PublicVersionRow } from './contentSerializers'
import type { Env } from './types'

export async function getPublicRevision(env: Env): Promise<number> {
  const row = await env.DB.prepare('SELECT revision FROM public_revisions WHERE id = 1').first<{ revision: number }>()
  return row?.revision || 0
}

export async function getPublishedRows(env: Env): Promise<PublicVersionRow[]> {
  const result = await env.DB.prepare(`
    SELECT
      ci.id AS item_id,
      ci.type AS item_type,
      ci.slug AS slug,
      cv.id AS version_id,
      cv.title AS title,
      cv.description AS description,
      cv.payload_json AS payload_json
    FROM content_items ci
    JOIN content_versions cv ON ci.published_version_id = cv.id
    WHERE ci.archived_at IS NULL
      AND cv.status = 'approved'
    ORDER BY ci.type ASC, ci.slug ASC
  `).all<PublicVersionRow>()

  return result.results || []
}

export async function getPublicSnapshot(env: Env) {
  const [version, rows] = await Promise.all([getPublicRevision(env), getPublishedRows(env)])
  return groupPublicItems(rows, version)
}
