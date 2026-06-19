<script setup lang="ts">
import AdminShell from '../../components/admin/AdminShell.vue'
import MediaPicker from '../../components/admin/MediaPicker.vue'
</script>

<template>
  <AdminShell>
    <template #default>
      <h1 class="text-2xl font-semibold">媒体库</h1>
      <p class="mt-1 text-sm text-slate-600">上传 banner、指南插图和页面图片。</p>
      <div class="mt-4">
        <MediaPicker />
      </div>
    </template>
  </AdminShell>
</template>
