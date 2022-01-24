<template>
  {{ time }}
</template>

<script setup lang='ts'>

const props = defineProps(['timestamp'])
const normalizedTimestamp = props.timestamp?.seconds || props.timestamp
const time = computed(() => new Date(normalizedTimestamp).toLocaleString('en-US', { hour12: true }))
</script>
