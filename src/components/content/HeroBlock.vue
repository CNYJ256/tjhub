<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-12">
    <h1 class="text-4xl font-semibold tracking-normal text-slate-950">{{ title }}</h1>
    <p v-if="description" class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{{ description }}</p>
  </section>
</template>
