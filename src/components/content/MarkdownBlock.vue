<script setup lang="ts">
defineProps<{ html: string }>()
</script>

<template>
  <div class="prose prose-slate max-w-none" v-html="html" />
</template>
