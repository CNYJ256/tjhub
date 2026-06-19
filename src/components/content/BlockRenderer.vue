<script setup lang="ts">
import { computed } from 'vue'
import type { PageBlock } from '../../types/content'
import HeroBlock from './HeroBlock.vue'
import BannerBlock from './BannerBlock.vue'
import CollectionPreviewBlock from './CollectionPreviewBlock.vue'
import { contentState } from '../../services/contentStore'
import { resolveBannerBlock } from '../../services/bannerBlocks'

const props = defineProps<{ block: PageBlock }>()
const banner = computed(() => resolveBannerBlock(props.block, contentState.index.banners))
</script>

<template>
  <HeroBlock v-if="block.type === 'hero'" :title="block.title" :description="block.description" />
  <BannerBlock v-else-if="block.type === 'banner'" :title="banner.title" :description="banner.description" :image-url="banner.imageUrl" :primary-link="banner.primaryLink" :secondary-link="banner.secondaryLink" />
  <CollectionPreviewBlock v-else-if="block.type === 'collectionPreview'" :title="block.title" :collection="block.collection" :placement="block.placement" :limit="block.limit" />
</template>
