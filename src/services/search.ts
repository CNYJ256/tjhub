import type { LinkEntry, ProjectEntry } from '../types/content'

type SearchableEntry = LinkEntry | ProjectEntry

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function haystack(entry: SearchableEntry): string {
  return [
    entry.title,
    entry.description,
    entry.category,
    ...entry.tags,
    ...entry.aliases,
    entry.body
  ]
    .join(' ')
    .toLowerCase()
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
