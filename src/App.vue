<script setup lang="ts">
import TheNavbar from './components/TheNavbar.vue'
import { useRootStore } from './stores/root'
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Kangtao Forum',
  meta: [
    { name: 'description', content: 'A place to exchange knowledge.' },
  ],
})

const rootStore = useRootStore()
rootStore.fetchAuthUser()

const router = useRouter()
router.beforeEach(() => {
  rootStore.unsubscribeAllSnapshots()
})
</script>

<template>
  <TheNavbar />
  <router-view />
</template>
