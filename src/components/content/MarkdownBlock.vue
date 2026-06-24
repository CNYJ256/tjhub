<script setup lang="ts">
defineProps<{ html: string }>()
</script>

<template>
  <div class="prose prose-slate max-w-none text-[var(--color-text-soft)] prose-headings:text-[var(--color-text)] prose-a:text-[var(--color-accent)]" v-html="html" />
</template>
