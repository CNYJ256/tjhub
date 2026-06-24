<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    class="w-full rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-focus)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
    :value="modelValue"
    placeholder="搜索网站、工具、指南"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
