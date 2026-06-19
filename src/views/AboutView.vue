<script setup lang="ts">
import PageShell from '../components/layout/PageShell.vue'
import ContentRenderer from '../components/content/ContentRenderer.vue'
import { findPage } from '../services/content'

const page = findPage('about')
</script>

<template>
  <PageShell>
    <ContentRenderer v-if="page" :page="page" />
    <section v-else class="mx-auto max-w-3xl px-4 py-24">关于页面暂不可用。</section>
  </PageShell>
</template>
