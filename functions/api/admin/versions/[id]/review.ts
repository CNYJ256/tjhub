import { requireAdminUser, requireRole } from '../../../../_shared/access'
import { errorJson, json, readJson } from '../../../../_shared/json'
import { newId } from '../../../../_shared/db'
import type { Env } from '../../../../_shared/types'

interface ReviewBody {
  action: 'approve' | 'reject'
  note?: string
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user
  const roleError = requireRole(user, ['admin'])
  if (roleError) return roleError

  const versionId = String(params.id || '')
  const body = await readJson<ReviewBody>(request)
  if (body.action === 'reject' && !body.note?.trim()) {
    return errorJson(400, 'validation_error', '拒绝审核必须填写原因。')
  }

  const version = await env.DB.prepare('SELECT item_id FROM content_versions WHERE id = ? AND status = ?').bind(versionId, 'pending').first<{ item_id: string }>()
  if (!version) return errorJson(404, 'not_found', '待审核版本不存在。')

  const nextStatus = body.action === 'approve' ? 'approved' : 'rejected'
  await env.DB.batch([
    env.DB.prepare('UPDATE content_versions SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, review_note = ? WHERE id = ?')
      .bind(nextStatus, user.id, body.note || '', versionId),
    env.DB.prepare('INSERT INTO review_events (id, item_id, version_id, actor_id, action, note) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(newId('review'), version.item_id, versionId, user.id, body.action, body.note || '')
  ])

  return json({ ok: true, status: nextStatus })
}
