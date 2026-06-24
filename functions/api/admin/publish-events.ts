import { requireAdminUser } from '../../_shared/access'
import { json } from '../../_shared/json'
import type { Env } from '../../_shared/types'

interface PublishEventRow {
  id: number
  item_id: string
  item_type: 'page' | 'guide' | 'link' | 'project' | 'category' | 'banner'
  item_slug: string
  item_title: string | null
  from_version_id: string | null
  to_version_id: string
  actor_email: string | null
  actor_name: string | null
  note: string | null
  created_at: string
}

function inferAction(note: string | null): 'publish' | 'rollback' {
  return note?.includes('回滚发布版本') ? 'rollback' : 'publish'
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user

  const result = await env.DB.prepare(`
    SELECT
      pe.id,
      pe.item_id,
      ci.type AS item_type,
      ci.slug AS item_slug,
      cv.title AS item_title,
      pe.from_version_id,
      pe.to_version_id,
      u.email AS actor_email,
      u.name AS actor_name,
      pe.note,
      pe.created_at
    FROM publish_events pe
    JOIN content_items ci ON ci.id = pe.item_id
    JOIN content_versions cv ON cv.id = pe.to_version_id
    LEFT JOIN users u ON u.id = pe.actor_id
    ORDER BY pe.created_at DESC, pe.id DESC
    LIMIT 50
  `).all<PublishEventRow>()

  const events = (result.results || []).map((row) => ({
    id: row.id,
    itemId: row.item_id,
    itemType: row.item_type,
    itemSlug: row.item_slug,
    itemTitle: row.item_title || row.item_slug,
    action: inferAction(row.note),
    fromVersionId: row.from_version_id,
    toVersionId: row.to_version_id,
    actorEmail: row.actor_email || '',
    actorName: row.actor_name || '',
    note: row.note || '',
    createdAt: row.created_at
  }))

  return json({ ok: true, events })
}
