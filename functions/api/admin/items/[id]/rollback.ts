import { requireAdminUser, requireRole } from '../../../../_shared/access'
import { errorJson, json, readJson } from '../../../../_shared/json'
import type { Env } from '../../../../_shared/types'

interface RollbackBody {
  versionId: string
  note?: string
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user
  const roleError = requireRole(user, ['admin'])
  if (roleError) return roleError

  const itemId = String(params.id || '')
  const body = await readJson<RollbackBody>(request)
  const version = await env.DB.prepare('SELECT id FROM content_versions WHERE id = ? AND item_id = ? AND status = ?')
    .bind(body.versionId, itemId, 'approved')
    .first<{ id: string }>()
  if (!version) return errorJson(400, 'validation_error', '只能回滚到已批准版本。')

  const item = await env.DB.prepare('SELECT published_version_id FROM content_items WHERE id = ?').bind(itemId).first<{ published_version_id: string | null }>()

  await env.DB.batch([
    env.DB.prepare('UPDATE content_items SET published_version_id = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(body.versionId, user.id, itemId),
    env.DB.prepare('INSERT INTO publish_events (item_id, from_version_id, to_version_id, actor_id, note) VALUES (?, ?, ?, ?, ?)')
      .bind(itemId, item?.published_version_id || null, body.versionId, user.id, body.note || '回滚发布版本'),
    env.DB.prepare('UPDATE public_revisions SET revision = revision + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1')
  ])

  return json({ ok: true })
}
