<script setup lang="ts">
import type { LinkEntry, ProjectEntry } from '../../types/content'
import SourceBadge from './SourceBadge.vue'
import StatusBadge from './StatusBadge.vue'

defineProps<{ entry: LinkEntry | ProjectEntry }>()
</script>

<template>
  <article class="flex h-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
    <a class="flex-1 p-4 hover:bg-slate-50" :href="entry.url" target="_blank" rel="noreferrer">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-slate-950">{{ entry.title }}</h3>
        <SourceBadge :kind="entry.sourceKind" />
        <StatusBadge :status="entry.status" />
      </div>
      <p class="mt-2 text-sm leading-6 text-slate-600">{{ entry.description }}</p>
    </a>
    <div class="border-t border-slate-200 p-3">
      <div v-if="'guideSlug' in entry && entry.guideSlug" class="grid grid-cols-2 gap-2">
        <a class="rounded-md bg-slate-950 px-3 py-2 text-center text-sm text-white" :href="entry.url" target="_blank" rel="noreferrer">打开</a>
        <RouterLink class="rounded-md border border-slate-300 px-3 py-2 text-center text-sm" :to="`/guides/${entry.guideSlug}`">指南</RouterLink>
      </div>
      <a v-else class="block rounded-md bg-slate-950 px-3 py-2 text-center text-sm text-white" :href="entry.url" target="_blank" rel="noreferrer">打开</a>
    </div>
  </article>
</template>
