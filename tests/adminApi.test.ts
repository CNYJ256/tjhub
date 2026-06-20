import { describe, expect, it } from 'vitest'
import { readAdminErrorMessage } from '../src/services/adminApi'

describe('admin API client', () => {
  it('summarizes non-JSON error pages instead of surfacing raw HTML', async () => {
    const response = new Response('<!DOCTYPE html><title>Worker threw exception</title>', {
      status: 500,
      headers: { 'content-type': 'text/html; charset=utf-8' }
    })

    await expect(readAdminErrorMessage(response)).resolves.toBe('后台接口请求失败（HTTP 500）。请检查 Cloudflare Pages Functions 日志。')
  })

  it('uses API JSON error messages when available', async () => {
    const response = new Response(JSON.stringify({
      ok: false,
      error: { code: 'server_error', message: '后台 Access 配置缺失。' }
    }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    })

    await expect(readAdminErrorMessage(response)).resolves.toBe('后台 Access 配置缺失。')
  })
})
