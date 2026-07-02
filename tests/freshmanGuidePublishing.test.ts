import { readFileSync } from 'fs'
import { describe, expect, it } from 'vitest'

describe('freshman guide publishing visibility', () => {
  it('does not time out the large public content snapshot after only two seconds', () => {
    const source = readFileSync('src/services/remoteContent.ts', 'utf8')

    expect(source).toContain('DEFAULT_REMOTE_CONTENT_TIMEOUT_MS = 10000')
    expect(source).toContain('fetchRemoteContent(timeoutMs = DEFAULT_REMOTE_CONTENT_TIMEOUT_MS)')
  })

  it('allows page collection previews to render published guides', () => {
    const types = readFileSync('src/types/content.ts', 'utf8')
    const schemas = readFileSync('src/services/contentSchemas.ts', 'utf8')
    const functionSchemas = readFileSync('functions/_shared/validationSchemas.ts', 'utf8')
    const component = readFileSync('src/components/content/CollectionPreviewBlock.vue', 'utf8')
    const blockEditor = readFileSync('src/components/admin/BlockEditor.vue', 'utf8')

    expect(types).toContain("collection?: 'links' | 'projects' | 'guides'")
    expect(schemas).toContain("z.enum(['links', 'projects', 'guides'])")
    expect(functionSchemas).toContain("z.enum(['links', 'projects', 'guides'])")
    expect(component).toContain("props.collection === 'guides'")
    expect(component).toContain('`/guides/${entry.slug}`')
    expect(blockEditor).toContain('<option value="guides">指南</option>')
  })

  it('declares a guide directory preview on the local freshman page seed', () => {
    const freshmanPage = readFileSync('content/pages/freshman.md', 'utf8')

    expect(freshmanPage).toContain('title: 新生指南目录')
    expect(freshmanPage).toContain('collection: guides')
  })
})
