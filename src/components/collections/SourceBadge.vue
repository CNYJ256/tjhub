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
  <span class="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600">{{ labels[kind] }}</span>
</template>
