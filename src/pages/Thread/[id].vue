
<template>
  <div class="col-large push-top">
    <h1>
      {{ thread?.title }}
      <router-link
        :to="`/thread/edit/${thread?.id}`"
        class="btn-green btn-small"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ userById(thread?.userId!)?.name }}</a>, <AppDate :timestamp="thread?.publishedAt" />.
      <span
        style="float:right; margin-top: 2px;"
        class="hide-mobile text-faded text-small"
      >{{ thread?.posts?.length ? thread.posts.length : 0 }} replies by {{ thread?.contributors?.length || 0 }} contributors</span>
    </p>

    <post-list v-if="ready" :posts="threadPosts!" />
    <post-editor v-if="ready" @save="addPost" />
    <app-spinner v-else />
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
  // fetch the thread
  const thread = await rootStore.fetchThread({ id: props.id })

  // fetch the user
  rootStore.fetchUser({ id: thread.userId })

  // fetch the posts and user each post
  const posts = await rootStore.fetchPosts({ ids: thread.posts })
  // fetch the users associated with the posts
  const users = posts.map(post => post.userId)
  await rootStore.fetchUsers({ ids: users })
  ready.value = true
})

const posts = computed(() => state.value.posts)
const threads = computed(() => state.value.threads)
const thread = computed(() => threads.value.find(thread => thread.id === props.id))
const threadPosts = computed(() => posts.value.filter((post: { threadId: string }) => post.threadId === props.id))

function addPost(eventData: { post: any }) {
  const post = {
    ...eventData.post,
    threadId: props.id,
  }
  rootStore.createPost(post)
}

function userById(userId: string) {
  return state.value.users.find(user => user.id === userId)
}

</script>
