export interface Env {
  DB: D1Database
  MEDIA_BUCKET: R2Bucket
  MEDIA_PUBLIC_BASE_URL: string
  ACCESS_AUD: string
  ACCESS_TEAM_DOMAIN: string
  INITIAL_ADMIN_EMAIL?: string
}

export interface AccessIdentity {
  email: string
  name?: string
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'editor'
  status: 'active' | 'disabled'
}

export type ApiErrorCode = 'unauthorized' | 'forbidden' | 'not_found' | 'validation_error' | 'server_error'
