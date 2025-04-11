<template>
  <div class="flex gap-1">
    <UButton
      icon="i-lucide-plus"
      :color="reactionType === 'like' ? 'primary' :'neutral'"
      :variant="reactionType === 'like' ? 'soft' :'outline'"
      class="cursor-pointer"
      :ui="{
        leadingIcon: 'text-(--ui-primary)'
      }"
      :loading="isLoading"
      @click="changeReaction('like')"
    >
      {{ _post.reaction?.like }}
    </UButton>
  
    <UButton
      icon="i-lucide-minus"
      :color="reactionType === 'dislike' ? 'error' :'neutral'"
      :variant="reactionType === 'dislike' ? 'soft' :'outline'"
      class="cursor-pointer"
      :ui="{
        leadingIcon: 'text-(--ui-error)'
      }"
      :loading="isLoading"
      @click="changeReaction('dislike')"
    >
      {{ _post.reaction?.dislike }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { useUserStore } from '~/stores/user';
import type { Post, Reaction } from '~/types/types';


interface Props {
  post: Post
}

const props = defineProps<Props>();

const _post = ref(props.post);

const userStore = useUserStore();
const toast = useToast();
const isLoading = ref(false);

const changeReaction = (newReaction: Reaction) => {
  if(userStore.isLoggedIn) {
    if(reactionType.value === newReaction) {
      // kasowanie jeśli taka sama
      reactionType.value = null;
    } else {
      reactionType.value = newReaction;
    }
    isLoading.value = true;
  } else {
    toast.add({
      title: 'Nie jesteś zalogowany',
      description: 'Aby dodawac reakcje, stwórz konto',
    });
  }
  
};

const reactionType = ref<Reaction>(props.post.myReaction || null);

const config = useRuntimeConfig();

watchDebounced(reactionType, () => {
  addReaction();
}, {
  debounce: 700
});

const addReaction = async () => {
  try {

    const { post } = await useFetchWithAuth<{message: string; post: Post }>(`${config.public.API_URL}/reaction`, {
      method: 'POST',
      body: {
        postId: _post.value.id,
        reactionType: reactionType.value,
      },
    });

    reactionType.value = post.myReaction || null;
    _post.value.reaction = post.reaction;

  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>