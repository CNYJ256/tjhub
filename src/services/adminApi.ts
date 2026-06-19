import type { AdminItemListRow, AdminMeResponse } from '../types/admin'

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

export function fetchAdminItems(type?: string, status?: string): Promise<{ ok: true; items: AdminItemListRow[] }> {
  const params = new URLSearchParams()
  if (type) params.set('type', type)
  if (status) params.set('status', status)
  const query = params.toString()
  return adminFetch(`/api/admin/items${query ? `?${query}` : ''}`)
}

export function fetchAdminItem(id: string): Promise<{ ok: true; item: unknown; versions: unknown[]; reviewEvents: unknown[]; publishEvents: unknown[] }> {
  return adminFetch(`/api/admin/items/${id}`)
}

export function saveAdminVersion(id: string, body: { title: string; description?: string; payload: Record<string, unknown> }) {
  return adminFetch(`/api/admin/items/${id}/versions`, {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export function submitAdminVersion(versionId: string) {
  return adminFetch(`/api/admin/versions/${versionId}/submit`, { method: 'POST' })
}

export function reviewAdminVersion(versionId: string, action: 'approve' | 'reject', note: string) {
  return adminFetch(`/api/admin/versions/${versionId}/review`, {
    method: 'POST',
    body: JSON.stringify({ action, note })
  })
}

export function publishAdminItem(itemId: string, versionId: string, note = '') {
  return adminFetch(`/api/admin/items/${itemId}/publish`, {
    method: 'POST',
    body: JSON.stringify({ versionId, note })
  })
}

export function rollbackAdminItem(itemId: string, versionId: string, note = '') {
  return adminFetch(`/api/admin/items/${itemId}/rollback`, {
    method: 'POST',
    body: JSON.stringify({ versionId, note })
  })
}

export function createAdminItem(body: { type: string; slug: string; title: string; description?: string; payload: Record<string, unknown> }): Promise<{ ok: true; itemId: string; versionId: string }> {
  return adminFetch('/api/admin/items', {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export async function uploadAdminMedia(file: File, altText: string): Promise<{ ok: true; media: unknown }> {
  const body = new FormData()
  body.set('file', file)
  body.set('altText', altText)

  const response = await fetch('/api/admin/media/upload', {
    method: 'POST',
    body
  })

  if (!response.ok) throw new Error(await response.text())
  return (await response.json()) as { ok: true; media: unknown }
}
