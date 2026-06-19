<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminShell from '../../components/admin/AdminShell.vue'
import BlockEditor from '../../components/admin/BlockEditor.vue'
import LinkProjectForm from '../../components/admin/LinkProjectForm.vue'
import { fetchAdminItem, saveAdminVersion } from '../../services/adminApi'

const route = useRoute()
const itemId = String(route.params.id)
const loading = ref(true)
const error = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
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
  message.value = ''
  try {
    await saveAdminVersion(itemId, {
      title: String(payload.title || '未命名内容'),
      description: String(payload.description || ''),
      payload
    })
    message.value = '保存成功。'
    messageType.value = 'success'
  } catch (err) {
    message.value = err instanceof Error ? err.message : '保存失败。'
    messageType.value = 'error'
  }
}
</script>

<template>
  <AdminShell>
    <template #default>
      <p v-if="loading" class="text-sm text-slate-600">正在加载...</p>
      <p v-else-if="error" class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
      <template v-else-if="item">
        <p v-if="message" :class="messageType === 'success' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'" class="rounded border px-4 py-3 text-sm">{{ message }}</p>
        <BlockEditor v-if="['page', 'guide', 'banner', 'category'].includes(item?.type)" :initial="latestPayload" @save="save" />
        <LinkProjectForm v-else :initial="latestPayload" @save="save" />
      </template>
    </template>
  </AdminShell>
</template>
