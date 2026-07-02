<script setup lang="ts">
import { reactive } from 'vue'

interface EditableBlock {
  type: string
  title?: string
  description?: string
  collection?: 'links' | 'projects' | 'guides'
  placement?: string
  limit?: number
  body?: string
}

const props = defineProps<{ initial?: { title?: string; blocks?: EditableBlock[]; body?: string }; saving?: boolean }>()
const emit = defineEmits<{ save: [payload: Record<string, unknown>] }>()

const form = reactive({
  title: props.initial?.title || '',
  body: props.initial?.body || '',
  blocks: props.initial?.blocks?.length ? [...props.initial.blocks] : [{ type: 'markdown', title: '', body: props.initial?.body || '' }]
})

function addBlock(type = 'markdown') {
  form.blocks.push({ type, title: '', description: '', body: '' })
}

function moveBlock(index: number, offset: number) {
  const next = index + offset
  if (next < 0 || next >= form.blocks.length) return
  const [block] = form.blocks.splice(index, 1)
  form.blocks.splice(next, 0, block)
}

function removeBlock(index: number) {
  form.blocks.splice(index, 1)
}

function save() {
  emit('save', {
    title: form.title,
    body: form.body,
    blocks: form.blocks
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="save">
    <label class="block text-sm">标题<input v-model="form.title" class="mt-1 w-full border px-3 py-2" /></label>
    <section v-for="(block, index) in form.blocks" :key="index" class="border border-slate-200 bg-white p-4">
      <div class="mb-3 flex items-center justify-between">
        <strong>区块 {{ index + 1 }} · {{ block.type }}</strong>
        <div class="flex gap-2">
          <button type="button" @click="moveBlock(index, -1)">上移</button>
          <button type="button" @click="moveBlock(index, 1)">下移</button>
          <button type="button" @click="removeBlock(index)">删除</button>
        </div>
      </div>
      <label class="block text-sm">类型<input v-model="block.type" class="mt-1 w-full border px-3 py-2" /></label>
      <label class="block text-sm">标题<input v-model="block.title" class="mt-1 w-full border px-3 py-2" /></label>
      <label class="block text-sm">描述<textarea v-model="block.description" class="mt-1 w-full border px-3 py-2" /></label>
      <div class="grid gap-3 md:grid-cols-3">
        <label class="block text-sm">集合
          <select v-model="block.collection" class="mt-1 w-full border px-3 py-2">
            <option value="">不使用集合</option>
            <option value="links">链接</option>
            <option value="projects">项目</option>
            <option value="guides">指南</option>
          </select>
        </label>
        <label class="block text-sm">展示位置<input v-model="block.placement" class="mt-1 w-full border px-3 py-2" /></label>
        <label class="block text-sm">数量上限<input v-model.number="block.limit" type="number" min="1" class="mt-1 w-full border px-3 py-2" /></label>
      </div>
      <label class="block text-sm">正文<textarea v-model="block.body" class="mt-1 min-h-32 w-full border px-3 py-2" /></label>
    </section>
    <button type="button" class="rounded border px-4 py-2" @click="addBlock()">新增 Markdown 区块</button>
    <button :disabled="saving" class="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50" type="submit">
      {{ saving ? '保存中...' : '保存新版本' }}
    </button>
  </form>
</template>
