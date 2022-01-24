<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <!-- <textarea id="" v-model="text" name="" cols="30" rows="10" class="form-input" @keyup.enter="submitPost" /> -->
        <textarea id="" v-model="postCopy.text" name="" cols="30" rows="10" class="form-input" />
      </div>
      <div class="form-actions">
        <!-- <button class="btn-blue">
          Submit post
        </button> -->
        <button class="btn-blue">
          {{ post.id ? 'Update Post' : 'Submit post' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  post: {
    type: Object,
    default: () => ({ text: null }),
  },
})

const postCopy = ref({ ...props.post })
const emit = defineEmits(['save'])

function save() {
  emit('save', { post: postCopy.value })
  postCopy.value.text = ''
}

</script>
