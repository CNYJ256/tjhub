<script setup lang="ts">
import type { PageContent } from '../../types/content'
import BlockRenderer from './BlockRenderer.vue'
import MarkdownBlock from './MarkdownBlock.vue'

defineProps<{ page: PageContent }>()
</script>

<template>
  <BlockRenderer v-for="(block, index) in page.blocks" :key="`${block.type}-${index}`" :block="block" />
  <section v-if="page.html" class="mx-auto max-w-4xl px-4 py-10">
    <MarkdownBlock :html="page.html" />
  </section>
</template>
