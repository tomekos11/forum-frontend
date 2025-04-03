<template>
  <div class="space-y-4">
    <div
      v-for="(post, index) in posts"
      :key="post.id"
      :class="[
        'p-4 rounded-lg shadow-sm',
        index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
      ]"
    >

      <div class="flex">
        <img class="rounded-sm mr-5 w-[100px] max-h-[100px]" src="https://github.com/benjamincanac.png" >
        <div>
          <h3 class="font-semibold text-lg text-green-600">{{ post.user.username }}</h3>
          <p class="text-gray-700">{{ post.content }}</p>
          <small class="text-gray-500">{{ formatDate(post.createdAt) }}</small>
        </div>

        <div class="ml-auto flex gap-2 items-start">

          <UTooltip text="Odpowiedź na te wiadomość">
            <UButton icon="i-lucide-reply" size="md" color="info" variant="solid" />
          </UTooltip>

          <UTooltip text="Edytuj wiadomość">
            <UButton icon="i-lucide-pencil" size="md" color="info" variant="solid" />
          </UTooltip>

          <UTooltip text="Zgłoś te wiadomość">
            <UButton icon="i-lucide-message-circle-warning" size="md" color="error" variant="solid" />
          </UTooltip>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types/types';
import { formatDate } from '~/helpers/date'; // Funkcja do formatowania dat

// Props
interface Props {
  posts: Post[];
}

defineProps<Props>();
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
