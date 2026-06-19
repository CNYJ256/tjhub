import { describe, expect, it } from 'vitest'
import { createDefaultPayload } from '../src/services/adminPayload'
import { validatePayload } from '../functions/_shared/validationSchemas'

describe('admin default payloads', () => {
  it('creates schema-valid draft payloads for every admin content type', () => {
    for (const type of ['page', 'guide', 'link', 'project', 'category', 'banner']) {
      const payload = createDefaultPayload(type, '测试标题')
      expect(validatePayload(type, payload), type).toEqual({ ok: true })
    }
  })
})
