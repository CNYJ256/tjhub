<script setup lang="ts">
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
</script>

<template>
  <nav class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
      <RouterLink
        v-for="[label, href] in items"
        :key="href"
        :to="href"
        class="whitespace-nowrap rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        {{ label }}
      </RouterLink>
    </div>
  </nav>
</template>
