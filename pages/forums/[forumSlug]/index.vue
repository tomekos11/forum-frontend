<template>
  <div class="mx-2 sm:mx-4 md:mx-6 lg:mx-10">
    <div class="mt-10">
      <UBreadcrumb :items="items">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>

      <div class="text-xl text-center">Forum odnośnie cyberbezpieczeństwa</div>
      <div class="text-xl text-gray-500 font-bold text-center">{{ forumName }}</div>

      <div class="flex flex-col">
        <template v-for="(val, key) in response?.topics" :key="key">
          <NuxtLink 
            v-for="topic in response?.topics?.[key]" 
            :key="topic.slug" 
            :to="`/forums/${route.params.forumSlug}/topics/${topic.slug}`"
            class="block"
          >
            <UCard
              :ui="{
                header: 'p-2'
              }"
              :class="`cursor-pointer hover:bg-green-700 transition ${key === 'primaryTopics' ? 'bg-slate-800 mb-2' : ''}`"
            >
              <template #header>
                <div class="flex flex-wrap items-center justify-between w-full gap-4">
                  <!-- Lewa strona -->
                  <div class="flex items-center flex-1 sm:flex-row sm:items-center">
                    <UAvatar :text="topic.name[0].toUpperCase()" size="lg" :class="`mr-5 ${topic.isPrimary ? 'bg-slate-950' : ''}`"/>
                    <UIcon v-if="topic.isClosed" name="i-lucide-lock" size="xs" class="mr-2" />
                    <span class="text-sm sm:text-base whitespace-nowrap">{{ topic.name }}</span> <!-- Zapobiega zawijaniu -->
                  </div>

                  <!-- Prawa strona (Counter + "odpowiedzi") -->
                  <div class="flex gap-3 sm:gap-5 items-center justify-end">
                    <div class="text-right">
                      <span class="font-bold text-lg">{{ topic.postCounter || 0 }}</span>
                      <div class="text-sm text-gray-400">odpowiedzi</div>
                    </div>
                    <div class="w-[160px] truncate">
                      <template v-if="topic?.posts && topic.posts[0]">
                        <user-img-with-popover :user="topic.posts[0].user || null" />

                        <span class="text-sm">{{ topic.posts[0].user.username }}</span>
                        <div class="text-sm text-center">
                          <span class="text-gray-400">{{ formatDate(topic.createdAt) }}</span>
                        </div>
                      </template>
                    </div>
                  </div>   
                </div>
              </template>
            </UCard>
          </NuxtLink>

          <div v-if="key === 'primaryTopics'" class="flex justify-between mt-10 mb-2 flex-wrap gap-0.5">
            <div>
              <USelect
                v-model="sortBy"
                trailing-icon="i-lucide-arrow-down"

                size="md"
                :items="sortingOptions"
                class="w-48 mr-2"
                @update:model-value="refresh()"
              />

              <UInput
                v-model="filter"
                placeholder="Filtruj po nazwie"
                label="Bio"
                @update:model-value="debouncedRefresh"
              />
            </div>
            

            <UPagination v-model:page="page" :items-per-page="response?.meta.perPage" :total="response?.meta.total || 0"/>
                    
            <add-topic-modal v-if="userStore.isLoggedIn && forumName" :forum-name="forumName" :forum-slug="$route.params.forumSlug.toString()"/>
          </div>
        </template>

        <UPagination v-model:page="page" :items-per-page="response?.meta.perPage" :total="response?.meta.total || 0" class="mt-5 ml-auto mb-2"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui';
import { useDebounceFn } from '@vueuse/core';
import { formatDate } from '~/helpers/date';
import { useUserStore } from '~/stores/user';
import type { Meta, Topic } from '~/types/types';

interface Response{
  meta: Meta;
  topics: {
    primaryTopics: Topic[];
    nonPrimaryTopics: Topic[];
  }
}

const userStore = useUserStore();
const config = useRuntimeConfig();
const route = useRoute();

const sortingOptions = ref([
  [
    { value: 'created_at_asc', label: 'Najnowszy temat', key: 'created_at', order: 'desc' },
    { value: 'created_at_desc', label: 'Najstarszy temat', key: 'created_at', order: 'asc' },
    { value: 'last_post_asc', label: 'Od najmłodszego posta', key: 'last_post', order: 'desc' },
  ],
  [
    { value: 'posts_count_asc', label: 'Największa ilość odpowiedzi', key: 'posts_count', order: 'desc'  },
    { value: 'posts_count_desc', label: 'Najmniejsza ilość odpowiedzi', key: 'posts_count', order: 'asc'  },
  ],
  [
    { value: 'name_asc', label: 'Nazwa alfabetycznie rosnąco', key: 'name', order: 'asc'  },
    { value: 'name_desc', label: 'Nazwa alfabetycznie malejąco', key: 'name', order: 'desc'  }
  ],
  [
    { value: 'is_closed_asc', label: 'Otwarty', key: 'is_closed', order: 'asc'  },
    { value: 'is_closed_desc', label: 'Zamknięty', key: 'is_closed', order: 'desc'  }
  ]
]);

const filter = ref('');

const debouncedRefresh = useDebounceFn(() => refresh(), 700);

const sortBy = ref(sortingOptions.value[0][0].value);

const sortByKey = computed(() => sortingOptions.value.flat().find(el => el.value === sortBy.value)?.key);
const sortByOrder = computed(() => sortingOptions.value.flat().find(el => el.value === sortBy.value)?.order);

const { data: forumName } = useFetch<string>(`${config.public.API_URL}/forums/name`, {
  params: {
    slug: route.params.forumSlug
  }
});

const { data: response, refresh } = useAsyncData(
  `forum-${route.params.forumSlug}-${route.query.page}`,
  async () => {

    const res = await useFetchWithAuth<Response>(`/topics/${route.params.forumSlug}`, {
      params: {
        page: Number(route.query.page) || 1,
        perPage: 10,
        sortBy: sortByKey.value,
        order: sortByOrder.value,
        filter: filter.value,
      },
    });

    return res;
  },
  { server: true }
);


const page = ref(Number(route.query.page) || 1);
const router = useRouter();

router.replace({
  query: {
    ...route.query,
    page: String(page.value),
  },
});

watch(page, async () => {
  await router.replace({
    query: {
      ...route.query,
      page: String(page.value),
    },
  });
});


watch(() => route.query.page, async (nv) => {
  if(nv) {
    page.value = Number(nv);
  }
  
  refresh();
});

const items= computed<BreadcrumbItem[]>(() => [
  {
    label: 'Forum cybersecurity',
    to: '/',
    icon: 'i-heroicons-home'
  },
  {
    label: forumName.value || '',
    to: `/forums/${route.params.forumSlug}`
  }
]);
</script>
