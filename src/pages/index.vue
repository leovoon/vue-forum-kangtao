<template>
  <div v-if="ready" class="container">
    <h1 class="push-top">
      Welcome to the Forum
    </h1>
    <CategoryList :categories="categories" />
  </div>
  <app-spinner v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useRootStore } from '~/stores/root'

const rootStore = useRootStore()
const { state } = storeToRefs(rootStore)

const ready = ref(false)
const categories = computed(() => state.value.categories)
onMounted(async() => {
  const categories = await rootStore.fetchAllCategories()
  const forumIds = categories.map(category => category.forums).flat()
  await rootStore.fetchForums({ ids: forumIds })
  ready.value = true
})

</script>

<route lang="yaml">
meta:
  layout: home
</route>
