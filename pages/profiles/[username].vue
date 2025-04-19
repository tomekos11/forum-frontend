<template>
  <UContainer class="py-10 flex sm:flex-row flex-col gap-6">
    
    <UCard class="text-center bg-slate-950" style="width:min(500px,100%); min-width: 20%">
      <div v-if="data?.user" class="flex flex-col items-center space-y-4">
        <div class="relative inline-block w-fit">
          <img
            :src="data.user.data?.image || ''"
            alt="Avatar"
            class="rounded-full w-32 h-32 object-cover"
          >

          <ChangeUserPhoto v-if="canEdit" v-model:user="data.user" />
        </div>

        <div>
          <h2 class="text-xl font-semibold">{{ $route.params.username }}</h2>
          <p class="text-gray-600 text-sm">{{ data.user.data?.bio }}</p>

          <p class="text-gray-400 text-sm mt-4">{{ data.user.data?.description }}</p>

        </div>

        <UCard class="max-w-md mx-auto text-center mt-5 w-full ">
          <div class="flex justify-evenly text-sm flex-wrap">
            <div class="flex flex-col items-center justify-center">
              <div>{{ data.user.data?.stats?.posts }}</div>
              <div>Postów</div>
            </div>
  
            <UButton class="flex flex-col items-center justify-center" variant="soft" color="primary">
              <div>{{ data.user.data?.stats?.repPlus }}</div>
              <div>Reakcji</div>
            </UButton>

            <UButton class="flex flex-col items-center justify-center" variant="soft" color="error">
              <div>{{ data.user.data?.stats?.repMinus }}</div>
              <div>Reakcji</div>
            </UButton>
          </div>
        </UCard>

        <p class="text-sm text-gray-500">Konto założone {{ DateTime.fromISO(data.user?.createdAt).toRelative() }}</p>

        <ChangeUserDataModal v-if="canEdit" v-model:user="data.user" />
      </div>

      <template v-else>
        <div class="text-sm">Użytkownik o nazwie {{ $route.params.username }} nie został odnaleziony</div>

        <UInput v-model="searchQuery" icon="i-lucide-search" size="md" variant="outline" class="mt-2" placeholder="Wyszukaj innego użytkownika" @keydown.enter="$router.push(`/profiles/${searchQuery}`)" />
      </template>
    </UCard>

    <div class="flex grow flex-col gap-5">
      <UCard class="grow bg-slate-950">
        <div class="flex justify-between">
          <span>
            Obserwowane tematy
          </span>
          <UIcon name="i-lucide-eye" />
        </div> 
        <FollowedTopics v-if="data?.user" v-model:user="data.user" />
      </UCard>
  
      <UCard
        class="grow bg-slate-950"
        :ui="{
          body: 'h-full'
        }">
        <div class="flex justify-between">
          <span>
            Najpopularniejsze tematy stworzone przez użytkownika
          </span>
          <UIcon name="i-lucide-star" />
        </div> 
        <TopicsCreatedByUser v-if="data?.userTopics" v-model:topics="data.userTopics" />
      </UCard>
    </div>

  </UContainer>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { UCard } from '#components';
import { useUserStore } from '~/stores/user';
import type { User, Topic } from '~/types/types';

const userStore = useUserStore();
const canEdit = computed(() => userStore.username === route.params.username || ['admin', 'moderator'].includes(userStore.role));
const searchQuery = ref('');

const route = useRoute();

const { data } = useAsyncData(
  `user-${route.params.username}`,
  async () => {

    const res = await useFetchWithAuth<{user: User, userTopics: Topic[]}>(`/users/${route.params.username}`);
    return res;
  },
  { server: true }
);

</script>