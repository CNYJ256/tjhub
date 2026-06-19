import { requireAdminUser } from '../../../_shared/access'
import { errorJson, json } from '../../../_shared/json'
import { newId } from '../../../_shared/db'
import type { Env } from '../../../_shared/types'

const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
const maxBytes = 5 * 1024 * 1024

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user

  const form = await request.formData()
  const file = form.get('file')
  const altText = String(form.get('altText') || '')

  if (!(file instanceof File)) return errorJson(400, 'validation_error', '请选择要上传的文件。')
  if (!allowedTypes.has(file.type)) return errorJson(400, 'validation_error', '仅支持 PNG、JPEG、WEBP 和 GIF 图片。')
  if (file.size > maxBytes) return errorJson(400, 'validation_error', '图片不能超过 5MB。')

  const id = newId('media')
  const extension = file.name.split('.').pop() || 'bin'
  const r2Key = `uploads/${new Date().toISOString().slice(0, 10)}/${id}.${extension}`

  await env.MEDIA_BUCKET.put(r2Key, file.stream(), {
    httpMetadata: { contentType: file.type }
  })

  await env.DB.prepare(
    'INSERT INTO media_assets (id, r2_key, filename, mime_type, size_bytes, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, r2Key, file.name, file.type, file.size, altText, user.id).run()

  return json({
    ok: true,
    media: {
      id,
      r2Key,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      altText,
      url: `${env.MEDIA_PUBLIC_BASE_URL.replace(/\/$/, '')}/${r2Key}`
    }
  }, { status: 201 })
}
