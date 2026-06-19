import { describe, expect, it } from 'vitest'
import { validateAccessClaims } from '../functions/_shared/access'

const env = {
  ACCESS_AUD: 'aud-123',
  ACCESS_TEAM_DOMAIN: 'tjhub.cloudflareaccess.com'
}

describe('validateAccessClaims', () => {
  it('accepts a current token for the configured issuer and audience', () => {
    const now = 1_800_000_000
    expect(validateAccessClaims({
      email: 'admin@example.com',
      aud: ['aud-123'],
      iss: 'https://tjhub.cloudflareaccess.com',
      exp: now + 60,
      nbf: now - 60
    }, env, now)).toEqual({ ok: true })
  })

  it('rejects tokens from another issuer', () => {
    const now = 1_800_000_000
    expect(validateAccessClaims({
      email: 'admin@example.com',
      aud: ['aud-123'],
      iss: 'https://evil.cloudflareaccess.com',
      exp: now + 60,
      nbf: now - 60
    }, env, now)).toMatchObject({ ok: false })
  })

  it('rejects expired tokens', () => {
    const now = 1_800_000_000
    expect(validateAccessClaims({
      email: 'admin@example.com',
      aud: ['aud-123'],
      iss: 'https://tjhub.cloudflareaccess.com',
      exp: now - 1,
      nbf: now - 60
    }, env, now)).toMatchObject({ ok: false })
  })
})
