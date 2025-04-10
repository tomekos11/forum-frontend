<template>
  <div class="mx-2 sm:mx-4 md:mx-6 lg:mx-10">
    <!-- Breadcrumb navigation -->
    <div class="mt-10">
      <UBreadcrumb :items="items">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>
    </div>

    <!-- Display posts -->
    <UPagination v-model:page="page" :items-per-page="response?.meta.perPage" :total="response?.meta.total || 0" class="mt-5 ml-auto mb-2"/>

    <paginated-posts v-if="posts" :posts="posts" class="mt-5" />

    <UPagination  v-if="posts && posts.length" v-model:page="page" :items-per-page="response?.meta.perPage" :total="response?.meta.total || 0" class="mt-5 ml-auto mb-2" style="padding-bottom: 200px;"/>

    <!-- Input area for new post -->
    <div v-if="posts && posts.length" class="fixed bottom-0 left-0 w-full  p-2 border-t shadow-md " style="background: var(--ui-bg)">
      <template v-if="useUserStore().isLoggedIn">
        
        <UTextarea v-model="content" autoresize class="block"/>
        <UButton label="Dodaj post" class="mx-auto block" @click="addPost"/>
      </template>
      <template v-else>
        <span class="text-green-600 cursor-pointer hover:underline" @click="userBus.emit()">Zaloguj się</span>
        aby odpowiedzieć
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui';
import { useEventBus } from '@vueuse/core';
import { useUserStore } from '~/stores/user';
import type { Meta, Post, Topic } from '~/types/types';

interface Response {
  meta: Meta;
  topic: Topic;
  data: Post[];
}

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const userBus = useEventBus<string>('user');

const content = ref('');

const items= computed<BreadcrumbItem[]>(() => [
  {
    label: 'Forum cybersecurity',
    to: '/',
    icon: 'i-heroicons-home'
  },
  {
    label: forumName.value || '',
    to: `/forums/${route.params.forumSlug}`
  },
  {
    label: topicName.value || '',
    to: `/forums/${route.params.forumSlug}/topics/${route.params.topicSlug}`
  }
]);

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

const { data: response, refresh } = useAsyncData(
  `topic-${route.params.topicSlug}-${route.query.page || 1}`,
  async () => {

    const headers = import.meta.server 
      ? { cookie: useRequestHeaders(['cookie']).cookie || '' } 
      : {};
          
    const res = await $fetch<Response>(`${config.public.API_URL}/posts/${route.params.topicSlug}`, {
      params: {
        page: Number(route.query.page) || 1,
        perPage: 10,
      },
      credentials: 'include',
      headers
    });

    posts.value = res.data;

    return res;
  },
  { server: true }
);

const page = ref(Number(route.query.page) || 1);

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

const posts = ref<Post[]>(response.value?.data || []);

const addPost = async () => {
  if(!content.value) return;

  const config = useRuntimeConfig();

  try {
    const { post, message } = await $fetch<{post: Post; message: string}>(`${config.public.API_URL}/posts`, {
      body: {
        topicId: response.value?.topic.id,
        content: content.value
      },
      method: 'post',
      credentials: 'include'
    });

    posts.value.push(post);

    toast.add({
      title: message,
    });
  } catch (err) {
    const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';

    toast.add({
      title: 'Ups wystąpił problem',
      description: errorMessage
    });
  }
};
</script>