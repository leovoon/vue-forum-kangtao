<template>
  <div v-if="ready">
    <h1>{{ category.name }}</h1>
    <ForumList
      :title="category.name"
      :forums="getForumsForCategory(category)"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRootStore } from '~/stores/root'

const props = defineProps(['id'])

const rootStore = useRootStore()
const { state } = storeToRefs(rootStore)
const ready = ref(false)
const category = computed(() => state.value.categories.find(category => category.id === props.id) || {})

onMounted(async() => {
  const category = await rootStore.fetchCategory({ id: props.id })
  await rootStore.fetchForums({ ids: category.forums })
  ready.value = true
})

function getForumsForCategory(category) {
  return state.value.forums.filter(forum => forum.categoryId === category.id)
}

</script>
