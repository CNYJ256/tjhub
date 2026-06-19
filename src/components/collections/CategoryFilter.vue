<script setup lang="ts">
defineProps<{ categories: string[]; modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button class="rounded-md border px-3 py-2 text-sm" :class="modelValue === '' ? 'bg-slate-950 text-white' : 'bg-white'" @click="$emit('update:modelValue', '')">全部</button>
    <button
      v-for="category in categories"
      :key="category"
      class="rounded-md border px-3 py-2 text-sm"
      :class="modelValue === category ? 'bg-slate-950 text-white' : 'bg-white'"
      @click="$emit('update:modelValue', category)"
    >
      {{ category }}
    </button>
  </div>
</template>
