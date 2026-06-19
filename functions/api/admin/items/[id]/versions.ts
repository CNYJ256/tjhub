import { requireAdminUser } from '../../../../_shared/access'
import { errorJson, json, readJson } from '../../../../_shared/json'
import { newId } from '../../../../_shared/db'
import type { Env } from '../../../../_shared/types'

interface SaveVersionBody {
  title: string
  description?: string
  payload: Record<string, unknown>
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user

  const itemId = String(params.id || '')
  const body = await readJson<SaveVersionBody>(request)
  if (!body.title) return errorJson(400, 'validation_error', '标题不能为空。')

  const itemExists = await env.DB.prepare('SELECT id FROM content_items WHERE id = ?').bind(itemId).first()
  if (!itemExists) return errorJson(404, 'not_found', '内容不存在。')

  const versionId = newId('ver')

  await env.DB.batch([
    env.DB.prepare(`INSERT INTO content_versions (id, item_id, version_number, status, title, description, payload_json, created_by)
      SELECT ?, ?, COALESCE(MAX(version_number), 0) + 1, ?, ?, ?, ?, ?
      FROM content_versions WHERE item_id = ?`)
      .bind(versionId, itemId, 'draft', body.title, body.description || null, JSON.stringify(body.payload || {}), user.id, itemId),
    env.DB.prepare('UPDATE content_items SET current_version_id = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(versionId, user.id, itemId)
  ])

  return json({ ok: true, versionId }, { status: 201 })
}
