import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { parse as parseYaml } from 'yaml'

const adminEmail = process.env.INITIAL_ADMIN_EMAIL
if (!adminEmail) {
  throw new Error('INITIAL_ADMIN_EMAIL is required before importing content.')
}

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true })

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`
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
  const payloadJson = JSON.stringify(item.payload)
  return [
    `-- ${item.file}`,
    `INSERT OR IGNORE INTO content_items (id, type, slug, created_by, updated_by) VALUES (${sqlString(item.id)}, ${sqlString(item.type)}, ${sqlString(item.slug)}, 'system', 'system');`,
    `INSERT OR REPLACE INTO content_versions (id, item_id, version_number, status, title, description, payload_json, created_by) VALUES (${sqlString(item.versionId)}, ${sqlString(item.id)}, 1, 'approved', ${sqlString(item.title)}, ${sqlString(item.description || '')}, ${sqlString(payloadJson)}, 'system');`,
    `UPDATE content_items SET current_version_id = ${sqlString(item.versionId)}, published_version_id = ${sqlString(item.versionId)} WHERE id = ${sqlString(item.id)};`
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
  const payload = { ...source.data, body: source.body, html: markdown.render(source.body) }
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

// Import categories from taxonomy
try {
  const catYaml = readFileSync('content/taxonomies/categories.yaml', 'utf8')
  const categories = parseYaml(catYaml)
  for (const [slug, meta] of Object.entries(categories)) {
    if (typeof meta !== 'object' || !meta) continue
    const m = /** @type {Record<string, string>} */ (meta)
    const title = m.label || slug
    const desc = m.description || ''
    const id = `category_${slug}`
    const versionId = `${id}_v1`
    const payload = { label: title, description: desc }

    items.push({
      file: 'content/taxonomies/categories.yaml',
      id,
      versionId,
      type: 'category',
      slug,
      title,
      description: desc,
      payload
    })
  }
} catch (err) {
  console.error(`Warning: could not import categories: ${err.message}`)
}

const sql = [
  `INSERT OR REPLACE INTO users (id, email, name, role, status) VALUES ('user_initial_admin', ${sqlString(adminEmail)}, ${sqlString(adminEmail)}, 'admin', 'active');`,
  ...items.map(contentItemSql),
  `UPDATE public_revisions SET revision = revision + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1;`
].join('\n\n')

process.stdout.write(sql)
