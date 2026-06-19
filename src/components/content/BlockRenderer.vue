<script setup lang="ts">
import type { PageBlock } from '../../types/content'
import HeroBlock from './HeroBlock.vue'
import BannerBlock from './BannerBlock.vue'
import CollectionPreviewBlock from './CollectionPreviewBlock.vue'

defineProps<{ block: PageBlock }>()
</script>

<template>
  <HeroBlock v-if="block.type === 'hero'" :title="block.title" :description="block.description" />
  <BannerBlock v-else-if="block.type === 'banner'" :title="block.title" :description="block.description" :image-url="block.imageUrl" :primary-link="block.primaryLink" :secondary-link="block.secondaryLink" />
  <CollectionPreviewBlock v-else-if="block.type === 'collectionPreview'" :title="block.title" :collection="block.collection" :placement="block.placement" :limit="block.limit" />
</template>
