<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminShell from '../../components/admin/AdminShell.vue'
import { fetchAdminPublishEvents } from '../../services/adminApi'
import type { AdminPublishEventDto } from '../../types/admin'

const events = ref<AdminPublishEventDto[]>([])
const loading = ref(true)
const error = ref('')

function actionLabel(action: AdminPublishEventDto['action']) {
  return action === 'rollback' ? '回滚' : '发布'
}

function formatTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetchAdminPublishEvents()
    events.value = response.events
  } catch (err) {
    error.value = err instanceof Error ? err.message : '无法读取发布记录。'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AdminShell>
    <template #default>
      <h1 class="text-2xl font-semibold">发布记录</h1>
      <p class="mt-1 text-sm text-slate-600">查看最近发布和回滚的内容版本。</p>

      <p v-if="loading" class="mt-4 text-sm text-slate-600">正在加载发布记录...</p>
      <p v-else-if="error" class="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error || '无法读取发布记录。' }}
      </p>

      <div v-else-if="events.length" class="mt-4 space-y-3">
        <article v-for="event in events" :key="event.id" class="border border-slate-200 bg-white p-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span
                  :class="event.action === 'rollback' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
                  class="rounded px-2 py-1 text-xs font-medium"
                >
                  {{ actionLabel(event.action) }}
                </span>
                <strong>{{ event.itemTitle }}</strong>
                <span class="text-sm text-slate-500">{{ event.itemType }} · {{ event.itemSlug }}</span>
              </div>
              <p class="mt-2 text-sm text-slate-600">
                目标版本：{{ event.toVersionId }}
                <span v-if="event.fromVersionId"> · 上一版本：{{ event.fromVersionId }}</span>
              </p>
              <p class="mt-1 text-sm text-slate-600">
                操作者：{{ event.actorName || event.actorEmail || '未知用户' }} · {{ formatTime(event.createdAt) }}
              </p>
              <p v-if="event.note" class="mt-2 text-sm text-slate-700">备注：{{ event.note }}</p>
            </div>
            <RouterLink :to="`/admin/items/${event.itemId}`" class="rounded border px-3 py-2 text-sm hover:bg-slate-50">
              查看内容
            </RouterLink>
          </div>
        </article>
      </div>

      <p v-else class="mt-4 text-sm text-slate-600">暂无发布记录。</p>
    </template>
  </AdminShell>
</template>
