<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <section class="mx-auto max-w-6xl px-4">
    <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-xl font-semibold text-slate-950">{{ title }}</h2>
      <p v-if="description" class="mt-2 text-slate-600">{{ description }}</p>
    </div>
  </section>
</template>
