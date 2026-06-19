<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AdminShell from '../components/admin/AdminShell.vue'

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
  <AdminShell>
    <template #default>
      <section>
        <h1 class="text-2xl font-semibold">仪表盘</h1>
        <p class="mt-2 text-sm text-slate-600">查看内容状态、待审核事项和最近发布记录。</p>
      </section>
    </template>
  </AdminShell>
</template>
