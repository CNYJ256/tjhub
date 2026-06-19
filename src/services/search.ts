import type { LinkEntry, ProjectEntry } from '../types/content'
import { contentState } from './contentStore'

type SearchableEntry = LinkEntry | ProjectEntry

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function haystack(entry: SearchableEntry): string {
  const categoryLabel = contentState.index.categories[entry.category]?.label ?? entry.category
  const parts = [
    entry.title,
    entry.description,
    entry.category,
    categoryLabel,
    ...entry.tags,
    ...entry.aliases,
    entry.body
  ]

  if ('guideSlug' in entry && entry.guideSlug) {
    const guide = contentState.index.guides.find(g => g.slug === entry.guideSlug)
    if (guide) {
      parts.push(guide.title)
    }
  }

  return parts.join(' ').toLowerCase()
}

export function searchEntries<T extends SearchableEntry>(entries: T[], query: string): T[] {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return entries
  }

  return entries.filter((entry) => haystack(entry).includes(normalizedQuery))
}

export function searchLinks(entries: LinkEntry[], query: string): LinkEntry[] {
  return searchEntries(entries, query)
}

export function searchProjects(entries: ProjectEntry[], query: string): ProjectEntry[] {
  return searchEntries(entries, query)
}
