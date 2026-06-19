<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminShell from '../../components/admin/AdminShell.vue'
import { fetchAdminItems, fetchAdminItem, reviewAdminVersion } from '../../services/adminApi'
import type { AdminItemListRow } from '../../types/admin'

const items = ref<AdminItemListRow[]>([])
const error = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const reviewNote = ref('')
const reviewingId = ref<string | null>(null)

onMounted(async () => {
  await loadItems()
})

async function loadItems() {
  try {
    const response = await fetchAdminItems(undefined, 'pending')
    items.value = response.items
  } catch (err) {
    error.value = err instanceof Error ? err.message : '无法读取待审核内容。'
  }
}

async function review(itemId: string, action: 'approve' | 'reject') {
  const detail = await fetchAdminItem(itemId)
  const pendingVersion = ((detail.versions as any[]) || []).find((v: any) => v.status === 'pending')
  if (!pendingVersion) {
    message.value = '未找到待审核版本。'
    messageType.value = 'error'
    return
  }
  if (action === 'reject' && !reviewNote.value.trim()) {
    message.value = '拒绝审核必须填写原因。'
    messageType.value = 'error'
    return
  }
  try {
    await reviewAdminVersion(pendingVersion.id, action, reviewNote.value)
    message.value = action === 'approve' ? '已批准。' : '已拒绝。'
    messageType.value = 'success'
    reviewNote.value = ''
    reviewingId.value = null
    await loadItems()
  } catch (err) {
    message.value = err instanceof Error ? err.message : '审核操作失败。'
    messageType.value = 'error'
  }
}
</script>

<template>
  <AdminShell>
    <template #default>
      <h1 class="text-2xl font-semibold">审核</h1>
      <p class="mt-1 text-sm text-slate-600">处理编辑者提交的待审核版本。</p>
      <p v-if="error" class="mt-4 text-sm text-red-700">{{ error }}</p>
      <p v-if="message" :class="messageType === 'success' ? 'mt-4 text-green-700 bg-green-50 border-green-200' : 'mt-4 text-red-700 bg-red-50 border-red-200'" class="rounded border px-4 py-3 text-sm">{{ message }}</p>

      <!-- Review controls -->
      <div v-if="reviewingId" class="mt-4 flex items-center gap-2">
        <input v-model="reviewNote" class="flex-1 rounded border px-3 py-2 text-sm" placeholder="审核意见（拒绝时必填）" />
        <button class="rounded bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700" @click="review(reviewingId!, 'approve')">批准</button>
        <button class="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700" @click="review(reviewingId!, 'reject')">拒绝</button>
        <button class="rounded border px-4 py-2 text-sm" @click="reviewingId = null">取消</button>
      </div>

      <div v-if="items.length" class="mt-4 space-y-3">
        <article v-for="item in items" :key="item.id" class="flex items-center justify-between border border-slate-200 bg-white p-4">
          <div>
            <strong>{{ item.current_title || '未命名内容' }}</strong>
            <span class="ml-2 text-sm text-slate-600">{{ item.type }} · {{ item.slug }}</span>
          </div>
          <div class="flex gap-2">
            <RouterLink :to="`/admin/items/${item.id}`" class="rounded border px-3 py-2 text-sm hover:bg-slate-50">详情</RouterLink>
            <button class="rounded bg-slate-950 px-3 py-2 text-sm text-white hover:bg-slate-800" @click="reviewingId = item.id">审核</button>
          </div>
        </article>
      </div>
      <p v-else-if="!error" class="mt-4 text-sm text-slate-600">暂无待审核内容。</p>
    </template>
  </AdminShell>
</template>
