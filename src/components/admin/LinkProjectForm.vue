<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{ initial?: Record<string, unknown>; saving?: boolean }>()
const emit = defineEmits<{ save: [payload: Record<string, unknown>] }>()

const form = reactive({
  title: String(props.initial?.title || ''),
  slug: String(props.initial?.slug || ''),
  url: String(props.initial?.url || ''),
  description: String(props.initial?.description || ''),
  category: String(props.initial?.category || ''),
  tags: Array.isArray(props.initial?.tags) ? (props.initial?.tags as string[]).join(', ') : '',
  aliases: Array.isArray(props.initial?.aliases) ? (props.initial?.aliases as string[]).join(', ') : '',
  sourceKind: String(props.initial?.sourceKind || 'official'),
  status: String(props.initial?.status || 'active'),
  featured: Boolean(props.initial?.featured || false),
  placements: Array.isArray(props.initial?.placements) ? (props.initial?.placements as string[]).join(', ') : '',
  audience: Array.isArray(props.initial?.audience) ? (props.initial?.audience as string[]).join(', ') : 'all',
  priority: Number(props.initial?.priority || 0),
  guideSlug: String(props.initial?.guideSlug || '')
})

function splitList(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function submit() {
  emit('save', {
    ...form,
    tags: splitList(form.tags),
    aliases: splitList(form.aliases),
    placements: splitList(form.placements),
    audience: splitList(form.audience),
    priority: Number(form.priority)
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <label class="block text-sm">标题
      <input v-model="form.title" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">Slug
      <input v-model="form.slug" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">URL
      <input v-model="form.url" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">简介
      <textarea v-model="form.description" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">分类
      <input v-model="form.category" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">标签（用逗号分隔）
      <input v-model="form.tags" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">别名（用逗号分隔）
      <input v-model="form.aliases" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">来源类型
      <select v-model="form.sourceKind" class="mt-1 w-full border px-3 py-2 rounded">
        <option value="official">官方</option>
        <option value="student">学生</option>
        <option value="third_party">第三方</option>
        <option value="internal">内部</option>
      </select>
    </label>
    <label class="block text-sm">可用状态
      <select v-model="form.status" class="mt-1 w-full border px-3 py-2 rounded">
        <option value="active">活跃</option>
        <option value="stale">过时</option>
        <option value="unavailable">不可用</option>
        <option value="archived">已归档</option>
      </select>
    </label>
    <label class="flex items-center gap-2 text-sm">
      <input v-model="form.featured" type="checkbox" /> 首页精选
    </label>
    <label class="block text-sm">展示位置（用逗号分隔）
      <input v-model="form.placements" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">受众（用逗号分隔）
      <input v-model="form.audience" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">优先级
      <input v-model.number="form.priority" type="number" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <label class="block text-sm">指南 Slug
      <input v-model="form.guideSlug" class="mt-1 w-full border px-3 py-2 rounded" />
    </label>
    <button :disabled="saving" class="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50" type="submit">
      {{ saving ? '保存中...' : '保存新版本' }}
    </button>
  </form>
</template>
