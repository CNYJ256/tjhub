<script setup lang="ts">
import type { PageBlock } from '../../types/content'
import HeroBlock from './HeroBlock.vue'
import BannerBlock from './BannerBlock.vue'

defineProps<{ block: PageBlock }>()
</script>

<template>
  <HeroBlock v-if="block.type === 'hero'" :title="block.title" :description="block.description" />
  <BannerBlock v-else-if="block.type === 'banner'" :title="block.title" :description="block.description" />
</template>
