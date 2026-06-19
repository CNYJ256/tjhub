<script setup lang="ts">
import { computed } from 'vue'
import PageShell from '../components/layout/PageShell.vue'
import ContentRenderer from '../components/content/ContentRenderer.vue'
import { findRuntimePage } from '../services/contentStore'

const page = computed(() => findRuntimePage('home'))
</script>

<template>
  <PageShell>
    <ContentRenderer v-if="page" :page="page" />
    <section v-else class="mx-auto max-w-3xl px-4 py-24">首页暂不可用。</section>
  </PageShell>
</template>
