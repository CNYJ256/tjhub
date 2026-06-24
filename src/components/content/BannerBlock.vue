<script setup lang="ts">
defineProps<{ title?: string; description?: string; imageUrl?: string; primaryLink?: string; secondaryLink?: string }>()
</script>

<template>
  <section class="mx-auto max-w-6xl px-[var(--space-page-x)]">
    <div class="rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
      <div v-if="primaryLink" class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img v-if="imageUrl" :src="imageUrl" :alt="title || ''" class="h-32 w-full rounded-[var(--radius-panel)] object-cover sm:w-44" />
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-[var(--color-text)]">{{ title }}</h2>
          <p v-if="description" class="mt-2 leading-7 text-[var(--color-muted)]">{{ description }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <a v-if="primaryLink" :href="primaryLink" class="rounded-[var(--radius-control)] bg-[var(--color-accent)] px-4 py-2 text-sm text-white hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]">了解更多</a>
          <a v-if="secondaryLink" :href="secondaryLink" class="rounded-[var(--radius-control)] border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]">相关链接</a>
        </div>
      </div>
      <template v-else>
        <h2 class="text-xl font-semibold text-[var(--color-text)]">{{ title }}</h2>
        <p v-if="description" class="mt-2 leading-7 text-[var(--color-muted)]">{{ description }}</p>
      </template>
    </div>
  </section>
</template>
