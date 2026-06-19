import { reactive } from 'vue'
import type { ContentIndex, PublicContentSnapshot } from '../types/content'
import { fetchRemoteContent } from './remoteContent'
import { staticContentIndex } from './staticContent'

interface ContentState {
  source: 'static' | 'api'
  loading: boolean
  error: string
  index: ContentIndex
  version?: number
}

export const contentState = reactive<ContentState>({
  source: 'static',
  loading: false,
  error: '',
  index: staticContentIndex
})

function snapshotToIndex(snapshot: PublicContentSnapshot): ContentIndex {
  return {
    pages: snapshot.pages,
    guides: snapshot.guides,
    links: snapshot.links,
    projects: snapshot.projects,
    categories: snapshot.categories,
    banners: snapshot.banners
  }
}

export async function loadRuntimeContent(): Promise<void> {
  contentState.loading = true
  try {
    const snapshot = await fetchRemoteContent()
    contentState.index = snapshotToIndex(snapshot)
    contentState.version = snapshot.version
    contentState.source = 'api'
    contentState.error = ''
  } catch (error) {
    contentState.index = staticContentIndex
    contentState.source = 'static'
    contentState.error = error instanceof Error ? error.message : '公开内容接口不可用。'
  } finally {
    contentState.loading = false
  }
}

export function findRuntimePage(slug: string) {
  return contentState.index.pages.find((page) => page.slug === slug)
}

export function findRuntimeGuide(slug: string) {
  return contentState.index.guides.find((guide) => guide.slug === slug)
}
