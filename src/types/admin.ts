export type AdminRole = 'admin' | 'editor'
export type AdminUserStatus = 'active' | 'disabled'

export interface AdminUserDto {
  id: string
  email: string
  name: string | null
  role: AdminRole
  status: AdminUserStatus
}

export interface AdminMeResponse {
  ok: true
  user: AdminUserDto
}

export interface AdminItemListRow {
  id: string
  type: string
  slug: string
  current_version_id: string | null
  published_version_id: string | null
  version_status: string | null
  current_title: string | null
  archived_at: string | null
}
