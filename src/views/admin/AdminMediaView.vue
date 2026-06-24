<script setup lang="ts">
import { ref } from 'vue'
import AdminShell from '../../components/admin/AdminShell.vue'
import MediaPicker from '../../components/admin/MediaPicker.vue'
import type { AdminMediaDto } from '../../types/admin'

const lastUploaded = ref<AdminMediaDto | null>(null)
const copyMessage = ref('')

function onUploaded(media: AdminMediaDto) {
  lastUploaded.value = media
  copyMessage.value = ''
}

async function copyUrl() {
  if (!lastUploaded.value?.url) return
  try {
    await navigator.clipboard.writeText(lastUploaded.value.url)
    copyMessage.value = '链接已复制。'
  } catch {
    copyMessage.value = '复制失败，请手动复制链接。'
  }
}
</script>

<template>
  <AdminShell>
    <template #default>
      <h1 class="text-2xl font-semibold">媒体库</h1>
      <p class="mt-1 text-sm text-slate-600">上传 banner、指南插图和页面图片。</p>
      <div class="mt-4">
        <MediaPicker @uploaded="onUploaded" />
      </div>

      <section v-if="lastUploaded" class="mt-4 space-y-3 border border-emerald-200 bg-emerald-50 p-4">
        <h2 class="text-base font-semibold text-emerald-900">上传成功</h2>
        <p class="text-sm text-emerald-900">文件名：{{ lastUploaded.filename }}</p>
        <p v-if="lastUploaded.altText" class="text-sm text-emerald-900">图片说明：{{ lastUploaded.altText }}</p>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-emerald-900">文件链接</label>
          <input :value="lastUploaded.url" readonly class="w-full rounded border border-emerald-200 bg-white px-3 py-2 text-sm" />
        </div>
        <div class="flex items-center gap-3">
          <button type="button" class="rounded bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800" @click="copyUrl">
            复制链接
          </button>
          <span v-if="copyMessage" class="text-sm text-emerald-900">{{ copyMessage }}</span>
        </div>
      </section>
    </template>
  </AdminShell>
</template>
