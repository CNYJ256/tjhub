<script setup lang="ts">
import PageShell from '../components/layout/PageShell.vue'
</script>

<template>
  <PageShell>
    <section class="mx-auto max-w-3xl px-4 py-24">
      <h1 class="text-3xl font-semibold">页面不存在</h1>
      <p class="mt-4 text-slate-600">你访问的页面暂时没有内容，或链接已经变更。</p>
      <RouterLink class="mt-8 inline-flex rounded-md bg-slate-950 px-4 py-2 text-white" to="/">
        返回首页
      </RouterLink>
    </section>
  </PageShell>
</template>
