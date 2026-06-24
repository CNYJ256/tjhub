<script setup lang="ts">
import type { LinkEntry, ProjectEntry } from '../../types/content'
import SourceBadge from './SourceBadge.vue'
import StatusBadge from './StatusBadge.vue'

defineProps<{ entry: LinkEntry | ProjectEntry }>()
</script>

<template>
  <article class="flex h-full flex-col rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-soft)]">
    <a class="flex-1 p-4 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-soft)]" :href="entry.url" target="_blank" rel="noreferrer">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="font-semibold text-[var(--color-text)]">{{ entry.title }}</h3>
        <SourceBadge :kind="entry.sourceKind" />
        <StatusBadge :status="entry.status" />
      </div>
      <p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">{{ entry.description }}</p>
    </a>
    <div class="border-t border-[var(--color-border)] p-3">
      <div v-if="'guideSlug' in entry && entry.guideSlug" class="grid grid-cols-2 gap-2">
        <a class="rounded-[var(--radius-control)] bg-[var(--color-accent)] px-3 py-2 text-center text-sm text-white hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]" :href="entry.url" target="_blank" rel="noreferrer">打开</a>
        <RouterLink class="rounded-[var(--radius-control)] border border-[var(--color-border)] px-3 py-2 text-center text-sm text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]" :to="`/guides/${entry.guideSlug}`">指南</RouterLink>
      </div>
      <a v-else class="block rounded-[var(--radius-control)] bg-[var(--color-accent)] px-3 py-2 text-center text-sm text-white hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]" :href="entry.url" target="_blank" rel="noreferrer">打开</a>
    </div>
  </article>
</template>
