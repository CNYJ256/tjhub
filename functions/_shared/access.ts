import { errorJson } from './json'
import type { AccessIdentity, AdminUser, Env } from './types'

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return atob(padded)
}

export function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split('.')
  if (!payload) {
    throw new Error('Access JWT 格式无效。')
  }
  try {
    return JSON.parse(base64UrlDecode(payload)) as Record<string, unknown>
  } catch {
    throw new Error('Access JWT 载荷解析失败。')
  }
}

export async function validateAccessJwt(request: Request, env: Env): Promise<AccessIdentity | Response> {
  const token = request.headers.get('Cf-Access-Jwt-Assertion')
  if (!token) {
    return errorJson(401, 'unauthorized', '需要通过 Cloudflare Access 登录。')
  }

  const payload = decodeJwtPayload(token)
  const email = typeof payload.email === 'string' ? payload.email : ''
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud]

  if (!email) {
    return errorJson(401, 'unauthorized', 'Access 身份缺少邮箱。')
  }

  if (!aud.includes(env.ACCESS_AUD)) {
    return errorJson(401, 'unauthorized', 'Access JWT audience 不匹配。')
  }

  return { email, name: typeof payload.name === 'string' ? payload.name : undefined }
}

export async function getAdminUser(env: Env, identity: AccessIdentity): Promise<AdminUser | null> {
  return await env.DB.prepare(
    'SELECT id, email, name, role, status FROM users WHERE lower(email) = lower(?) LIMIT 1'
  ).bind(identity.email).first<AdminUser>()
}

export async function requireAdminUser(request: Request, env: Env): Promise<AdminUser | Response> {
  const identity = await validateAccessJwt(request, env)
  if (identity instanceof Response) return identity

  const user = await getAdminUser(env, identity)
  if (!user || user.status !== 'active') {
    return errorJson(403, 'forbidden', '当前账号没有 TJHub 后台权限。')
  }

  return user
}

export function requireRole(user: AdminUser, roles: Array<AdminUser['role']>): Response | null {
  if (!roles.includes(user.role)) {
    return errorJson(403, 'forbidden', '当前角色无权执行该操作。')
  }
  return null
}
