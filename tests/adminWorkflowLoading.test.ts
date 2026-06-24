import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('admin workflow loading guards', () => {
  it('guards editor save, submit, review, publish, and rollback actions', () => {
    const source = readFileSync('src/views/admin/AdminEditorView.vue', 'utf8')

    for (const token of [
      'saving',
      'submitting',
      'reviewingAction',
      'publishingVersionId',
      'rollingBackVersionId',
      ':disabled="submitting"',
      ':disabled="reviewingAction !== null"',
      ':disabled="publishingVersionId === v.id"',
      ':saving="saving"',
      ':rolling-back-version-id="rollingBackVersionId"'
    ]) {
      expect(source).toContain(token)
    }
  })

  it('disables page and link save buttons while saving', () => {
    const blockEditor = readFileSync('src/components/admin/BlockEditor.vue', 'utf8')
    const linkProjectForm = readFileSync('src/components/admin/LinkProjectForm.vue', 'utf8')

    for (const source of [blockEditor, linkProjectForm]) {
      expect(source).toContain('saving?: boolean')
      expect(source).toContain(':disabled="saving"')
      expect(source).toContain('保存中...')
    }
  })

  it('disables version timeline publish and rollback buttons while requests run', () => {
    const source = readFileSync('src/components/admin/VersionTimeline.vue', 'utf8')

    expect(source).toContain('rollingBackVersionId?: string | null')
    expect(source).toContain('publishingVersionId?: string | null')
    expect(source).toContain(':disabled="publishingVersionId === version.id"')
    expect(source).toContain(':disabled="rollingBackVersionId === version.id"')
  })

  it('guards review queue approve and reject actions', () => {
    const source = readFileSync('src/views/admin/AdminReviewView.vue', 'utf8')

    expect(source).toContain('reviewingAction')
    expect(source).toContain(':disabled="reviewingAction !== null"')
    expect(source).toContain('审核中...')
    expect(source).toContain('finally')
  })
})
