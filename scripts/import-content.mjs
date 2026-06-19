import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

const adminEmail = process.env.INITIAL_ADMIN_EMAIL
if (!adminEmail) {
  throw new Error('INITIAL_ADMIN_EMAIL is required before importing content.')
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function loadMarkdownFiles(dir) {
  return walk(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const parsed = matter(readFileSync(file, 'utf8'))
      return { file, data: parsed.data, body: parsed.content.trim() }
    })
}

function contentItemSql(item) {
  return [
    `-- ${item.file}`,
    `INSERT OR IGNORE INTO content_items (id, type, slug, created_by, updated_by) VALUES ('${item.id}', '${item.type}', '${item.slug}', 'system', 'system');`,
    `INSERT OR REPLACE INTO content_versions (id, item_id, version_number, status, title, description, payload_json, created_by) VALUES ('${item.versionId}', '${item.id}', 1, 'approved', ${JSON.stringify(item.title)}, ${JSON.stringify(item.description || '')}, ${JSON.stringify(JSON.stringify(item.payload))}, 'system');`,
    `UPDATE content_items SET current_version_id = '${item.versionId}', published_version_id = '${item.versionId}' WHERE id = '${item.id}';`
  ].join('\n')
}

const markdownSources = [
  ...loadMarkdownFiles('content/pages'),
  ...loadMarkdownFiles('content/guides'),
  ...loadMarkdownFiles('content/collections/links'),
  ...loadMarkdownFiles('content/collections/projects')
]

const items = markdownSources.map((source) => {
  const type = source.data.type
  const slug = source.data.slug
  const id = `${type}_${slug}`
  const payload = { ...source.data, body: source.body }
  return {
    file: source.file,
    id,
    versionId: `${id}_v1`,
    type,
    slug,
    title: source.data.title,
    description: source.data.description || '',
    payload
  }
})

const sql = [
  `INSERT OR REPLACE INTO users (id, email, name, role, status) VALUES ('user_initial_admin', ${JSON.stringify(adminEmail)}, ${JSON.stringify(adminEmail)}, 'admin', 'active');`,
  ...items.map(contentItemSql),
  `UPDATE public_revisions SET revision = revision + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1;`,
  `-- content/taxonomies/categories.yaml is imported by the implementation's taxonomy importer.`
].join('\n\n')

process.stdout.write(sql)
