<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const items = [
  ['仪表盘', '/admin'],
  ['页面', '/admin/pages'],
  ['导航链接', '/admin/links'],
  ['指南', '/admin/guides'],
  ['项目', '/admin/projects'],
  ['分类', '/admin/categories'],
  ['轮播', '/admin/banners'],
  ['媒体库', '/admin/media'],
  ['审核', '/admin/review'],
  ['发布记录', '/admin/publish-events'],
  ['用户与角色', '/admin/users']
]

function isActive(href: string) {
  return route.path === href
}
</script>

<template>
  <nav class="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
    <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-[var(--space-page-x)] py-3">
      <RouterLink
        v-for="[label, href] in items"
        :key="href"
        :to="href"
        class="whitespace-nowrap rounded-[var(--radius-control)] px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
        :class="isActive(href) ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)]'"
      >
        {{ label }}
      </RouterLink>
    </div>
  </nav>
</template>
