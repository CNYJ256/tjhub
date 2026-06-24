<script setup lang="ts">
import type { CategoryMeta } from '../../types/content'

defineProps<{ categories: CategoryMeta[]; modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      class="rounded-[var(--radius-control)] border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
      :class="modelValue === '' ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white' : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)]'"
      type="button"
      @click="$emit('update:modelValue', '')"
    >
      全部
    </button>
    <button
      v-for="category in categories"
      :key="category.key"
      class="rounded-[var(--radius-control)] border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
      :class="modelValue === category.key ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white' : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)]'"
      type="button"
      @click="$emit('update:modelValue', category.key)"
    >
      {{ category.label }}
    </button>
  </div>
</template>
