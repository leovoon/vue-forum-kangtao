<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        id="thread_title"
        v-model="form.title"
        type="text"
        class="form-input"
        name="title"
      >
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        id="thread_content"
        v-model="form.text"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      />
    </div>

    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="$emit('cancel')">
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? 'Update' : 'Publish' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">

const props = defineProps({
  title: { type: String, default: '' },
  text: { type: String, default: '' },
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  title: props.title,
  text: props.text,

})

const existing = computed(() => {
  return !!form.value.title
})

function save() {
  emit('save', {
    ...form.value,
  })
}

</script>
