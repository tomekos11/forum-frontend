<template>
  <div
    class="fixed bottom-0 left-0 w-full p-2 border-t shadow-md z-10"
    style="background: var(--ui-bg);"
  >
    <template v-if="topic.isClosed">
      <UIcon name="i-lucide-lock" size="xs" />
      Temat jest zamknięty. Nie można udzielić odpowiedzi
    </template>
    <template v-else-if="userStore.isLoggedIn">
      <UTextarea v-model="content" autoresize class="block"/>
      <UButton label="Dodaj post" class="mx-auto block" @click="addPost"/>
    </template>
    <template v-else>
      <span class="text-green-600 cursor-pointer hover:underline" @click="userBus.emit()">Zaloguj się</span>
      aby odpowiedzieć
    </template>
  </div>
</template>

<script setup lang="ts">
import { useEventBus } from '@vueuse/core';
import { useUserStore } from '~/stores/user';
import type { Post, Topic } from '~/types/types';

interface Props {
  topic: Topic;

}

const userStore = useUserStore();

const content = ref('');
const userBus = useEventBus<string>('user');
const toast = useToast();

const props = defineProps<Props>();
const emit = defineEmits(['post-added']);

const addPost = async () => {
  if(!content.value) return;

  try {
    const { post, message } = await useFetchWithAuth<{post: Post; message: string}>('/posts', {
      body: {
        topicId: props.topic.id,
        content: content.value
      },
      method: 'post',
    });

    emit('post-added', post);
    content.value = '';

    toast.add({
      title: message,
    });
  } catch (err) {
    const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';

    toast.add({
      title: 'Ups wystąpił problem',
      description: errorMessage
    });
  }
};

</script>