import type { BannerEntry, PageBlock } from '../types/content'

export interface BannerBlockProps {
  title?: string
  description?: string
  imageUrl?: string
  primaryLink?: string
  secondaryLink?: string
}

function blockToBannerProps(block: PageBlock): BannerBlockProps {
  return {
    title: block.title,
    description: block.description,
    imageUrl: block.imageUrl,
    primaryLink: block.primaryLink,
    secondaryLink: block.secondaryLink
  }
}

export function resolveBannerBlock(block: PageBlock, banners: BannerEntry[]): BannerBlockProps {
  if (block.source !== 'banners') {
    return blockToBannerProps(block)
  }

  const banner = [...banners].sort((a, b) => b.priority - a.priority)[0]
  if (!banner) {
    return blockToBannerProps(block)
  }

  return {
    title: banner.title,
    description: banner.description,
    imageUrl: banner.imageUrl,
    primaryLink: banner.primaryLink,
    secondaryLink: banner.secondaryLink
  }
}
