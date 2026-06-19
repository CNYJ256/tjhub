import { json } from '../../_shared/json'
import { getPublicSnapshot } from '../../_shared/publicContent'
import type { Env } from '../../_shared/types'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const snapshot = await getPublicSnapshot(env)
  return json(snapshot, {
    headers: {
      'cache-control': 'public, max-age=60, stale-while-revalidate=300'
    }
  })
}
