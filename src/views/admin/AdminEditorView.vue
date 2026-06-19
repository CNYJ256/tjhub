<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminShell from '../../components/admin/AdminShell.vue'
import LinkProjectForm from '../../components/admin/LinkProjectForm.vue'
import { fetchAdminItem, saveAdminVersion } from '../../services/adminApi'

const route = useRoute()
const itemId = String(route.params.id)
const loading = ref(true)
const error = ref('')
const item = ref<any>(null)
const latestPayload = ref<Record<string, unknown>>({})

onMounted(async () => {
  try {
    const response = await fetchAdminItem(itemId)
    item.value = response.item
    const latest = (response.versions as any[])?.[0]
    latestPayload.value = latest?.payload_json ? JSON.parse(latest.payload_json) : {}
  } catch (err) {
    error.value = err instanceof Error ? err.message : '无法读取内容。'
  } finally {
    loading.value = false
  }
})

async function save(payload: Record<string, unknown>) {
  await saveAdminVersion(itemId, {
    title: String(payload.title || '未命名内容'),
    description: String(payload.description || ''),
    payload
  })
}
</script>

<template>
  <AdminShell>
    <template #default>
      <p v-if="loading" class="text-sm text-slate-600">正在加载...</p>
      <p v-else-if="error" class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
      <template v-else-if="item">
        <LinkProjectForm v-if="item.type === 'link' || item.type === 'project'" :initial="latestPayload" @save="save" />
        <div v-else class="rounded border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
          此内容类型（{{ item.type }}）的编辑器即将支持。
        </div>
      </template>
    </template>
  </AdminShell>
</template>
