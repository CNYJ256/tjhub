import type { LinkEntry } from '../types/content'

export function selectHomeQuickEntries(entries: LinkEntry[], limit = 6): LinkEntry[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => {
      const aHome = a.entry.placements.includes('home') ? 1 : 0
      const bHome = b.entry.placements.includes('home') ? 1 : 0
      if (aHome !== bHome) return bHome - aHome

      const aFeatured = a.entry.featured ? 1 : 0
      const bFeatured = b.entry.featured ? 1 : 0
      if (aFeatured !== bFeatured) return bFeatured - aFeatured

      if (a.entry.priority !== b.entry.priority) return b.entry.priority - a.entry.priority

      return a.index - b.index
    })
    .slice(0, limit)
    .map(({ entry }) => entry)
}
