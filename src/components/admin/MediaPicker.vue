<script setup lang="ts">
import { ref } from 'vue'
import { uploadAdminMedia } from '../../services/adminApi'
import type { AdminMediaDto } from '../../types/admin'

const emit = defineEmits<{ uploaded: [media: AdminMediaDto] }>()
const altText = ref('')
const error = ref('')
const uploading = ref(false)

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || uploading.value) return
  uploading.value = true
  error.value = ''
  try {
    const response = await uploadAdminMedia(file, altText.value)
    emit('uploaded', response.media)
    input.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : '上传失败。'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="space-y-3 border border-slate-200 bg-white p-4">
    <label class="block text-sm">图片说明<input v-model="altText" class="mt-1 w-full border px-3 py-2" /></label>
    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" :disabled="uploading" @change="onFileChange" />
    <p v-if="uploading" class="text-sm text-slate-600">上传中...</p>
    <p v-if="error" class="text-sm text-red-700">{{ error }}</p>
  </div>
</template>
