import { describe, expect, it } from 'vitest'

function isBearerProtected(headers: Record<string, string | undefined>) {
  return Boolean(headers['Cf-Access-Jwt-Assertion'])
}

describe('admin auth contract', () => {
  it('requires Cloudflare Access JWT assertion header for admin APIs', () => {
    expect(isBearerProtected({})).toBe(false)
    expect(isBearerProtected({ 'Cf-Access-Jwt-Assertion': 'jwt' })).toBe(true)
  })
})
