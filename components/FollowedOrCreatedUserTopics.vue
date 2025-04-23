<template>
  <UContainer>
    <div v-if="data?.user" class="flex flex-wrap items-center space-y-4 mt-3">
      <user-img-with-popover :user="data.user" >
        <img
          :src="data.user.data?.image || ''"
          alt="Avatar"
          class="rounded-full w-32 h-32 object-cover"
        >
      </user-img-with-popover>

      <div class="sm:ml-5">
        <h2 class="text-xl font-semibold">
          <router-link :to="`/profiles/${data.user.username}`">
            {{ $route.params.username }}
          </router-link>
        </h2>
        <p class="text-gray-600 text-sm">{{ data.user.data?.bio }}</p>

        <p class="text-gray-400 text-sm mt-4">{{ data.user.data?.description }}</p>

      </div>
    </div>

    <div class="my-2 text-lg text-center">
      {{ headerLabel }}
    </div>

    <ul v-if="topicsList.length" class="mt-2 shadow bg-slate-800 rounded-lg divide-y divide-slate-950">
      <li v-for="topic in topicsList" :key="topic.id" class="p-2.5 hover:bg-slate-950">
        <div class="flex justify-between">
          <div class="flex flex-col">
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

            <UPopover :popper="{ placement: 'bottom-end' }">
              <UButton icon="i-lucide-more-vertical" size="md" variant="ghost" color="neutral" />

              <template #content>
                <div class="flex flex-col gap-1 p-2 min-w-[160px]">

                  <UButton
                    label="Przejdź do tematu"
                    variant="ghost"
                    :to="`/forums/${topic.forum?.slug}/topics/${topic.slug}`"
                  />

                  <UButton v-if="type === 'followed' && canEdit" label="Przestań obserwować temat" variant="ghost" color="error" icon="i-lucide-eye-off" @click="unfollowTopic(topic)" />
      
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </li>
    </ul>

    <div v-else class="text-center">
      <UIcon name="i-lucide-x" class="text-red-500"/> {{ noTopicsLabel }}
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { FollowTopicResponse, Topic, User } from '~/types/types';

interface Props {
  type: 'followed' | 'created-by-user';
  noTopicsLabel: string;
  headerLabel: string;
}

const userStore = useUserStore();
const canEdit = computed(() => userStore.username === route.params.username || ['admin', 'moderator'].includes(userStore.role));

const route = useRoute();
const props = defineProps<Props>();

const topicsList = computed(() => {
  if(!data.value) return [];

  if(props.type === 'followed') {
    if(!data.value.user.followedTopics) return [];

    return data.value.user.followedTopics;
  }
  else {
    return data.value.userTopics;
  }
});


const { data } = useAsyncData(
  `user-${route.params.username}`,
  async () => {

    const res = await useFetchWithAuth<{user: User, userTopics: Topic[]}>(`/users/${route.params.username}`);
    return res;
  },
  { server: true }
);

const toast = useToast();

const unfollowTopic = async (topic: Topic) => {
  if(!topic) return;
  
  try {
    const { message, topic: topicFromApi } = await useFetchWithAuth<FollowTopicResponse>('/topics/follow', {
      method: 'POST',
      body: {
        topicId: topic.id,
        follow: false
      }
    });

    const topicIndex = data.value?.user.followedTopics?.findIndex(top => top.id === topicFromApi.id);

    if(topicIndex !== undefined && topicIndex !== -1) {
      data.value?.user.followedTopics?.splice(topicIndex, 1);
    }
    
    toast.add({
      title: message
    });

  } catch (err) {
    console.error(err);
  }
};
</script>