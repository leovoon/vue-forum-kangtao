import { acceptHMRUpdate, defineStore } from 'pinia'
import firebase from 'firebase'
export const useRootStore = defineStore('root', () => {
  const state = ref({
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3',
    unsubscribes: [],

  })

  const user = computed(() => state.value.users.find((user: { id: string }) => user.id === state.value.authId))
  const posts = computed(() => state.value.posts.filter((post: { userId: string }) => post.userId === state.value.authId))
  const postscount = computed(() => posts.value.filter((post: { userId: string }) => post.userId === state.value.authId).length)
  const threads = computed(() => state.value.threads.filter((thread: { userId: string }) => thread.userId === state.value.authId))
  const threadsCount = computed(() => threads.value.filter((thread: { userId: string }) => thread.userId === state.value.authId).length)

  // getter
  const userAuth = computed(() => {
    if (!user.value) return null
    return {
      ...user.value,
      posts: posts.value,
      postsCount: postscount.value,
      threads: threads.value,
      threadsCount: threadsCount.value,
    }
  })

  function setUser({ user }) {
    const userIndex = state.value.users.findIndex(u => u.id === user.id)
    if (user.id && userIndex !== -1)
      state.value.users[userIndex] = user
    else
      state.value.users.push(user)
  }

  function setPost({ post }) {
    const postIndex = state.value.posts.findIndex(p => p.id === post.id)
    if (post.id && postIndex !== -1)
      state.value.posts[postIndex] = post
    else
      state.value.posts.push(post)
  }

  function setThread({ thread }) {
    const threadIndex = state.value.threads.findIndex(t => t.id === thread.id)
    if (thread.id && threadIndex !== -1)
      state.value.threads[threadIndex] = thread

    else
      state.value.threads.push(thread)
  }

  async function createPost(post: any) {
    post.id = `ggqq${Math.random()}`
    post.userId = state.value.authId
    post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()

    const batch = firebase.firestore().batch()
    const postRef = firebase.firestore().collection('posts').doc()
    const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
    const userRef = firebase.firestore().collection('users').doc(state.value.authId)

    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.value.authId),
    })
    batch.update(userRef, {
      postsCount: firebase.firestore.FieldValue.increment(1),
    })
    await batch.commit()
    const newPost = await postRef.get()
    setItem({ resource: 'posts', item: { ...newPost.data(), id: newPost.id } })

    appendPostToThread({ childId: newPost.id, parentId: post.threadId })
    appendContributorToThread({ childId: state.value.authId, parentId: post.threadId })
  }

  async function createThread({ text, title, forumId }: { text: string; title: string; forumId: string }) {
    const userId = state.value.authId
    const publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const threadRef = firebase.firestore().collection('threads').doc()
    const thread = { forumId, title, publishedAt, userId, id: threadRef.id }
    const userRef = firebase.firestore().collection('users').doc(userId)
    const forumRef = firebase.firestore().collection('forums').doc(forumId)
    const batch = firebase.firestore().batch()

    batch.set(threadRef, thread)
    batch.update(userRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
    })
    batch.update(forumRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
    })
    await batch.commit()
    const newThread = await threadRef.get()
    setItem({ resource: 'threads', item: { ...newThread.data(), id: newThread.id } })
    appendThreadToUser({ parentId: userId, childId: threadRef.id })
    appendThreadToForum({ parentId: forumId, childId: threadRef.id })
    await createPost({ text, threadId: threadRef.id })
    return findById(state.value.threads, threadRef.id)
  }

  // helper
  const docToResource = (doc) => {
    if (typeof doc?.data !== 'function') return doc
    return { ...doc.data(), id: doc.id }
  }

  async function updatePost({ text, id }) {
    const post = {
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.value.authId,
        moderated: false,
      },
    }
    const postRef = firebase.firestore().collection('posts').doc(id)
    await postRef.update(post)
    const updatedPost = await postRef.get()
    setItem({ resource: 'posts', item: updatedPost })
  }

  async function updateThread({ title, text, id }: { title: string; text: string; id: string }) {
    const thread = state.value.threads.find(thread => thread.id === id)
    const post = state.value.posts.find(post => post.id === thread?.posts[0])
    // const newThread = { ...thread, title }
    // const newPost = { ...post, text }

    // // update thread
    // const threadIndex = state.value.threads.findIndex(t => t.id === newThread?.id)
    // if (newThread.id && threadIndex !== -1)
    //   state.value.threads[threadIndex] = newThread
    // else
    //   state.value.threads.push(newThread)

    // // update psot
    // const postIndex = state.value.posts.findIndex(p => p.id === newPost.id)
    // if (newPost.id && postIndex !== -1)
    //   state.value.posts[postIndex] = newPost
    // else
    //   state.value.posts.push(newPost)

    // return newThread
    let newThread = { ...thread, title }
    let newPost = { ...post, text }
    const threadRef = firebase.firestore().collection('threads').doc(id)
    const postRef = firebase.firestore().collection('posts').doc(post.id)
    const batch = firebase.firestore().batch()
    batch.update(threadRef, newThread)
    batch.update(postRef, newPost)
    await batch.commit()
    newThread = await threadRef.get()
    newPost = await postRef.get()
    setItem({ resource: 'threads', item: newThread })
    setItem({ resource: 'posts', item: newPost })
    return docToResource(newThread)
  }

  // Database APi Calls

  function fetchAuthUser() {
    return fetchItem({ emoji: '🙋', resource: 'users', id: state.value.authId })
  }

  function fetchForum({ id }) {
    return fetchItem({ resource: 'forums', id, emoji: '🏁' })
  }

  function fetchThread({ id }) {
    return fetchItem({ resource: 'threads', id, emoji: '📄' })
  }

  function fetchUser({ id }) {
    return fetchItem({ resource: 'users', id, emoji: '🙋' })
  }

  function fetchPost({ id }) {
    return fetchItem({ resource: 'posts', id, emoji: '💬' })
  }
  function fetchCategory({ id }) {
    return fetchItem({ resource: 'categories', id, emoji: '🏷' })
  }
  function fetchAllCategories() {
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
        const categories = querySnapshot.docs.map((doc) => {
          const item = { id: doc.id, ...doc.data() }
          setItem({ resource: 'categories', item })
          return item
        })
        resolve(categories)
      })
      appendUnsubscribe({ unsubscribe })
    })
  }
  function fetchThreads({ ids }) {
    return fetchItems({ resource: 'threads', ids, emoji: '📄' })
  }
  function fetchForums({ ids }) {
    return fetchItems({ resource: 'forums', ids, emoji: '🏁' })
  }
  function fetchUsers({ ids }) {
    return fetchItems({ resource: 'users', ids, emoji: '🙋' })
  }
  function fetchPosts({ ids }) {
    return fetchItems({ resource: 'posts', ids, emoji: '💬' })
  }

  function fetchItem({ id, emoji, resource }) {
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        const item = { ...doc.data(), id: doc.id }
        setItem({ resource, item })
        resolve(item)
      })
      appendUnsubscribe({ unsubscribe })
    })
  }

  function fetchItems({ ids, resource, emoji }) {
    return Promise.all(ids.map(id => fetchItem({ id, resource, emoji })))
  }

  function setItem({ resource, item }) {
    item = docToResource(item)
    const index = state.value[resource].findIndex(p => p.id === item.id)
    if (item.id && index !== -1)
      state.value[resource][index] = item
    else
      state.value[resource].push(item)
  }

  function appendPostToThread({ parent, child }) {
    makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' })
  }
  function appendThreadToForum({ parent, child }) {
    makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
  function appendThreadToUser({ parent, child }) {
    makeAppendChildToParentMutation({ parent: 'users', child: 'threads' })
  }
  function appendContributorToThread({ parent, child }) {
    makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
  }

  function appendUnsubscribe({ unsubscribe }) {
    state.value.unsubscribes.push(unsubscribe)
  }

  function findById(resources, id) {
    if (!resources) return null
    return resources.find(r => r.id === id)
  }

  function makeAppendChildToParentMutation({ parent, child }) {
    return ({ childId, parentId }) => {
      const resource = findById(state[parent], parentId)
      if (!resource) {
        console.warn(`Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist`)
        return
      }
      resource[child] = resource[child] || []

      if (!resource[child].includes(childId))
        resource[child].push(childId)
    }
  }

  async function unsubscribeAllSnapshots() {
    state.value.unsubscribes.forEach(unsubscribe => unsubscribe())
    clearAllUnsubscribes()
  }

  function clearAllUnsubscribes() {
    state.value.unsubscribes = []
  }

  return {
    state,
    userAuth,
    setUser,
    setPost,
    setThread,
    createPost,
    updatePost,
    createThread,
    updateThread,
    fetchAuthUser,
    fetchForum,
    fetchForums,
    fetchThread,
    fetchThreads,
    fetchCategory,
    fetchUser,
    fetchUsers,
    fetchPost,
    fetchPosts,
    fetchItems,
    fetchAllCategories,
    unsubscribeAllSnapshots,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useRootStore, import.meta.hot))
