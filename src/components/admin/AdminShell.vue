<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminNav from './AdminNav.vue'
import { fetchAdminMe } from '../../services/adminApi'
import type { AdminUserDto } from '../../types/admin'

const loading = ref(true)
const error = ref('')
const user = ref<AdminUserDto | null>(null)

onMounted(async () => {
  try {
    const response = await fetchAdminMe()
    user.value = response.user
  } catch (err) {
    error.value = err instanceof Error ? err.message : '无法读取后台身份。'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="min-h-screen bg-[var(--color-page)] text-[var(--color-text)]">
    <header class="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-[var(--space-page-x)] py-4">
        <RouterLink to="/" class="rounded-[var(--radius-control)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]">TJHub 后台</RouterLink>
        <span v-if="user" class="text-sm text-[var(--color-muted)]">{{ user.email }} · {{ user.role === 'admin' ? '管理员' : '编辑者' }}</span>
      </div>
    </header>
    <AdminNav />
    <main class="mx-auto max-w-7xl px-[var(--space-page-x)] py-6">
      <p v-if="loading" class="rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)]">正在验证后台权限...</p>
      <p v-else-if="error" class="rounded-[var(--radius-panel)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
      <slot v-else :user="user" />
    </main>
  </section>
</template>
