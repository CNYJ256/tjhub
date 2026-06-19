<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-950"
    :value="modelValue"
    placeholder="搜索网站、工具、指南"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
