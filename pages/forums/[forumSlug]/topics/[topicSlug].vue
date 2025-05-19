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
      
    <div class="flex flex-wrap items-center justify-between mt-5 mb-2">

      <USelect
        v-model="sortBy"
        trailing-icon="i-lucide-arrow-down"

        size="md"
        :items="sortingOptions"
        class="w-48"
        @update:model-value="refresh()"
      />
              
      <!-- Paginacja -->
      <UPagination
        v-model:page="page"
        :items-per-page="postsStore.meta?.perPage || 10"
        :total="postsStore.meta?.total || 0"
        class="mb-2 sm:mb-0"
      />


      <div>

        <UTooltip text="Temat jest zamknięty" >
          <UIcon v-if="postsStore.topic?.isClosed" name="i-lucide-lock" size="xs" class="mr-5" />
        </UTooltip>

        <UTooltip text="Obserwujesz ten temat">
          <UIcon v-if="postsStore.topic?.isFollowed" name="i-lucide-eye" size="xs" class="mr-5" />
        </UTooltip>

        <UDropdownMenu
          :items="[{}]"
        >
          <UButton variant="ghost" aria-label="Ustawienia" icon="i-lucide-settings">
            Opcje
          </UButton>

          <template #item>
            <div class="flex flex-col gap-1">
              <template v-if="userStore.isAdminOrModerator">
                <UButton v-if="!postsStore.topic?.isClosed" label="Zamknij temat" variant="ghost" color="neutral" icon="i-lucide-lock" @click="postsStore.closeTopic" />
                <UButton v-else label="Otwórz temat" variant="ghost" color="neutral" icon="i-lucide-key" @click="postsStore.openTopic" />
              </template>

              <UButton v-if="!postsStore.topic?.isFollowed" label="Obserwuj temat" variant="ghost" color="neutral" icon="i-lucide-eye" @click="postsStore.followTopic(true)" />
              <UButton v-else label="Przestań obserwować temat" variant="ghost" color="neutral" icon="i-lucide-eye-off" @click="postsStore.followTopic(false)" />
            </div>
          </template>
        </UDropdownMenu>
      </div>

    </div>

    <pinned-post v-if="postsStore.pinnedPost" class="mb-2" />

    <post-loading v-if="postLoadingStatus === 'pending'" />
    <paginated-posts v-else :posts="postsStore.posts" :pinned-post="postsStore.topic?.pinnedPost || null" class="mt-5" />


    <UPagination  v-if="postsStore.posts && postsStore.posts.length" v-model:page="page" :items-per-page="postsStore.meta?.perPage" :total="postsStore.meta?.total || 0" class="mt-5 ml-auto mb-2 pb-[200px]"/>

    <add-post v-if="postsStore?.topic && postsStore.posts && postsStore.posts.length" :topic="postsStore.topic" @post-added="(post: Post) => postsStore.posts.push(post)"/>
      
  </div>

</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui';
import { useUserStore } from '~/stores/user';
import type { Post } from '~/types/types';
import { usePostsStore } from '~/stores/posts';

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const postsStore = usePostsStore();

const sortingOptions = ref([
  [
    { value: 'created_at_desc', label: 'Najstarsze', key: 'created_at', order: 'asc' },
    { value: 'created_at_asc', label: 'Najnowsze', key: 'created_at', order: 'desc' },
  ],
  [
    { value: 'reaction_count_asc', label: 'Od najlepszych rekacji', key: 'reaction_count', order: 'desc'  },
    { value: 'reaction_count_desc', label: 'Od najgorszych reakcji', key: 'reaction_count', order: 'asc'  },
  ]
]);

const sortBy = ref(sortingOptions.value[0][0].value);

const sortByKey = computed(() => sortingOptions.value.flat().find(el => el.value === sortBy.value)?.key);
const sortByOrder = computed(() => sortingOptions.value.flat().find(el => el.value === sortBy.value)?.order);

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

const fetchKey = computed(() => 
  `posts-${route.params.topicSlug}-${route.query.page}-${sortBy.value}`
);

const { refresh, status: postLoadingStatus } = await useAsyncData(
  fetchKey.value,
  () => postsStore.fetchPosts(
    route.params.topicSlug as string,
    {
      page: Number(route.query.page) || 1,
      perPage: 10,
      sortBy: sortByKey.value,
      order: sortByOrder.value
    }
  ),
  {
    server: true,
    watch: [() => route.query.page, sortBy]
  }
);

const page = computed({
  get: () => Number(route.query.page) || 1,
  set: (value) => {
    router.replace({ query: { ...route.query, page: value } });
  }
});

watch(() => useUserStore().isLoggedIn, async () => {
  setTimeout(() => refresh(), 100);
});

</script>