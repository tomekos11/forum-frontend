<template>
  <UAccordion
    v-if="user?.followedTopics"
    :ui="{
      body: 'px-3',
      header: 'hover:bg-green-800 px-3 transition'
    }"
    :items="user.followedTopics"
  >
    <template #leading="{ item: topic }">
      <div class="flex items-center gap-2 ">
        <div>
          {{ topic.name }}
        </div>
      </div>
    </template>

    <template #body="{ item: topic }">
      <!-- <p class="text-sm text-gray-500">
        Tutaj potencjalny opis tematu <strong>{{ topic.name }}</strong> 
      </p> -->

      <p class="text-sm text-gray-500 line-clamp-3">
        <!-- {{ topic.posts?.[0]?.content }} -->
        {{ topic.posts?.[0]?.content || 'Brak postów 💥'}}
      </p>

      <UButton
        color="primary"
        size="xs"
        variant="ghost"
        class="mt-3 mr-2"
        :to="`/forums/${topic.forum?.slug}/topics/${topic.slug}`"
      >
        Przejdź do tematu
      </UButton>

      <UButton
        v-if="canUnfollow"
        color="error"
        size="xs"
        variant="ghost"
        icon="i-heroicons-x-mark"
        class="mt-3 cursor-pointer"
        @click.stop="unfollow(topic)"
      >
        Odobserwuj
      </UButton>
    </template>
  </UAccordion>

  <div v-if="!user?.followedTopics?.length" class="text-sm mt-4">
    <UIcon name="i-lucide-x" class="text-red-500"/> Brak obserwowanych tematów
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { Topic, User } from '~/types/types';

const user = defineModel<User>('user');
const route = useRoute();
const userStore = useUserStore();

const canUnfollow = computed(() => userStore.username === route.params.username);

const toast = useToast();

interface Response {
  followed: boolean;
  message: string;
  topic: Topic;
}

const unfollow = async (topic: Topic) => {

  const res = await useFetchWithAuth<Response>('/topics/follow', {
    method: 'POST',
    body: {
      topicId: topic.id,
      follow: false
    }
  });

  toast.add({
    title: res.message
  });

};

</script>