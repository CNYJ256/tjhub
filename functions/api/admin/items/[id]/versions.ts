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

  const latest = await env.DB.prepare('SELECT max(version_number) AS max_version FROM content_versions WHERE item_id = ?').bind(itemId).first<{ max_version: number }>()
  const nextVersion = (latest?.max_version || 0) + 1
  const versionId = newId('ver')

  await env.DB.batch([
    env.DB.prepare('INSERT INTO content_versions (id, item_id, version_number, status, title, description, payload_json, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(versionId, itemId, nextVersion, 'draft', body.title, body.description || '', JSON.stringify(body.payload || {}), user.id),
    env.DB.prepare('UPDATE content_items SET current_version_id = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(versionId, user.id, itemId)
  ])

  return json({ ok: true, versionId, versionNumber: nextVersion }, { status: 201 })
}
