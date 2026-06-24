<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import SourceBadge from '../collections/SourceBadge.vue'
import StatusBadge from '../collections/StatusBadge.vue'
import { contentState } from '../../services/contentStore'
import { selectHomeQuickEntries } from '../../services/homeQuickEntries'

defineProps<{ title?: string; description?: string }>()

const router = useRouter()
const query = ref('')
const quickEntries = computed(() => selectHomeQuickEntries(contentState.index.links))

function submitSearch() {
  const q = query.value.trim()
  router.push({ path: '/nav', query: q ? { q } : {} })
}
</script>

<template>
  <section class="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-8 px-[var(--space-page-x)] py-10 lg:grid-cols-[1fr_1.05fr] lg:py-12">
    <div>
      <h1 class="text-4xl font-semibold tracking-normal text-[var(--color-text)] sm:text-5xl">{{ title }}</h1>
      <p v-if="description" class="mt-4 max-w-xl text-lg leading-8 text-[var(--color-text-soft)]">{{ description }}</p>
      <form class="mt-8 flex flex-col gap-3 sm:flex-row" @submit.prevent="submitSearch">
        <input
          v-model="query"
          class="min-h-12 flex-1 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-base text-[var(--color-text)] shadow-sm outline-none transition focus:border-[var(--color-focus)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
          placeholder="搜索选课、校园网、打印、VPN"
        />
        <button class="min-h-12 rounded-[var(--radius-control)] bg-[var(--color-accent)] px-5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-soft)]" type="submit">
          搜索入口
        </button>
      </form>
      <p class="mt-4 text-sm text-[var(--color-muted)]">非官方学生维护入口，优先整理常用系统、工具与指南。</p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <a
        v-for="entry in quickEntries"
        :key="entry.slug"
        class="group rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-soft)] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-soft)]"
        :href="entry.url"
        target="_blank"
        rel="noreferrer"
      >
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-base font-semibold text-[var(--color-text)]">{{ entry.title }}</h2>
          <SourceBadge :kind="entry.sourceKind" />
          <StatusBadge :status="entry.status" />
        </div>
        <p class="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">{{ entry.description }}</p>
        <span class="mt-3 inline-flex text-sm font-medium text-[var(--color-accent)] group-hover:text-[var(--color-accent-hover)]">打开入口</span>
      </a>
    </div>
  </section>
</template>
