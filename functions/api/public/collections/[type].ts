import { errorJson, json } from '../../../_shared/json'
import { getPublishedRows, getPublicRevision } from '../../../_shared/publicContent'
import { serializePublicItem } from '../../../_shared/contentSerializers'
import type { Env } from '../../../_shared/types'

export const onRequestGet: PagesFunction<Env> = async ({ env, params, request }) => {
  const type = String(params.type || '')
  if (type !== 'links' && type !== 'projects') {
    return errorJson(404, 'not_found', '集合不存在。')
  }

  const itemType = type === 'links' ? 'link' : 'project'
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const placement = url.searchParams.get('placement')

  const rows = await getPublishedRows(env)
  const items = rows
    .filter((row) => row.item_type === itemType)
    .map((row) => serializePublicItem(row))
    .filter((item) => !category || item.category === category)
    .filter((item) => !placement || (Array.isArray(item.placements) && item.placements.includes(placement)))

  return json(
    { version: await getPublicRevision(env), items },
    { headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } }
  )
}
