<template>
  <div class="mx-10">
    <!-- Breadcrumb navigation -->
    <div class="mt-10">
      <UBreadcrumb :items="items">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>
    </div>

    <!-- Display posts -->
    <paginated-posts :posts="topic?.posts" class="mt-5" />

    <!-- Input area for new post -->
    <div class="fixed bottom-0 left-0 w-full  p-2 border-t shadow-md">
      <UTextarea v-model="content" autoresize class="block"/>
      <UButton label="Dodaj post" class="mx-auto block"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/helpers/date';
import type { Post, Topic } from '~/types/types';
import type { BreadcrumbItem } from '@nuxt/ui'

const config = useRuntimeConfig();
const route = useRoute();

const page = ref(3)

const content = ref('')

const items= computed<BreadcrumbItem[]>(() => [
  {
    label: 'Forum cybersecurity',
    to: '/'
  },
  {
    label: forumName.value || '',
    to: `/forums/${route.params.forumSlug}`
  },
  {
    label: topicName.value || '',
    to: `/forums/${route.params.forumSlug}/topics/${route.params.topicSlug}`
  }
])

const { data: forumName } = useFetch<string>(`${config.public.API_URL}/forums/name`, {
  params: {
    slug: route.params.forumSlug
  }
});

const { data: topicName } = useFetch<string>(`${config.public.API_URL}/topics/name`, {
  params: {
    slug: route.params.topicSlug
  }
});

const { data: topic } = useFetch<Topic>(`${config.public.API_URL}/posts/${route.params.topicSlug}`);
</script>