import type { AdminMeResponse } from '../types/admin'

async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init.headers || {})
    }
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || '后台接口请求失败。')
  }

  return (await response.json()) as T
}

export function fetchAdminMe(): Promise<AdminMeResponse> {
  return adminFetch<AdminMeResponse>('/api/admin/me')
}
