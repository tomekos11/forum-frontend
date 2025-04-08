<template>
  <div class="space-y-4" style="padding-bottom: 200px;">
    <div
      v-for="(post, index) in posts"
      :key="post.id"
      :class="[
        'p-4 rounded-lg shadow-sm',
        index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700'
      ]"
    >

      <div class="flex">
        <img class="rounded-sm mr-5 w-[100px] max-h-[100px]" src="https://github.com/benjamincanac.png">
        <div>
          <h3 class="font-semibold text-lg text-green-600">{{ post.user.username }}</h3>

          <!-- Tryb wyświetlania i edycji -->
          <div v-if="editing?.postId !== post.id">
            <p class="text-gray-200">{{ post.content }}</p>
          </div>

          <div v-else>
            <UTextarea v-if="editing" v-model="editing.content" autoresize />

            <div class="mt-2 flex gap-2">
              <UButton 
                label="Zapisz" 
                size="sm" 
                color="success" 
                @click="saveContent"
              />
              <UButton 
                label="Anuluj" 
                size="sm" 
                color="neutral" 
                @click="cancelEditing"
              />
            </div>
          </div>

          <small class="text-gray-500">{{ formatDate(post.createdAt) }}</small>
        </div>

        <div v-if="!post.isDeleted" class="ml-auto flex gap-2 items-start">

          <UTooltip text="Odpowiedź na ten post">
            <UButton icon="i-lucide-reply" size="md" color="info" variant="solid" />
          </UTooltip>

          <UTooltip v-if="(post.user.id === userStore.id || userStore.canEditAnyonePosts)" text="Edytuj post">
            <UButton icon="i-lucide-pencil" size="md" :color="userStore.canEditAnyonePosts ? 'primary': 'info'" variant="solid" @click="startEditing(post)"/>
          </UTooltip>

          <UTooltip v-if="(post.user.id === userStore.id || userStore.canEditAnyonePosts)" text="Usuń post" @click="startDeleting(post)">
            <UButton icon="i-lucide-x" size="md" color="error" variant="solid" />
          </UTooltip>

          <UTooltip v-if="post.user.id !== userStore.id" text="Zgłoś ten post">
            <UButton icon="i-lucide-message-circle-warning" size="md" color="error" variant="solid" />
          </UTooltip>
        </div>

        <UModal v-model:open="isDeleteModalOpen" title="Potwierdzenie usunięcia">
          <template #content>
            <div class="p-5">
              <p class="text-justify">Czy na pewno chcesz usunąć ten post? Tego działania nie można cofnąć.</p>
        
              <div class="flex justify-end gap-2 mt-4">
                <!-- Anulowanie -->
                <UButton 
                  label="Anuluj" 
                  color="neutral" 
                  variant="outline" 
                  @click="isDeleteModalOpen = false"
                />
          
                <!-- Potwierdzenie usunięcia -->
                <UButton 
                  label="Usuń" 
                  color="error" 
                  @click="deletePost"
                />
              </div>
            </div>
          </template>
        </UModal>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types/types';
import { formatDate } from '~/helpers/date'; // Funkcja do formatowania dat
import { useUserStore } from '~/stores/user';

// Props
interface Props {
  posts: Post[];
}

interface Editing {
  postId: number;
  content: string;
}

const props = defineProps<Props>();

const posts = ref(props.posts);

watch(() => props.posts, (nv) => {
  posts.value = nv;
});

const userStore = useUserStore();
const toast = useToast();

const editing = ref<Editing | null>(null);
const deleting = ref<number | null>(null);

const isDeleteModalOpen = ref(false);

const startEditing = (post: Post) => {
  editing.value = {
    postId: post.id,
    content: post.content
  };
};

const cancelEditing = () => {
  editing.value = null;
};

const saveContent = async () => {
  if(!editing.value) return;

  const config = useRuntimeConfig();

  try {
    await $fetch(`${config.public.API_URL}/posts`, {
      body: {
        postId: editing.value.postId,
        content: editing.value.content
      },
      method: 'patch',
      credentials: 'include'
    });

    const found = posts.value.find(post => post.id === editing.value?.postId);

    if(found) {
      found.content = editing.value.content;
    }

    editing.value = null;

    toast.add({
      title: 'Poprawnie edytowano post',
    });
  } catch (err) {
    const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';

    toast.add({
      title: 'Ups wystąpił problem',
      description: errorMessage
    });
  }
};

const startDeleting = (post: Post) => {
  deleting.value = post.id; 
  isDeleteModalOpen.value = true;
};

const deletePost = async () => {
  if(!deleting.value) return;

  const config = useRuntimeConfig();

  try {
    await $fetch(`${config.public.API_URL}/posts`, {
      body: {
        postId: deleting.value
      },
      method: 'delete',
      credentials: 'include'
    });

    const found = posts.value.find(post => post.id === deleting.value);

    if(found) {
      found.content = '[Post został usunięty]';
      found.isDeleted = true;
    }

    deleting.value = null;

    toast.add({
      title: 'Poprawnie usunięto post',
    });

    isDeleteModalOpen.value = false;
  } catch (err) {
    const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';

    toast.add({
      title: 'Ups wystąpił problem',
      description: errorMessage
    });
  }
};
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
