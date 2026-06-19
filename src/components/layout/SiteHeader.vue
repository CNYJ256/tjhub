<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')
const menuOpen = ref(false)

const navItems = [
  { to: '/nav?category=official', label: '官方网站' },
  { to: '/nav?category=tools', label: '常用工具' },
  { to: '/freshman', label: '新生指南' },
  { to: '/projects', label: '学生项目' },
  { to: '/contribute', label: '参与共建' },
  { to: '/about', label: '关于' }
]

function submitSearch() {
  const q = query.value.trim()
  router.push({ path: '/nav', query: q ? { q } : {} })
  menuOpen.value = false
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
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
      </nav>
      <button
        class="ml-auto rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 md:hidden"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? '关闭' : '菜单' }}
      </button>
    </div>
    <div v-if="menuOpen" id="mobile-navigation" class="border-t border-slate-200 px-4 py-4 md:hidden">
      <form @submit.prevent="submitSearch">
        <input
          v-model="query"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="搜索网站、工具、指南"
        />
      </form>
      <nav class="mt-4 grid gap-2 text-sm text-slate-700">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          class="rounded-md px-2 py-2 hover:bg-slate-100"
          :to="item.to"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
