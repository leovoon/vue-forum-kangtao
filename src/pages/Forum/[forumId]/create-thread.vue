<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum?.name }}</i>
    </h1>
    <thread-editor @save="save" @cancel="cancel" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRootStore } from '~/stores/root'

const props = defineProps(['forumId'])

const rootStore = useRootStore()
const { state } = storeToRefs(rootStore)

onMounted(async() => {
  await rootStore.fetchForum({ id: props.forumId })
})

const router = useRouter()

const forum = computed(() => state.value.forums.find(f => f.id === props.forumId))

// desctructure threadToSave from event payload
async function save({ title, text }: { title: string; text: string }): Promise<void> {
  const thread = await rootStore.createThread({
    forumId: props.forumId,
    title,
    text,
  })
  router.push(`/thread/${thread?.id}`)
}

function cancel() {
  router.push(`/forum/${props.forumId}`)
}

</script>
