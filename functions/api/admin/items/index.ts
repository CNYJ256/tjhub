import { requireAdminUser } from '../../../_shared/access'
import { errorJson, json, readJson } from '../../../_shared/json'
import { newId } from '../../../_shared/db'
import type { Env } from '../../../_shared/types'

interface CreateItemBody {
  type: 'page' | 'guide' | 'link' | 'project' | 'category' | 'banner'
  slug: string
  title: string
  description?: string
  payload: Record<string, unknown>
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user

  const url = new URL(request.url)
  const type = url.searchParams.get('type')
  const status = url.searchParams.get('status')

  const result = await env.DB.prepare(`
    SELECT ci.*, cv.status AS version_status, cv.title AS current_title
    FROM content_items ci
    LEFT JOIN content_versions cv ON ci.current_version_id = cv.id
    WHERE (?1 IS NULL OR ci.type = ?1)
      AND (
        ?2 IS NULL
        OR (?2 = 'archived' AND ci.archived_at IS NOT NULL)
        OR (?2 = 'published' AND ci.published_version_id IS NOT NULL AND ci.archived_at IS NULL)
        OR (cv.status = ?2 AND ci.archived_at IS NULL)
      )
    ORDER BY ci.updated_at DESC
  `).bind(type, status).all()

  return json({ ok: true, items: result.results || [] })
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user

  const body = await readJson<CreateItemBody>(request)
  if (!body.type || !body.slug || !body.title) {
    return errorJson(400, 'validation_error', '类型、slug 和标题不能为空。')
  }

  const itemId = newId('item')
  const versionId = newId('ver')
  const payloadJson = JSON.stringify(body.payload || {})

  await env.DB.batch([
    env.DB.prepare('INSERT INTO content_items (id, type, slug, current_version_id, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(itemId, body.type, body.slug, versionId, user.id, user.id),
    env.DB.prepare('INSERT INTO content_versions (id, item_id, version_number, status, title, description, payload_json, created_by) VALUES (?, ?, 1, ?, ?, ?, ?, ?)')
      .bind(versionId, itemId, 'draft', body.title, body.description || null, payloadJson, user.id)
  ])

  return json({ ok: true, itemId, versionId }, { status: 201 })
}
