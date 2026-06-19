<script setup lang="ts">
import PageShell from '../components/layout/PageShell.vue'
import CollectionList from '../components/collections/CollectionList.vue'
import { contentIndex } from '../services/content'
</script>

<template>
  <PageShell>
    <section class="mx-auto max-w-6xl px-4 py-10">
      <h1 class="text-3xl font-semibold">学生项目</h1>
      <p class="mt-3 text-slate-600">这里展示学生维护的项目和友链，非官方项目会明确标注。</p>
      <div class="mt-8">
        <CollectionList :entries="contentIndex.projects" />
      </div>
    </section>
  </PageShell>
</template>
