<template>
  <div class="space-y-4">
    <div v-if="!posts || !posts.length" class="p-4 rounded-lg shadow-sm bg-slate-800">
      <p>
        Brak postów na tej stronie. Przejdź na początek tematu
      </p>
      <UButton
        label="Kliknij aby przejść na strone 1"
        :to="{
          name: $route.name,
          params: $route.params,
          query: {...$route.query, page: 1 }
        }"
      />
    </div>
    <div
      v-for="(post) in posts"
      v-else
      :key="post.id"
      :class="`p-4 rounded-lg bg-slate-800  ${post.notification ? 'shadow-[0_4px_12px_rgba(0,255,0,0.3)]' : 'shadow-sm'}`"
    >
      <div class="flex">
        <UserImgWithPopover :user="post.user" size="big" />

        <div class="w-full">
          <h3 class="font-semibold text-lg text-green-600">{{ post.user.username }}</h3>

          <!-- Tryb wyświetlania i edycji -->
          <div v-if="editing?.postId !== post.id">
            <p class="text-gray-200">{{ post.content }}</p>
          </div>

          <div v-else>
            <UTextarea
              v-if="editing"
              v-model="editing.content"
              :ui="{
                base: 'w-full'
              }"
              autoresize/>

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

        <div v-if="!post.isDeleted" class="ml-auto flex gap-2 flex-col justify-between items-end">
          <UPopover :popper="{ placement: 'bottom-end' }">
            <UButton icon="i-lucide-more-vertical" size="md" variant="ghost" color="neutral" />

            <template #content>
              <div class="flex flex-col gap-1 p-2 min-w-[160px]">

                <!-- Pin post -->
                <UButton
                  v-if="userStore.isAdminOrModerator"
                  :icon="isPostPinned(post) ? 'i-lucide-badge-check' : 'i-lucide-badge-check'"
                  :label="isPostPinned(post) ? 'Odznacz jako wyróżniony' : 'Wyróżnij post'"
                  :color="isPostPinned(post) ? 'error' : 'neutral'"
                  :variant="isPostPinned(post) ? 'ghost' : 'soft'"
                  @click="$emit('pin-post', post)"
                />

                <div
                  v-else-if="isPostPinned(post)"
                  class="flex items-center gap-2 text-sm text-primary"
                >
                  <UIcon name="i-lucide-badge-check" />
                  <span>Wyróżniony post</span>
                </div>

                <!-- Reply -->
                <UButton
                  icon="i-lucide-reply"
                  label="Odpowiedz"
                  color="info"
                  variant="soft"
                />

                <!-- Edit -->
                <UButton
                  v-if="post.user.id === userStore.id || userStore.isAdminOrModerator"
                  icon="i-lucide-pencil"
                  label="Edytuj"
                  :color="userStore.isAdminOrModerator ? 'primary' : 'info'"
                  variant="soft"
                  @click="startEditing(post)"
                />

                <!-- Delete -->
                <UButton
                  v-if="post.user.id === userStore.id || userStore.isAdminOrModerator"
                  icon="i-lucide-x"
                  label="Usuń"
                  color="error"
                  variant="soft"
                  @click="startDeleting(post)"
                />

                <!-- Report -->
                <UButton
                  v-if="post.user.id !== userStore.id"
                  icon="i-lucide-message-circle-warning"
                  label="Zgłoś"
                  color="error"
                  variant="soft"
                />
      
              </div>
            </template>
          </UPopover>

          <reaction-segment v-if="post" :post="post" />
        </div>

        <UModal v-model:open="isDeleteModalOpen" title="Potwierdzenie usunięcia">
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
import { useFetchWithAuth } from '../composables/useFetchWithAuth';

// Props
interface Props {
  posts: Post[];
  pinnedPost: Post | null;
}

interface Editing {
  postId: number;
  content: string;
}

const props = defineProps<Props>();

defineEmits(['pin-post']);

const posts = ref(props.posts);

watch(() => props.posts, (nv) => {

  console.log(props.posts);
  posts.value = nv;
});

const userStore = useUserStore();
const toast = useToast();

const editing = ref<Editing | null>(null);
const deleting = ref<number | null>(null);

const isDeleteModalOpen = ref(false);

const isPostPinned = (post: Post) => {
  return post.id === props.pinnedPost?.id;
};

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

  try {
    await useFetchWithAuth('/posts', {
      body: {
        postId: editing.value.postId,
        content: editing.value.content
      },
      method: 'patch',
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

  try {

    await useFetchWithAuth('/posts', {
      body: {
        postId: deleting.value
      },
      method: 'delete',
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
