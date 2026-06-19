<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AdminShell from '../../components/admin/AdminShell.vue'
import ContentTable from '../../components/admin/ContentTable.vue'
import { fetchAdminItems } from '../../services/adminApi'
import type { AdminItemListRow } from '../../types/admin'

const props = defineProps<{ type?: string; title: string }>()
const loading = ref(true)
const error = ref('')
const items = ref<AdminItemListRow[]>([])

async function loadItems() {
  loading.value = true
  error.value = ''
  try {
    const response = await fetchAdminItems(props.type)
    items.value = response.items
  } catch (err) {
    error.value = err instanceof Error ? err.message : '无法读取内容列表。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadItems()
})

watch(() => props.type, () => {
  loadItems()
})
</script>

<template>
  <AdminShell>
    <template #default>
      <header class="mb-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold">{{ title }}</h1>
          <p class="mt-1 text-sm text-slate-600">管理内容、版本和审核状态。</p>
        </div>
      </header>
      <p v-if="loading" class="text-sm text-slate-600">正在加载...</p>
      <p v-else-if="error" class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
      <ContentTable v-else :items="items" />
    </template>
  </AdminShell>
</template>
