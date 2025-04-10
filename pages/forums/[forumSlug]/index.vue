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

      <div class="flex justify-between mt-10 mb-2">
        <UPagination v-model:page="page" :items-per-page="response?.meta.perPage" :total="response?.meta.total || 0"/>

        <add-topic-modal v-if="userStore.isLoggedIn && forumName" :forum-name="forumName" :forum-slug="$route.params.forumSlug.toString()"/>
      </div>

      <div class="flex flex-col">
        <template v-for="(val, key) in response?.topics" :key="key">
          <NuxtLink 
            v-for="topic in response?.topics?.[key]" 
            :key="topic.slug" 
            :to="`/forums/${route.params.forumSlug}/topics/${topic.slug}`"
            class="block"
          >
            <UCard class="cursor-pointer hover:bg-green-700 transition">
              <template #header>
                <div class="flex flex-wrap items-center justify-between w-full gap-4">
                  <!-- Lewa strona -->
                  <div class="flex items-center flex-1 sm:flex-row sm:items-center">
                    <UAvatar src="https://github.com/benjamincanac.png" size="lg" class="mr-5"/>
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
        </template>

        <UPagination v-model:page="page" :items-per-page="response?.meta.perPage" :total="response?.meta.total || 0" class="mt-5 ml-auto mb-2"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui';
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

const { data: forumName } = useFetch<string>(`${config.public.API_URL}/forums/name`, {
  params: {
    slug: route.params.forumSlug
  }
});

const { data: response, refresh } = useAsyncData(
  `forum-${route.params.forumSlug}-${route.query.page}`,
  async () => {
    const res = await $fetch<Response>(`${config.public.API_URL}/topics/${route.params.forumSlug}`, {
      params: {
        page: Number(route.query.page) || 1,
        perPage: 10,
      }, 
      credentials: 'include'
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
