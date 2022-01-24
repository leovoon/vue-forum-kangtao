<template>
  <div class="col-full">
    <div class="forum-list">
      <h2 class="list-title">
        <a href="#">Forums</a>
      </h2>

      <div v-for="forum in forums" :key="forum.id" class="forum-listing">
        <div class="forum-details">
          <router-link
            :to="`/forum/${forum.id}`"
            class="text-xlarge"
          >
            {{ forum.name }}
          </router-link>
          <p>{{ forum.description }}</p>
        </div>

        <div class="threads-count">
          <p>
            <span class="count">{{ forum.threads?.length }}</span>
            {{ forumThreadsWord(forum) }}
          </p>
        </div>

        <div class="last-thread" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps(['forums', 'title', 'categoryId'])

function forumThreadsWord(forum: { threads: string | any[] }) {
  if (forum.threads?.length)
    return forum.threads.length > 1 ? 'threads' : 'thread'
  else
    return 'no threads'
}

</script>

<style scoped>

</style>
