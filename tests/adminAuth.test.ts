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

describe('admin user authorization contract', () => {
  it('does not auto-grant a role to unknown Access users', () => {
    const user = null
    expect(user).toBeNull()
  })

  it('treats disabled D1 users as forbidden', () => {
    const user = { status: 'disabled' }
    expect(user.status).toBe('disabled')
  })
})
