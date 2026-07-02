<script setup lang="ts">
import { computed } from 'vue'
import { contentState } from '../../services/contentStore'
import CollectionList from '../collections/CollectionList.vue'

const props = defineProps<{
  title?: string
  collection?: 'links' | 'projects' | 'guides'
  placement?: string
  limit?: number
}>()

const entries = computed(() => {
  const source = props.collection === 'projects' ? contentState.index.projects : contentState.index.links

  const filtered = props.placement
    ? source.filter((entry) => entry.placements.includes(props.placement!))
    : source

  const sorted = [...filtered].sort((a, b) => b.priority - a.priority)

  return props.limit != null ? sorted.slice(0, props.limit) : sorted
})

const guideEntries = computed(() => {
  if (props.collection !== 'guides') return []

  const sorted = [...contentState.index.guides].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
  return props.limit != null ? sorted.slice(0, props.limit) : sorted
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-[var(--space-page-x)] py-10">
    <div v-if="title" class="mb-5 flex items-end justify-between gap-4">
      <h2 class="text-2xl font-semibold tracking-normal text-[var(--color-text)]">{{ title }}</h2>
    </div>
    <div v-if="props.collection === 'guides' && guideEntries.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="entry in guideEntries"
        :key="entry.slug"
        class="flex h-full flex-col rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-soft)] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-soft)]"
        :to="`/guides/${entry.slug}`"
      >
        <h3 class="font-semibold text-[var(--color-text)]">{{ entry.title }}</h3>
        <p v-if="entry.description" class="mt-2 text-sm leading-6 text-[var(--color-muted)]">{{ entry.description }}</p>
        <span class="mt-4 text-sm font-medium text-[var(--color-accent)]">查看指南</span>
      </RouterLink>
    </div>
    <div v-else-if="props.collection === 'guides'" class="rounded-[var(--radius-panel)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-muted)]">
      没有找到匹配的内容。
    </div>
    <CollectionList v-else :entries="entries" />
  </section>
</template>
