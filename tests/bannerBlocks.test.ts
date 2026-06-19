import { describe, expect, it } from 'vitest'
import { resolveBannerBlock } from '../src/services/bannerBlocks'
import type { BannerEntry, PageBlock } from '../src/types/content'

describe('resolveBannerBlock', () => {
  it('uses the highest priority published banner when the block source is banners', () => {
    const block: PageBlock = { type: 'banner', source: 'banners', title: '备用标题' }
    const banners: BannerEntry[] = [
      { type: 'banner', slug: 'low', title: '低优先级', description: '低', priority: 1 },
      { type: 'banner', slug: 'high', title: '高优先级', description: '高', imageUrl: '/hero.png', primaryLink: '/nav', priority: 10 }
    ]

    expect(resolveBannerBlock(block, banners)).toMatchObject({
      title: '高优先级',
      description: '高',
      imageUrl: '/hero.png',
      primaryLink: '/nav'
    })
  })

  it('falls back to block fields when no published banner is available', () => {
    const block: PageBlock = { type: 'banner', source: 'banners', title: '备用标题', description: '备用描述' }

    expect(resolveBannerBlock(block, [])).toMatchObject({
      title: '备用标题',
      description: '备用描述'
    })
  })
})
