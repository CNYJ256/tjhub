<script setup lang="ts">
import { ref } from 'vue'
import { uploadAdminMedia } from '../../services/adminApi'

const emit = defineEmits<{ uploaded: [media: unknown] }>()
const altText = ref('')
const error = ref('')

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const response = await uploadAdminMedia(file, altText.value)
    emit('uploaded', response.media)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '上传失败。'
  }
}
</script>

<template>
  <div class="space-y-3 border border-slate-200 bg-white p-4">
    <label class="block text-sm">图片说明<input v-model="altText" class="mt-1 w-full border px-3 py-2" /></label>
    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" @change="onFileChange" />
    <p v-if="error" class="text-sm text-red-700">{{ error }}</p>
  </div>
</template>
