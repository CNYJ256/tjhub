<script setup lang="ts">
import type { CategoryMeta } from '../../types/content'

defineProps<{ categories: CategoryMeta[]; modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button class="rounded-md border px-3 py-2 text-sm" :class="modelValue === '' ? 'bg-slate-950 text-white' : 'bg-white'" @click="$emit('update:modelValue', '')">全部</button>
    <button
      v-for="category in categories"
      :key="category.key"
      class="rounded-md border px-3 py-2 text-sm"
      :class="modelValue === category.key ? 'bg-slate-950 text-white' : 'bg-white'"
      @click="$emit('update:modelValue', category.key)"
    >
      {{ category.label }}
    </button>
  </div>
</template>
