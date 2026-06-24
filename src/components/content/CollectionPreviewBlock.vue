<script setup lang="ts">
import { computed } from 'vue'
import { contentState } from '../../services/contentStore'
import CollectionList from '../collections/CollectionList.vue'

const props = defineProps<{
  title?: string
  collection?: 'links' | 'projects'
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
</script>

<template>
  <section class="mx-auto max-w-6xl px-[var(--space-page-x)] py-10">
    <div v-if="title" class="mb-5 flex items-end justify-between gap-4">
      <h2 class="text-2xl font-semibold tracking-normal text-[var(--color-text)]">{{ title }}</h2>
    </div>
    <CollectionList :entries="entries" />
  </section>
</template>
