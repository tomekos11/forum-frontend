<template>
  <div class="mx-10">
    <div class="mt-10">

      <UBreadcrumb :items="items">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>

    </div>
    {{ posts }}
    
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/helpers/date';
import type { Topic } from '~/types/types';
import type { BreadcrumbItem } from '@nuxt/ui'

interface Reponse{ 
  primaryTopics: Topic[]
  nonPrimaryTopics: Topic[]
}

const config = useRuntimeConfig();
const route = useRoute();

const { data: forumName } = useFetch<string>(`${config.public.API_URL}/forums/name`, {
  params: {
    id: route.params.forumId
  }
});

const { data: topicName } = useFetch<string>(`${config.public.API_URL}/topics/name`, {
  params: {
    id: route.params.topicId
  }
});

const { data: posts } = useFetch<Reponse>(`${config.public.API_URL}/posts/${route.params.topicId}`);

const page = ref(3)

const items= computed<BreadcrumbItem[]>(() => [
  {
    label: 'Forum cybersecurity',
    to: '/'
  },
  {
    label: forumName.value || '',
    to: `/forums/${route.params.forumId}`
  },
  {
    label: topicName.value || '',
    to: `/forums/${route.params.forumId}/topics/${route.params.topicId}`
  }
])
</script>