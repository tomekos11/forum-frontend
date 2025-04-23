<template>
  <div class="w-full max-w-md mx-auto mt-10">
    <UInput
      v-model="searchQuery"
      icon="i-lucide-search"
      size="xl"
      :ui="{
        root: 'w-full'
      }"
      variant="outline"
      placeholder="Wyszukaj temat"
      @update:model-value="onInput"
    />

    <p v-if="loading || status === 'pending'" class="mt-2 text-gray-500">Trwa ładowanie wyników</p>

    <template v-else-if="forums.length">
      <div v-for="forum in forums" :key="forum.id">
       
        <ul v-if="forum.topics.length" class="mt-2 shadow bg-slate-800 rounded-lg divide-y divide-slate-950">
          <li v-for="topic in forum.topics" :key="topic.id" class="p-2.5 hover:bg-slate-950 cursor-pointer">
            <router-link :to="`/forums/${forum.slug}/topics/${topic.slug}`" class="flex justify-between">
              <div class="flex flex-col">
                <small class="text-gray-500">{{ forum.name }}</small>
                <small>{{ topic.name }}</small>
              </div>
              <div class="flex items-center gap-2">
                <UIcon
                  v-if="topic.isPrimary"
                  name="i-lucide-star"
                  size="md"
                />

                <UBadge
                  icon="i-lucide-notebook-pen"
                  size="md"
                  color="neutral"
                  variant="outline"
                  class="text-[11px]"
                >
                  {{ topic.postCounter }}
                </UBadge>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </template>

    <p v-else-if="searchQuery" class="mt-2 text-gray-500">Brak wyników.</p>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import type { Forum } from '~/types/types';


const loading = ref(false);
const searchQuery = ref('');


const { data: forums, status, execute: search } = useAsyncData(async () => {
  if(!searchQuery.value) {
    loading.value = false;
    return [];
  }

  try {
    console.log('wysylam');
    const res = useFetchWithAuth<Forum[]>('/forums/findTopic', {
      params: {
        filter: searchQuery.value
      }
    });

    return res;
  } catch (err) {
    return [];
  } finally {
    loading.value = false;
  }
}, {
  default: () => [],
  lazy: true,
  server: false,
  immediate: false,
});

const onInput = (searchQuery: string | number) => {
  if(searchQuery) {
    loading.value = true;
  }
  debouncedSearch();
};

const debouncedSearch = useDebounceFn(search, 400);
</script>