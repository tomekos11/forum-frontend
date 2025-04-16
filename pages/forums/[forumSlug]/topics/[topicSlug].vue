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
    <!-- <UPagination v-model:page="page" :items-per-page="response?.meta.perPage" :total="response?.meta.total || 0" class="mt-5 ml-auto mb-2"/> -->
      
    <div class="flex flex-wrap items-center justify-between mt-5 mb-2">
      <!-- Sortowanie -->
      <!-- <USelect
        v-model="sortBy"
        trailing-icon="i-lucide-arrow-down"

        size="md"
        :items="sortingOptions"
        class="w-48"
        @update:model-value="refresh()"
      /> -->

      <!-- Paginacja -->
      <UPagination
        v-model:page="page"
        :items-per-page="response?.meta.perPage"
        :total="response?.meta.total || 0"
        class="mb-2 sm:mb-0"
      />


      <div>
        <UIcon v-if="response?.topic.isClosed" name="i-lucide-lock" size="xs" />

        <UDropdownMenu
          :items="[{}]"
        >
          <UButton variant="ghost" aria-label="Ustawienia" icon="i-lucide-settings">
            Opcje
          </UButton>

          <template #item>
            <div class="flex flex-col gap-1">
              <USelect
                v-model="sortBy"
                trailing-icon="i-lucide-arrow-down"

                size="md"
                :items="sortingOptions"
                class="w-48"
                @update:model-value="refresh()"
              />

              <UButton v-if="!response?.topic.isClosed" label="Zamknij temat" variant="ghost" color="neutral" icon="i-lucide-lock" @click="closeTopic" />
              <UButton v-else label="Otwórz temat" variant="ghost" color="neutral" icon="i-lucide-key" @click="openTopic" />

              <UButton label="Obserwuj temat" variant="ghost" color="neutral" icon="i-lucide-eye" />

            </div>
          </template>
        </UDropdownMenu>
      </div>

    </div>

    <pinned-post v-if="response?.topic && response.topic.pinnedPost" :post="response.topic.pinnedPost" class="mb-2"/>

    <paginated-posts v-if="posts" :posts="posts" :pinned-post="response?.topic.pinnedPost || null" class="mt-5" @pin-post="pinPost" />

    <UPagination  v-if="posts && posts.length" v-model:page="page" :items-per-page="response?.meta.perPage" :total="response?.meta.total || 0" class="mt-5 ml-auto mb-2" style="padding-bottom: 200px;"/>

    <!-- Input area for new post -->
    <div v-if="posts && posts.length" class="fixed bottom-0 left-0 w-full  p-2 border-t shadow-md " style="background: var(--ui-bg)">
      <template v-if="response?.topic.isClosed">
        <UIcon name="i-lucide-lock" size="xs" />
        Post jest zamknięty. Nie można udzielić odpowiedzi
      </template>
      <template v-else-if="useUserStore().isLoggedIn">
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
import { useFetchWithAuth } from '~/composables/useFetchWithAuth';
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

const sortingOptions = ref([
  [
    { value: 'created_at_asc', label: 'Najnowsze', key: 'created_at', order: 'desc' },
    { value: 'created_at_desc', label: 'Najstarsze', key: 'created_at', order: 'asc' }
  ],
  [
    { value: 'reaction_count_asc', label: 'Największa ilość reakcji', key: 'reaction_count', order: 'asc'  },
    { value: 'reaction_count_desc', label: 'Najmniejsza ilość reakcji', key: 'reaction_count', order: 'desc'  }
  ]
]);

const sortBy = ref(sortingOptions.value[0][0].value);

const sortByKey = computed(() => sortingOptions.value.flat().find(el => el.value === sortBy.value)?.key);
const sortByOrder = computed(() => sortingOptions.value.flat().find(el => el.value === sortBy.value)?.order);

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
  `topic-${route.params.topicSlug}-${useUserStore().username}-${route.query.page || 1}-${sortBy.value}`,
  async () => {

    const res = await useFetchWithAuth<Response>(`/posts/${route.params.topicSlug}`, {
      params: {
        page: Number(route.query.page) || 1,
        perPage: 10,
        sortBy: sortByKey.value,
        order: sortByOrder.value,
      },
    });

    posts.value = res.data;

    return res;
  },
  { server: true }
);

watch(() => useUserStore().isLoggedIn, async () => {
  setTimeout(() => refresh(), 100);
});

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

  try {
    const { post, message } = await useFetchWithAuth<{post: Post; message: string}>('/posts', {
      body: {
        topicId: response.value?.topic.id,
        content: content.value
      },
      method: 'post',
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

const pinPost = async (post: Post) => {
  if(response.value?.topic.pinnedPost?.id === post.id) return;


  try {
    const { message, topic } = await useFetchWithAuth<{message: string; topic: Topic}>('/posts/pin', {
      body: {
        topicId: post.topicId,
        postId: post.id,
      },
      method: 'POST'
    });


    if(response.value) {
      response.value.topic = topic;
    }
    
    toast.add({
      title: message,
    });

  } catch (e) {
    console.error(e);
  }
};

const closeTopic = async () => {
  if(!response.value?.topic) return;
  
  try {
    const res = await useFetchWithAuth<Topic>(`/topics/${response.value.topic.slug}/close`, {
      method: 'PATCH',
    });

    response.value.topic = res;
  } catch (err) {
    console.error(err);
  }
  
};

const openTopic = async () => {
  if(!response.value?.topic) return;
  
  try {
    const res = await useFetchWithAuth<Topic>(`/topics/${response.value.topic.slug}/open`, {
      method: 'PATCH',
    });

    response.value.topic = res;
  } catch (err) {
    console.error(err);
  }

};
</script>