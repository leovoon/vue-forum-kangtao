<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>
      Editing <i>{{ thread?.title }}</i>
    </h1>

    <ThreadEditor :title="thread?.title" :text="text" @save="save" @cancel="cancel" />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRootStore } from '~/stores/root'

const props = defineProps(['id'])

const rootStore = useRootStore()
const router = useRouter()
const { state } = storeToRefs(rootStore)

const thread = computed(() => state.value.threads.find(thread => thread.id === props.id))
const text = computed(() => {
  const post = state.value.posts.find(post => post.id === thread.value?.posts[0])
  return post ? post.text : ''
})

onMounted(async() => {
  const thread = await rootStore.fetchThread({ id: props.id })
  rootStore.fetchPost({ id: thread.posts[0] })
})

async function save({ title, text }: { title: string; text: string }) {
  const thread = await rootStore.updateThread({
    id: props.id,
    title,
    text,
  })
  router.push(`/thread/${thread?.id}`)
}
function cancel() {
  router.push(`/thread/${props.id}`)
}

</script>
