<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminShell from '../../components/admin/AdminShell.vue'
import ContentTable from '../../components/admin/ContentTable.vue'
import { fetchAdminItems } from '../../services/adminApi'
import type { AdminItemListRow } from '../../types/admin'

const items = ref<AdminItemListRow[]>([])
const error = ref('')

onMounted(async () => {
  try {
    const response = await fetchAdminItems(undefined, 'pending')
    items.value = response.items
  } catch (err) {
    error.value = err instanceof Error ? err.message : '无法读取待审核内容。'
  }
})
</script>

<template>
  <AdminShell>
    <template #default>
      <h1 class="text-2xl font-semibold">审核</h1>
      <p class="mt-1 text-sm text-slate-600">处理编辑者提交的待审核版本。</p>
      <p v-if="error" class="mt-4 text-sm text-red-700">{{ error }}</p>
      <ContentTable v-else class="mt-4" :items="items" />
    </template>
  </AdminShell>
</template>
