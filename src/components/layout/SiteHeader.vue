<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')

function submitSearch() {
  const q = query.value.trim()
  router.push({ path: '/nav', query: q ? { q } : {} })
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
      <RouterLink to="/" class="text-lg font-semibold text-slate-950">TJHub</RouterLink>
      <form class="hidden flex-1 md:block" @submit.prevent="submitSearch">
        <input
          v-model="query"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="搜索网站、工具、指南"
        />
      </form>
      <nav class="hidden items-center gap-4 text-sm text-slate-700 md:flex">
        <RouterLink to="/nav?category=official">官方网站</RouterLink>
        <RouterLink to="/nav?category=tools">常用工具</RouterLink>
        <RouterLink to="/freshman">新生指南</RouterLink>
        <RouterLink to="/projects">学生项目</RouterLink>
        <RouterLink to="/contribute">参与共建</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
    </div>
  </header>
</template>
