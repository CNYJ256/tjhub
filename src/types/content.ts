export type ContentType = 'page' | 'guide' | 'link' | 'project'
export type SourceKind = 'official' | 'student' | 'third_party' | 'internal'
export type EntryStatus = 'active' | 'stale' | 'unavailable' | 'archived'
export type Visibility = 'public' | 'hidden' | 'draft'
export type ReviewStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface BaseContent {
  type: ContentType
  title: string
  slug: string
  visibility: Visibility
  reviewStatus: ReviewStatus
  body: string
  html: string
}

export interface LinkEntry extends BaseContent {
  type: 'link'
  url: string
  description: string
  category: string
  tags: string[]
  aliases: string[]
  sourceKind: SourceKind
  official: boolean
  featured: boolean
  placements: string[]
  audience: string[]
  priority: number
  status: EntryStatus
  contributors: string[]
  createdAt?: string
  updatedAt?: string
  lastCheckedAt?: string
  guideSlug?: string
}

export interface ProjectEntry extends BaseContent {
  type: 'project'
  url: string
  description: string
  category: string
  tags: string[]
  aliases: string[]
  sourceKind: SourceKind
  featured: boolean
  placements: string[]
  audience: string[]
  priority: number
  status: EntryStatus
  maintainers: string[]
  contributors: string[]
  lastCheckedAt?: string
}

export interface PageBlock {
  type: string
  title?: string
  description?: string
  source?: string
  collection?: 'links' | 'projects'
  placement?: string
  limit?: number
}

export interface PageContent extends BaseContent {
  type: 'page' | 'guide'
  blocks: PageBlock[]
}

export interface CategoryMeta {
  key: string
  label: string
  description: string
}

export interface ContentIndex {
  pages: PageContent[]
  guides: PageContent[]
  links: LinkEntry[]
  projects: ProjectEntry[]
  categories: Record<string, CategoryMeta>
}
