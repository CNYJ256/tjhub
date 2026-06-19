export interface PublicVersionRow {
  item_id: string
  item_type: string
  slug: string
  version_id: string
  title: string
  description: string | null
  payload_json: string
}

export function parsePayload(row: PublicVersionRow): Record<string, unknown> {
  return JSON.parse(row.payload_json) as Record<string, unknown>
}

export function serializePublicItem(row: PublicVersionRow): Record<string, unknown> {
  const payload = parsePayload(row)
  return {
    ...payload,
    type: row.item_type,
    slug: row.slug,
    title: row.title,
    description: row.description || String(payload.description || '')
  }
}

export function groupPublicItems(rows: PublicVersionRow[], version: number) {
  const pages = []
  const guides = []
  const links = []
  const projects = []
  const banners = []
  const categories: Record<string, { key: string; label: string; description: string }> = {}

  for (const row of rows) {
    const item = serializePublicItem(row)
    if (row.item_type === 'page') pages.push(item)
    if (row.item_type === 'guide') guides.push(item)
    if (row.item_type === 'link') links.push(item)
    if (row.item_type === 'project') projects.push(item)
    if (row.item_type === 'banner') banners.push(item)
    if (row.item_type === 'category') {
      const label = String(item.label || item.title || row.slug)
      categories[row.slug] = {
        key: row.slug,
        label,
        description: String(item.description || '')
      }
    }
  }

  return {
    version,
    generatedAt: new Date().toISOString(),
    pages,
    guides,
    links,
    projects,
    categories,
    banners
  }
}
