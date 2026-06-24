<script setup lang="ts">
import type { SourceKind } from '../../types/content'

const labels: Record<SourceKind, string> = {
  official: '官方',
  student: '学生项目',
  third_party: '第三方',
  internal: '站内'
}

defineProps<{ kind: SourceKind }>()
</script>

<template>
  <span class="rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-2 py-0.5 text-xs text-[var(--color-muted)]">{{ labels[kind] }}</span>
</template>
