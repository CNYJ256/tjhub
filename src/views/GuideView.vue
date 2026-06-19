<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageShell from '../components/layout/PageShell.vue'
import ContentRenderer from '../components/content/ContentRenderer.vue'
import { findGuide } from '../services/content'

const route = useRoute()
const guide = computed(() => findGuide(String(route.params.slug)))
</script>

<template>
  <PageShell>
    <ContentRenderer v-if="guide" :page="guide" />
    <section v-else class="mx-auto max-w-3xl px-4 py-24">
      <h1 class="text-3xl font-semibold">指南不存在</h1>
      <p class="mt-4 text-slate-600">这个指南暂时没有内容，或链接已经变更。</p>
    </section>
  </PageShell>
</template>
