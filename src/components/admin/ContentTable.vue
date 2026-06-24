<script setup lang="ts">
import type { AdminItemListRow } from '../../types/admin'

defineProps<{ items: AdminItemListRow[] }>()
</script>

<template>
  <div class="overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)]">
    <table class="w-full text-left text-sm">
      <thead class="bg-[var(--color-surface-soft)] text-[var(--color-muted)]">
        <tr>
          <th class="px-4 py-3 font-medium">标题</th>
          <th class="px-4 py-3 font-medium">类型</th>
          <th class="px-4 py-3 font-medium">Slug</th>
          <th class="px-4 py-3 font-medium">状态</th>
          <th class="px-4 py-3 font-medium">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" class="border-t border-[var(--color-border)]">
          <td class="px-4 py-3 text-[var(--color-text)]">{{ item.current_title || '未命名内容' }}</td>
          <td class="px-4 py-3 text-[var(--color-muted)]">{{ item.type }}</td>
          <td class="px-4 py-3 text-[var(--color-muted)]">{{ item.slug }}</td>
          <td class="px-4 py-3 text-[var(--color-muted)]">{{ item.version_status || '未保存' }}</td>
          <td class="px-4 py-3">
            <RouterLink :to="`/admin/items/${item.id}`" class="rounded-[var(--radius-control)] px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]">编辑</RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
