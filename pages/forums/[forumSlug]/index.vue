<template>
  <div class="mx-10">

    <div class="mt-10">
      <UBreadcrumb :items="items">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>

      <div class="text-xl text-center">Forum odnośnie cyberbezpieczeństwa</div>
      <div class="text-xl text-gray-500 font-bold text-center">{{ forumName }}</div>

      <div class="flex flex-col mt-10">
        <template v-for="(val, key) in reponse?.topics" :key="key">
      
          <NuxtLink 
            v-for="topic in reponse?.topics?.[key]" 
            :key="topic.slug" 
            :to="`/forums/${route.params.forumSlug}/topics/${topic.slug}`"
            class="block"
          >
            <UCard class="cursor-pointer hover:bg-green-700 transition">
              <template #header>
                <div class="flex items-center justify-between w-full">
                  <!-- Lewa strona -->
                  <div class="flex items-center">
                    <UAvatar src="https://github.com/benjamincanac.png" size="xl" class="mr-5"/>
                    <span>{{ topic.name }}</span>
                  </div>

                  <!-- Prawa strona (Counter + "odpowiedzi") -->
                  <div class="flex gap-5">
                    <div class="text-right">
                      <span class="font-bold text-lg">{{ topic.postCounter || 0 }}</span>
                      <div class="text-sm text-gray-400">odpowiedzi</div> 
                    </div>
                    <div class="w-[160px] truncate">
                      <UAvatar src="https://github.com/benjamincanac.png" size="md" class="mr-1"/>
                      <span class="text-sm">{{ topic.name }}</span>
                      <div class="text-sm text-center">
                        <span class="text-gray-400">{{ formatDate(topic.createdAt) }}</span>
                      </div>
                    </div>
                  </div>   
                </div>
              </template>
            </UCard>
          </NuxtLink>
        </template>

        <UPagination v-model:page="page" :total="100" class="mt-5 ml-auto mb-2"/>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui';
import { formatDate } from '~/helpers/date';
import type { Meta, Topic } from '~/types/types';

interface Reponse{
  meta: Meta;
  topics: {
    primaryTopics: Topic[];
    nonPrimaryTopics: Topic[];
  }
}

const config = useRuntimeConfig();
const route = useRoute();

const { data: forumName } = useFetch<Reponse>(`${config.public.API_URL}/forums/name`, {
  params: {
    slug: route.params.forumSlug
  }
});

const { data: reponse } = useFetch<Reponse>(`${config.public.API_URL}/topics/${route.params.forumSlug}`);

const page = ref(3);

const items= computed<BreadcrumbItem[]>(() => [
  {
    label: 'Forum cybersecurity',
    to: '/'
  },
  {
    label: forumName.value || '',
    to: `/forums/${route.params.forumSlug}`
  }
]);
</script>