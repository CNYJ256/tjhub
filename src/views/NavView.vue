<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import PageShell from '../components/layout/PageShell.vue'
import SearchInput from '../components/collections/SearchInput.vue'
import CategoryFilter from '../components/collections/CategoryFilter.vue'
import CollectionList from '../components/collections/CollectionList.vue'
import { contentIndex } from '../services/content'
import { searchLinks } from '../services/search'

const route = useRoute()
const query = ref('')
const category = ref('')

watchEffect(() => {
  query.value = typeof route.query.q === 'string' ? route.query.q : ''
  category.value = typeof route.query.category === 'string' ? route.query.category : ''
})

const categories = computed(() =>
  [...new Set(contentIndex.links.map((link) => link.category))].map((key) => ({
    key,
    label: contentIndex.categories[key]?.label ?? key,
    description: contentIndex.categories[key]?.description ?? ''
  }))
)
const filtered = computed(() => {
  const searched = searchLinks(contentIndex.links, query.value)
  return category.value ? searched.filter((link) => link.category === category.value) : searched
})
</script>

<template>
  <PageShell>
    <section class="mx-auto max-w-6xl px-4 py-10">
      <h1 class="text-3xl font-semibold">网站导航</h1>
      <p class="mt-3 text-slate-600">搜索和筛选同济学生常用入口。</p>
      <div class="mt-8 space-y-4">
        <SearchInput v-model="query" />
        <CategoryFilter v-model="category" :categories="categories" />
        <p class="text-sm text-slate-500">共找到 {{ filtered.length }} 个入口。</p>
        <CollectionList :entries="filtered" />
      </div>
    </section>
  </PageShell>
</template>
