<template>
  <div class="mx-2 sm:mx-4 md:mx-6 lg:mx-10">
    <div class="mt-10">

      <UBreadcrumb :items="items">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>

      <div class="text-xl text-center">Forum odnośnie cyberbezpieczeństwa</div>

      <topics-search-bar />

      <div class="flex flex-col mt-10">
        <NuxtLink 
          v-for="forum in forums" 
          :key="forum.slug" 
          :to="`/forums/${forum.slug}`"
          class="block"
        >
          <UCard
            class="cursor-pointer mb-2 hover:bg-green-700 transition"
            :ui="{
              header: 'p-2'
            }"
          >
            <template #header>
              <div class="flex flex-wrap items-center justify-between w-full gap-4">
                <!-- Lewa strona -->
                <div class="flex items-center flex-1 sm:flex-row sm:items-center">
                  <UAvatar :text="forum.name[0].toUpperCase()" size="lg" class="mr-5"/>
                  <span class="text-sm sm:text-base whitespace-nowrap">{{ forum.name }}</span>
                </div>

                <!-- Prawa strona (Counter + "odpowiedzi") -->
                <div class="flex gap-3 sm:gap-5 items-center flex-wrap justify-center">
                  <div class="text-right gap-2 flex">
                    <UBadge
                      size="md"
                      color="neutral"
                      variant="outline"
                    >
                      Tematów {{ forum.topicsCount || 0 }}
                    </UBadge>
          
                    <UBadge
                      icon="i-lucide-notebook-pen"
                      size="md"
                      color="neutral"
                      variant="outline"
                    >
                      Postów {{ forum.postCounter || 0 }}
                    </UBadge>
                    
                  </div>
                  <div class="w-[160px] truncate">
                    <template v-if="forum.latestPost">
                      <user-img-with-popover :user="forum.latestPost.user" />
                      
                      <span class="text-sm">{{ forum.latestPost.topic?.name }}</span>
                      <div class="text-sm text-center">
                        <span class="text-gray-400">{{ formatDate(forum.latestPost.createdAt) }}</span>
                      </div>
                    </template>
                  </div>
                </div>   
              </div>
            </template>
          </UCard>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui';
import { formatDate } from '~/helpers/date';
import type { Forum } from '~/types/types';

const items: BreadcrumbItem[] = [
  {
    label: 'Forum cybersecurity',
    to: '/',
    icon: 'i-heroicons-home'
  },
];

const { data: forums } = useAsyncData(async () => {
  try {
    const res = await useFetchWithAuth<Forum[]>('/forums');
    return res;
  } catch (err) {
    return null; 
  }
      
});
</script>
