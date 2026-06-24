<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminShell from '../../components/admin/AdminShell.vue'
import BlockEditor from '../../components/admin/BlockEditor.vue'
import LinkProjectForm from '../../components/admin/LinkProjectForm.vue'
import VersionTimeline from '../../components/admin/VersionTimeline.vue'
import { fetchAdminItem, saveAdminVersion, submitAdminVersion, reviewAdminVersion, publishAdminItem, rollbackAdminItem } from '../../services/adminApi'

const route = useRoute()
const router = useRouter()
const itemId = String(route.params.id)
const loading = ref(true)
const error = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const item = ref<any>(null)
const versions = ref<any[]>([])
const latestPayload = ref<Record<string, unknown>>({})
const saving = ref(false)
const submitting = ref(false)
const reviewingAction = ref<'approve' | 'reject' | null>(null)
const publishingVersionId = ref<string | null>(null)
const rollingBackVersionId = ref<string | null>(null)

async function loadItem() {
  loading.value = true
  error.value = ''
  try {
    const response = await fetchAdminItem(itemId)
    item.value = response.item
    versions.value = (response.versions as any[]) || []
    const latest = versions.value[0]
    latestPayload.value = latest?.payload_json ? JSON.parse(latest.payload_json) : {}
  } catch (err) {
    error.value = err instanceof Error ? err.message : '无法读取内容。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadItem()
})

async function save(payload: Record<string, unknown>) {
  if (saving.value) return
  saving.value = true
  message.value = ''
  try {
    await saveAdminVersion(itemId, {
      title: String(payload.title || '未命名内容'),
      description: String(payload.description || ''),
      payload
    })
    message.value = '新版本已保存。'
    messageType.value = 'success'
    await loadItem()
  } catch (err) {
    message.value = err instanceof Error ? err.message : '保存失败。'
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

async function submit() {
  if (submitting.value) return
  const toSubmit = versions.value[0]
  if (!toSubmit) return
  submitting.value = true
  message.value = ''
  try {
    await submitAdminVersion(toSubmit.id)
    message.value = '已提交审核。'
    messageType.value = 'success'
    await loadItem()
  } catch (err) {
    message.value = err instanceof Error ? err.message : '提交失败。'
    messageType.value = 'error'
  } finally {
    submitting.value = false
  }
}

const reviewNote = ref('')
async function review(action: 'approve' | 'reject') {
  if (reviewingAction.value) return
  const toReview = versions.value.find((v: any) => v.status === 'pending')
  if (!toReview) return
  if (action === 'reject' && !reviewNote.value.trim()) {
    message.value = '拒绝审核必须填写原因。'
    messageType.value = 'error'
    return
  }
  reviewingAction.value = action
  message.value = ''
  try {
    await reviewAdminVersion(toReview.id, action, reviewNote.value)
    message.value = action === 'approve' ? '已批准。' : '已拒绝。'
    messageType.value = 'success'
    reviewNote.value = ''
    await loadItem()
  } catch (err) {
    message.value = err instanceof Error ? err.message : '审核操作失败。'
    messageType.value = 'error'
  } finally {
    reviewingAction.value = null
  }
}

async function publishVersion(versionId: string) {
  if (publishingVersionId.value) return
  publishingVersionId.value = versionId
  message.value = ''
  try {
    await publishAdminItem(itemId, versionId)
    message.value = '已发布。公开站点将显示更新后的内容。'
    messageType.value = 'success'
    await loadItem()
  } catch (err) {
    message.value = err instanceof Error ? err.message : '发布失败。'
    messageType.value = 'error'
  } finally {
    publishingVersionId.value = null
  }
}

async function rollbackToVersion(versionId: string) {
  if (rollingBackVersionId.value) return
  rollingBackVersionId.value = versionId
  message.value = ''
  try {
    await rollbackAdminItem(itemId, versionId)
    message.value = '已回滚。'
    messageType.value = 'success'
    await loadItem()
  } catch (err) {
    message.value = err instanceof Error ? err.message : '回滚失败。'
    messageType.value = 'error'
  } finally {
    rollingBackVersionId.value = null
  }
}

const showEditor = ref(true)
</script>

<template>
  <AdminShell>
    <template #default="{ user }">
      <p v-if="loading" class="text-sm text-slate-600">正在加载...</p>
      <p v-else-if="error" class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
      <template v-else-if="item">
        <!-- Item header -->
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold">{{ item.slug }}</h1>
            <p class="text-sm text-slate-600">类型：{{ item.type }} · 状态：{{ versions[0]?.status || '未保存' }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" class="rounded border px-3 py-2 text-sm" @click="showEditor = !showEditor">
              {{ showEditor ? '查看版本历史' : '编辑内容' }}
            </button>
            <RouterLink to="/admin" class="rounded border px-3 py-2 text-sm">返回</RouterLink>
          </div>
        </div>

        <p v-if="message" :class="messageType === 'success' ? 'mb-4 text-green-700 bg-green-50 border-green-200' : 'mb-4 text-red-700 bg-red-50 border-red-200'" class="rounded border px-4 py-3 text-sm">{{ message }}</p>

        <!-- Workflow actions based on version status -->
        <div class="mb-4 flex flex-wrap items-center gap-2 rounded border border-slate-200 bg-white p-3">
          <span class="text-sm font-medium text-slate-700">操作：</span>

          <!-- Submit: draft/rejected → submit for review -->
          <button
            v-if="versions[0] && (versions[0].status === 'draft' || versions[0].status === 'rejected')"
            type="button"
            :disabled="submitting"
            class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            @click="submit()"
          >
            {{ submitting ? '提交中...' : '提交审核' }}
          </button>

          <!-- Review: admin sees pending → approve/reject -->
          <template v-if="user?.role === 'admin' && versions[0]?.status === 'pending'">
            <input v-model="reviewNote" class="rounded border px-2 py-1.5 text-sm" placeholder="审核意见（拒绝时必填）" />
            <button
              type="button"
              :disabled="reviewingAction !== null"
              class="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
              @click="review('approve')"
            >
              {{ reviewingAction === 'approve' ? '批准中...' : '批准' }}
            </button>
            <button
              type="button"
              :disabled="reviewingAction !== null"
              class="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              @click="review('reject')"
            >
              {{ reviewingAction === 'reject' ? '拒绝中...' : '拒绝' }}
            </button>
          </template>

          <!-- Publish: admin can publish any approved version -->
          <template v-if="user?.role === 'admin'">
            <button
              v-for="v in versions.filter((v: any) => v.status === 'approved')"
              :key="'pub-' + v.id"
              type="button"
              :disabled="publishingVersionId === v.id"
              class="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
              @click="publishVersion(v.id)"
            >
              {{ publishingVersionId === v.id ? `发布 v${v.version_number} 中...` : `发布 v${v.version_number}` }}
            </button>
          </template>
        </div>

        <!-- Editor or Version Timeline -->
        <template v-if="showEditor">
          <BlockEditor v-if="['page', 'guide', 'banner', 'category'].includes(item?.type)" :initial="latestPayload" :saving="saving" @save="save" />
          <LinkProjectForm v-else :initial="latestPayload" :saving="saving" @save="save" />
        </template>
        <VersionTimeline
          v-else
          :versions="versions"
          :item-id="itemId"
          :publishing-version-id="publishingVersionId"
          :rolling-back-version-id="rollingBackVersionId"
          @publish="publishVersion"
          @rollback="rollbackToVersion"
        />
      </template>
    </template>
  </AdminShell>
</template>
