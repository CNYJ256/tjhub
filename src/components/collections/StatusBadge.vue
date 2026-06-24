<script setup lang="ts">
import type { EntryStatus } from '../../types/content'

const labels: Record<EntryStatus, string> = {
  active: '可用',
  stale: '待复核',
  unavailable: '不可用',
  archived: '已归档'
}

defineProps<{ status: EntryStatus }>()
</script>

<template>
  <span
    class="rounded-[var(--radius-control)] border px-2 py-0.5 text-xs"
    :class="status === 'active'
      ? 'border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
      : status === 'stale'
        ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
        : status === 'unavailable'
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-muted)]'"
  >
    {{ labels[status] }}
  </span>
</template>
