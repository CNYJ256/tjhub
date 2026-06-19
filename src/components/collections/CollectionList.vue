<script setup lang="ts">
import type { LinkEntry, ProjectEntry } from '../../types/content'
import CollectionCard from './CollectionCard.vue'

defineProps<{ entries: Array<LinkEntry | ProjectEntry> }>()
</script>

<template>
  <div v-if="entries.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <CollectionCard v-for="entry in entries" :key="entry.slug" :entry="entry" />
  </div>
  <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
    没有找到匹配的内容。
  </div>
</template>
