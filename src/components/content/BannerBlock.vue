<script setup lang="ts">
defineProps<{ title?: string; description?: string; imageUrl?: string; primaryLink?: string; secondaryLink?: string }>()
</script>

<template>
  <section class="mx-auto max-w-6xl px-4">
    <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div v-if="primaryLink" class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img v-if="imageUrl" :src="imageUrl" :alt="title || ''" class="h-32 w-auto rounded object-cover" />
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-slate-950">{{ title }}</h2>
          <p v-if="description" class="mt-2 text-slate-600">{{ description }}</p>
        </div>
        <div class="flex gap-2">
          <a v-if="primaryLink" :href="primaryLink" class="rounded-md bg-slate-950 px-4 py-2 text-sm text-white">了解更多</a>
          <a v-if="secondaryLink" :href="secondaryLink" class="rounded-md border border-slate-300 px-4 py-2 text-sm">相关链接</a>
        </div>
      </div>
      <template v-else>
        <h2 class="text-xl font-semibold text-slate-950">{{ title }}</h2>
        <p v-if="description" class="mt-2 text-slate-600">{{ description }}</p>
      </template>
    </div>
  </section>
</template>
