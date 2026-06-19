<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminShell from '../../components/admin/AdminShell.vue'
import { createAdminItem } from '../../services/adminApi'

const route = useRoute()
const router = useRouter()
const type = String(route.query.type || 'link')
const slug = ref('')
const title = ref('')
const error = ref('')
const loading = ref(false)

const typeLabel: Record<string, string> = {
  page: '页面',
  link: '导航链接',
  guide: '指南',
  project: '项目',
  category: '分类',
  banner: '轮播'
}

async function create() {
  if (!slug.value.trim() || !title.value.trim()) {
    error.value = 'slug 和标题不能为空。'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const result = await createAdminItem({
      type,
      slug: slug.value.trim(),
      title: title.value.trim(),
      payload: {}
    })
    router.push(`/admin/items/${result.itemId}`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '创建失败。'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminShell>
    <template #default>
      <h1 class="text-2xl font-semibold">新建{{ typeLabel[type] || type }}</h1>
      <form class="mt-4 max-w-lg space-y-4" @submit.prevent="create">
        <label class="block text-sm">
          标题
          <input v-model="title" class="mt-1 w-full rounded border px-3 py-2" placeholder="输入标题" />
        </label>
        <label class="block text-sm">
          Slug
          <input v-model="slug" class="mt-1 w-full rounded border px-3 py-2" placeholder="输入唯一标识符" />
        </label>
        <p v-if="error" class="text-sm text-red-700">{{ error }}</p>
        <button type="submit" :disabled="loading" class="rounded bg-slate-950 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50">
          {{ loading ? '创建中...' : '创建并编辑' }}
        </button>
      </form>
    </template>
  </AdminShell>
</template>
