<template>
  <UModal v-model:open="showModal" title="Potwierdzenie usunięcia">
    <UButton
      icon="i-lucide-x"
      label="Usuń"
      color="error"
      :disabled="post.isDeleted"
      variant="soft"
    />

    <template #content>
      <div class="p-5">
        <div
          class="p-4 rounded-lg bg-slate-800  shadow-sm"
        >
          <div class="flex">
            <UserImgWithPopover :user="post.user" size="big" />

            <div class="w-full">
              <h3 class="font-semibold text-lg text-green-600">{{ post.user.username }}</h3>
              <p class="text-gray-200">{{ post.content }}</p>
            </div>
          </div>
        </div>
                


        <div class="p-5">
          <p class="text-justify">Czy na pewno chcesz usunąć ten post? Tego działania nie można cofnąć.</p>
        
          <div class="flex justify-end gap-2 mt-4">
            <!-- Anulowanie -->
            <UButton 
              label="Anuluj" 
              color="neutral" 
              variant="outline" 
              @click="showModal = false"
            />
          
            <!-- Potwierdzenie usunięcia -->
            <UButton 
              label="Usuń" 
              color="error" 
              @click="deletePost"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePostsStore } from '~/stores/posts';
import type { Post } from '~/types/types';

interface Props {
  post: Post
}

const props = defineProps<Props>();

const showModal = ref(false);
const postsStore = usePostsStore();

const deletePost = async () => {
  if(await postsStore.deletePost(props.post)) {
    showModal.value = false;
  }
};

</script>