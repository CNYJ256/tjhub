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
  <span class="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600">{{ labels[status] }}</span>
</template>
