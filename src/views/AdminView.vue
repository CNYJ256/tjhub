<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import PageShell from '../components/layout/PageShell.vue'
import ContentRenderer from '../components/content/ContentRenderer.vue'
import { findPage } from '../services/content'

const page = findPage('admin')
let meta: HTMLMetaElement | undefined

onMounted(() => {
  meta = document.createElement('meta')
  meta.name = 'robots'
  meta.content = 'noindex,nofollow'
  document.head.appendChild(meta)
})

onUnmounted(() => {
  meta?.remove()
})
</script>

<template>
  <PageShell>
    <ContentRenderer v-if="page" :page="page" />
  </PageShell>
</template>
