import { requireAdminUser } from '../../../../_shared/access'
import { errorJson, json } from '../../../../_shared/json'
import { newId } from '../../../../_shared/db'
import type { Env } from '../../../../_shared/types'

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user

  const versionId = String(params.id || '')
  const version = await env.DB.prepare('SELECT item_id, status FROM content_versions WHERE id = ?').bind(versionId).first<{ item_id: string; status: string }>()
  if (!version) return errorJson(404, 'not_found', '版本不存在。')
  if (version.status !== 'draft' && version.status !== 'rejected') return errorJson(400, 'validation_error', '只有草稿或被拒绝版本可以提交审核。')

  await env.DB.batch([
    env.DB.prepare('UPDATE content_versions SET status = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?').bind('pending', versionId),
    env.DB.prepare('INSERT INTO review_events (id, item_id, version_id, actor_id, action) VALUES (?, ?, ?, ?, ?)')
      .bind(newId('review'), version.item_id, versionId, user.id, 'submit')
  ])

  return json({ ok: true })
}
