<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const query = ref('')
const menuOpen = ref(false)

const navItems = [
  { to: '/nav?category=official', label: '官方网站' },
  { to: '/nav?category=tools', label: '常用工具' },
  { to: '/freshman', label: '指南' },
  { to: '/projects', label: '学生项目' },
  { to: '/contribute', label: '参与共建' },
  { to: '/about', label: '关于' }
]

function isActive(to: string) {
  const path = to.split('?')[0]
  return route.path === path
}

function submitSearch() {
  const q = query.value.trim()
  router.push({ path: '/nav', query: q ? { q } : {} })
  menuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center gap-4 px-[var(--space-page-x)] py-3">
      <RouterLink to="/" class="rounded-[var(--radius-control)] px-1 text-lg font-semibold text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]">
        TJHub
      </RouterLink>
      <form class="hidden flex-1 md:block" @submit.prevent="submitSearch">
        <input
          v-model="query"
          class="w-full rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-focus)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
          placeholder="搜索网站、工具、指南"
        />
      </form>
      <nav class="hidden items-center gap-1 text-sm md:flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-[var(--radius-control)] px-3 py-2 text-[var(--color-text-soft)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
          :class="isActive(item.to) ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : ''"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <button
        class="ml-auto rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] md:hidden"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? '关闭' : '菜单' }}
      </button>
    </div>
    <div v-if="menuOpen" id="mobile-navigation" class="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-page-x)] py-4 md:hidden">
      <form @submit.prevent="submitSearch">
        <input
          v-model="query"
          class="w-full rounded-[var(--radius-control)] border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-focus)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
          placeholder="搜索网站、工具、指南"
        />
      </form>
      <nav class="mt-4 grid gap-2 text-sm">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          class="rounded-[var(--radius-control)] px-3 py-2 text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
          :class="isActive(item.to) ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : ''"
          :to="item.to"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
