import { errorJson } from './json'
import type { AccessIdentity, AdminUser, Env } from './types'

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return atob(padded)
}

interface JwtHeader {
  alg: string
  kid: string
  typ: string
}

function decodeJwtHeader(token: string): JwtHeader {
  const [header] = token.split('.')
  if (!header) throw new Error('Access JWT 格式无效。')
  return JSON.parse(base64UrlDecode(header)) as JwtHeader
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

async function fetchJwks(teamDomain: string): Promise<Record<string, JsonWebKey>> {
  const url = `https://${teamDomain}/cdn-cgi/access/certs`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`JWKS 获取失败: ${response.status}`)
  const { keys } = await response.json() as { keys: Array<JsonWebKey & { kid: string }> }
  const map: Record<string, JsonWebKey> = {}
  for (const key of keys) {
    if (key.kid) map[key.kid] = key
  }
  return map
}

async function verifyJwtSignature(token: string, env: Env): Promise<boolean> {
  const [rawHeader, rawPayload, signature] = token.split('.')
  if (!rawHeader || !rawPayload || !signature) return false

  try {
    const header = decodeJwtHeader(token)
    const jwks = await fetchJwks(env.ACCESS_TEAM_DOMAIN)
    const jwk = jwks[header.kid]
    if (!jwk) return false

    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const encoder = new TextEncoder()
    const data = encoder.encode(`${rawHeader}.${rawPayload}`)
    const sigBytes = base64UrlToBytes(signature)

    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sigBytes as BufferSource, data)
  } catch {
    return false
  }
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

  const signatureValid = await verifyJwtSignature(token, env)
  if (!signatureValid) {
    return errorJson(401, 'unauthorized', 'Access JWT 签名验证失败。')
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
