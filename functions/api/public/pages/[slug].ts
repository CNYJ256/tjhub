import { errorJson, json } from '../../../_shared/json'
import { getPublishedRows, getPublicRevision } from '../../../_shared/publicContent'
import { serializePublicItem } from '../../../_shared/contentSerializers'
import type { Env } from '../../../_shared/types'

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const slug = String(params.slug || '')
  const rows = await getPublishedRows(env)
  const row = rows.find((item) => item.slug === slug && (item.item_type === 'page' || item.item_type === 'guide'))

  if (!row) {
    return errorJson(404, 'not_found', '页面不存在。')
  }

  return json(
    { version: await getPublicRevision(env), item: serializePublicItem(row) },
    { headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } }
  )
}
