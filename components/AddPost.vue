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
      <UTextarea v-if="write" v-model="content" autoresize class="block"/>

      <div v-else class="prose max-w-none pb-8" v-html="parsedContent"/>
      
      <div class="py-5 flex justify-center gap-2 ">
        <UButton label="Dodaj post" variant="soft" @click="addPost"/>
        <UButton v-if="content.length" :label="write ? 'Podgląd' : 'Wróć do pisania'" color="info" variant="soft" @click="toggleView"/>
      </div>

      
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
const quoteBus = useEventBus<string>('quote');

const toast = useToast();

const props = defineProps<Props>();
const emit = defineEmits(['post-added']);

const write = ref(true);

const toggleView = () => {
  write.value = !write.value;
};

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

const unsubscribe = quoteBus.on((event, payload: string) => addQuote(payload));

const addQuote = (payload: string) => {
  const spacing = '\n\n';

  content.value = `${content.value}${content.value ? spacing : ''}[quote]${payload}[/quote]`;
};

const parsedContent = computed(() => {
  return content.value.replace(/\[quote](.*?)\[\/quote]/gs, (_, quoteText) => {
    return `
      <blockquote class="border-l-4 border-emerald-500 bg-gray-50 dark:bg-gray-800 p-4 my-4">
        <p class="text-gray-900 dark:text-gray-100">${quoteText.trim()}</p>
      </blockquote>
    `;
  });
});

onBeforeUnmount(() => {
  unsubscribe();
});

</script>