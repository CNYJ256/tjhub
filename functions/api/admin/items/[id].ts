import { requireAdminUser } from '../../../_shared/access'
import { errorJson, json } from '../../../_shared/json'
import type { Env } from '../../../_shared/types'

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user

  const id = String(params.id || '')
  const item = await env.DB.prepare('SELECT * FROM content_items WHERE id = ? LIMIT 1').bind(id).first()
  if (!item) return errorJson(404, 'not_found', '内容不存在。')

  const versions = await env.DB.prepare('SELECT * FROM content_versions WHERE item_id = ? ORDER BY version_number DESC').bind(id).all()
  const reviewEvents = await env.DB.prepare('SELECT * FROM review_events WHERE item_id = ? ORDER BY created_at DESC').bind(id).all()
  const publishEvents = await env.DB.prepare('SELECT * FROM publish_events WHERE item_id = ? ORDER BY created_at DESC').bind(id).all()

  return json({ ok: true, item, versions: versions.results || [], reviewEvents: reviewEvents.results || [], publishEvents: publishEvents.results || [] })
}
