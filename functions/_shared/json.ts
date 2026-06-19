import type { ApiErrorCode } from './types'

export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {})
    }
  })
}

export function errorJson(status: number, code: ApiErrorCode, message: string): Response {
  return json({ ok: false, error: { code, message } }, { status })
}

export async function readJson<T>(request: Request): Promise<T> {
  return (await request.json()) as T
}
