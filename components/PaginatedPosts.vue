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

          <template v-if="post.postHistories?.length && post.postHistories[0]">
            <div v-if="post.postHistories[0].editorId === post.userId" class="text-sm text-gray-500">
              {{post.postHistories[0].isDeleted ? 'Usunięty:' : 'Ostatnia edycja:' }} {{ formatDate(post.postHistories[0].createdAt || '') }}
            </div>
            <div v-else class="text-sm text-red-500">
              {{post.postHistories[0].isDeleted ? 'Usunięty:' : 'Ostatnia edycja:' }} {{ formatDate(post.postHistories[0]?.createdAt || '')}} przez {{ post.postHistories[0]?.editor.username }}
            </div>
          </template>
          <div class="text-sm text-gray-500 mt-4">Stworzony: {{ formatDate(post.createdAt) }}</div>
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

                <post-delete-button
                  v-if="post.user.id === userStore.id || userStore.isAdminOrModerator"
                  :post="post"
                  @delete="onDelete"
                />

                <post-report-button v-if="post.user.id !== userStore.id" :post="post" />
      
              </div>
            </template>
          </UPopover>

          <reaction-segment v-if="post" :post="post" />
        </div>
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
    const { message, post } = await useFetchWithAuth<{message: string; post:Post}>('/posts', {
      body: {
        postId: editing.value.postId,
        content: editing.value.content
      },
      method: 'patch',
    });

    const foundIndex = posts.value.findIndex(post => post.id === editing.value?.postId);

    if(foundIndex !== -1) {
      posts.value[foundIndex].content = post.content;
      posts.value[foundIndex].postHistories = post.postHistories;
    }

    editing.value = null;

    toast.add({
      title: 'Edycja posta',
      description: message
    });
  } catch (err) {
    const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';

    toast.add({
      title: 'Ups wystąpił problem',
      description: errorMessage
    });
  }
};

const onDelete = (p: Post) => {
  const foundIndex = posts.value.findIndex(post => post.id === p.id);

  if(foundIndex !== -1) {
    console.log('przypisuje');
    posts.value[foundIndex] = p;
  }

  toast.add({
    title: 'Poprawnie usunięto post',
  });
};

</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
