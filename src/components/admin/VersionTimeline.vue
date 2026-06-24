<script setup lang="ts">
defineProps<{ versions: any[]; itemId: string; rollingBackVersionId?: string | null; publishingVersionId?: string | null }>()
defineEmits<{
  publish: [versionId: string]
  rollback: [versionId: string]
}>()
</script>

<template>
  <section class="space-y-3">
    <article v-for="version in versions" :key="version.id" class="border border-slate-200 bg-white p-4">
      <div class="flex items-center justify-between">
        <div>
          <strong>版本 {{ version.version_number }}</strong>
          <span class="ml-2 text-sm text-slate-600">{{ version.status }}</span>
        </div>
        <div class="flex gap-2">
          <button
            v-if="version.status === 'approved'"
            type="button"
            :disabled="publishingVersionId === version.id"
            class="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
            @click="$emit('publish', version.id)"
          >
            {{ publishingVersionId === version.id ? '发布中...' : '发布' }}
          </button>
          <button
            v-if="version.status === 'approved'"
            type="button"
            :disabled="rollingBackVersionId === version.id"
            class="rounded bg-amber-600 px-3 py-1.5 text-sm text-white hover:bg-amber-700 disabled:opacity-50"
            @click="$emit('rollback', version.id)"
          >
            {{ rollingBackVersionId === version.id ? '回滚中...' : '回滚到此版本' }}
          </button>
        </div>
      </div>
      <p class="mt-2 text-sm text-slate-600">{{ version.title }}</p>
    </article>
  </section>
</template>
