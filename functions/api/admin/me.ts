import { errorJson, json } from '../../_shared/json'
import { requireAdminUser } from '../../_shared/access'
import type { Env } from '../../_shared/types'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireAdminUser(request, env)
  if (user instanceof Response) return user

  if (user.status !== 'active') {
    return errorJson(403, 'forbidden', '当前账号已被禁用。')
  }

  return json({ ok: true, user })
}
