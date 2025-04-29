<template>
  <div>
    <UTextarea
      v-if="newContent"
      v-model="newContent"
      :ui="{
        base: 'w-full'
      }"
      autoresize/>

    <div class="mt-2 flex gap-2">
      <UButton 
        label="Zapisz" 
        size="sm" 
        color="success" 
        @click="save"
      />
      <UButton 
        label="Anuluj" 
        size="sm" 
        color="neutral" 
        @click="emit('cancel')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostsStore } from '~/stores/posts';
import type { EditPost } from '~/types/types';

const postsStore = usePostsStore();

interface Props {
  editPost: EditPost
}

const props = defineProps<Props>();
const emit = defineEmits(['cancel']);

const newContent = ref(props.editPost.content);

const save = async () => {
  await postsStore.saveEdittedPost(props.editPost.postId, newContent.value);
  emit('cancel');
};
</script>