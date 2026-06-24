import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('admin media upload feedback', () => {
  it('shows a success card with uploaded media URL and copy action', () => {
    const source = readFileSync('src/views/admin/AdminMediaView.vue', 'utf8')

    expect(source).toContain('@uploaded=')
    expect(source).toContain('上传成功')
    expect(source).toContain('复制链接')
    expect(source).toContain('链接已复制。')
    expect(source).toContain('navigator.clipboard.writeText')
  })

  it('prevents duplicate media uploads while a file is uploading', () => {
    const source = readFileSync('src/components/admin/MediaPicker.vue', 'utf8')

    expect(source).toContain('uploading')
    expect(source).toContain('上传中...')
    expect(source).toContain(':disabled="uploading"')
    expect(source).toContain('finally')
  })
})
