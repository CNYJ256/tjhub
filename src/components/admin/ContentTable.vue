<script setup lang="ts">
import type { AdminItemListRow } from '../../types/admin'

defineProps<{ items: AdminItemListRow[] }>()
</script>

<template>
  <div class="overflow-hidden border border-slate-200 bg-white">
    <table class="w-full text-left text-sm">
      <thead class="bg-slate-50 text-slate-600">
        <tr>
          <th class="px-4 py-3">标题</th>
          <th class="px-4 py-3">类型</th>
          <th class="px-4 py-3">Slug</th>
          <th class="px-4 py-3">状态</th>
          <th class="px-4 py-3">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" class="border-t border-slate-100">
          <td class="px-4 py-3">{{ item.current_title || '未命名内容' }}</td>
          <td class="px-4 py-3">{{ item.type }}</td>
          <td class="px-4 py-3">{{ item.slug }}</td>
          <td class="px-4 py-3">{{ item.version_status || '未保存' }}</td>
          <td class="px-4 py-3">
            <RouterLink :to="`/admin/items/${item.id}`" class="text-sky-700 hover:underline">编辑</RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
