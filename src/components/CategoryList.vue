<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :category-id="category.id"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRootStore } from '~/stores/root'

defineProps(['categories'])

const rootStore = useRootStore()

const { state } = storeToRefs(rootStore)

function getForumsForCategory(category: { id: string }) {
  return state.value.forums.filter(f => f.categoryId === category.id)
}

</script>
