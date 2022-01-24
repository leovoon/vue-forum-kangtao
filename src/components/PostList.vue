<template>
  <div class="post-list">
    <div
      v-for="post in posts"
      :key="post.id"
      class="post"
    >
      <div v-if="userById(post?.userId)" class="user-info">
        <a href="#" class="user-name">{{ userById(post?.userId)!.name }}</a>

        <a href="#">
          <img class="avatar-large" :src="userById(post?.userId)!.avatar" alt="">
        </a>

        <p class="desktop-only text-small">
          107 posts
        </p>
      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor
            v-if="editing === post.id" :post="post"
            @save="handleUpdate"
          />
          <p v-else>
            {{ post.text }}
          </p>
        </div>
      </div>
      <a
        v-if="post.userId === state.authId"

        href="#"
        style="margin-left: auto; padding-left:10px;"
        class="link-unstyled"
        title="Make a change"
        @click.prevent="toggleEditMode(post.id)"
      >
        <carbon-pen />
      </a>
      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">
          edited
        </div>

        <AppDate :timestamp="post?.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useRootStore } from '~/stores/root'

defineProps(['posts'])

const editing = ref(null)
const rootStore = useRootStore()
const { state } = storeToRefs(rootStore)

const users = computed(() => state.value.users)

function userById(userId: string) {
  return users.value.find(user => user.id === userId)
}

function toggleEditMode(id) {
  editing.value = id === editing.value ? null : id
}

function handleUpdate(e) {
  rootStore.updatePost(e.post)
  editing.value = null
}

</script>

<style scoped>

</style>
