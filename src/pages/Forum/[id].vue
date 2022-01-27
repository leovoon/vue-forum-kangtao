<template>
  <div v-if="forum" class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum?.name }}</h1>
        <p class="text-lead">
          {{ forum?.description }}
        </p>
      </div>
      <router-link
        :to="`/forum/${forum?.id}/create-thread`"
        class="btn-green btn-small"
      >
        Start a thread
      </router-link>
    </div>
  </div>

  <div class="col-full push-top text-center">
    <ThreadList v-if="ready" :threads="threads" />
    <app-spinner v-else />
    <p v-if="!forum?.threads" class="flex justify-center align-center">
      No thread here, create one?
    </p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRootStore } from '~/stores/root'

const props = defineProps(['id'])

const rootStore = useRootStore()
const { state } = storeToRefs(rootStore)
const ready = ref(false)
onMounted(async() => {
  const forum = await rootStore.fetchForum({ id: props.id })
  if (forum.threads) {
    const threads = await rootStore.fetchThreads({ ids: forum.threads })
    await rootStore.fetchUsers({ ids: threads.map(thread => thread.userId) })
    ready.value = true
  }
  else {
    ready.value = true
  }
})

const forum = computed(() => state.value.forums.find(f => f.id === props.id))

const threads = computed(() => forum.value ? state.value.threads.filter(thread => thread.forumId === props.id) : [])

</script>
