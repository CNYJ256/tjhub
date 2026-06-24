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

export type AdminContentType = 'page' | 'guide' | 'link' | 'project' | 'category' | 'banner'
export type AdminPublishAction = 'publish' | 'rollback'

export interface AdminPublishEventDto {
  id: number
  itemId: string
  itemType: AdminContentType
  itemSlug: string
  itemTitle: string
  action: AdminPublishAction
  fromVersionId: string | null
  toVersionId: string
  actorEmail: string
  actorName: string
  note: string
  createdAt: string
}

export interface AdminPublishEventsResponse {
  ok: true
  events: AdminPublishEventDto[]
}

export interface AdminMediaDto {
  id: string
  r2Key: string
  filename: string
  mimeType: string
  sizeBytes: number
  altText: string
  url: string
}
