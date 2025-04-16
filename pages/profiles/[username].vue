<template>
  <UContainer class="py-10">
    <UCard class="max-w-md mx-auto text-center">
      <div v-if="user" class="flex flex-col items-center space-y-4">
        <div class="relative inline-block w-fit">
          <img
            :src="user.data?.image || ''"
            alt="Avatar"
            class="rounded-full w-32 h-32 object-cover"
          >

          <ChangeUserPhoto v-if="canEdit" v-model:user="user" />
        </div>

        <div>
          <h2 class="text-xl font-semibold">{{ $route.params.username }}</h2>
          <p class="text-gray-600 text-sm">{{ user.data?.bio }}</p>

          <p class="text-gray-400 text-sm mt-4">{{ user.data?.description }}</p>

        </div>

        <UCard class="max-w-md mx-auto text-center mt-5 w-full">
          <div class="flex justify-evenly text-sm flex-wrap">
            <div class="flex flex-col items-center justify-center">
              <div>{{ user.data?.stats?.posts }}</div>
              <div>Postów</div>
            </div>
  
            <UButton class="flex flex-col items-center justify-center" variant="soft" color="primary">
              <div>{{ user.data?.stats?.repPlus }}</div>
              <div>Reakcji</div>
            </UButton>

            <UButton class="flex flex-col items-center justify-center" variant="soft" color="error">
              <div>{{ user.data?.stats?.repMinus }}</div>
              <div>Reakcji</div>
            </UButton>
          </div>
        </UCard>

        <p class="text-sm text-gray-500">Konto założone {{ DateTime.fromISO(user?.createdAt).toRelative() }}</p>

        <ChangeUserDataModal v-if="canEdit" v-model:user="user" />
      </div>

      <template v-else>
        <div class="text-sm">Użytkownik o nazwie {{ $route.params.username }} nie został odnaleziony</div>

        <UInput v-model="searchQuery" icon="i-lucide-search" size="md" variant="outline" class="mt-2" placeholder="Wyszukaj innego użytkownika" @keydown.enter="$router.push(`/profiles/${searchQuery}`)" />
      </template>
    </UCard>

    <UCard>
      Obserwowane tematy
      <FollowedTopics v-if="user" v-model:user="user" />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { UCard } from '#components';
import { useUserStore } from '~/stores/user';
import type { User } from '~/types/types';

const userStore = useUserStore();
const canEdit = computed(() => userStore.username === route.params.username || ['admin', 'moderator'].includes(userStore.role));
const searchQuery = ref('');

const route = useRoute();

const { data: user } = useAsyncData(
  `user-${route.params.username}`,
  async () => {

    const user = await useFetchWithAuth<User>(`/users/${route.params.username}`);
    return user;
  },
  { server: true }
);

</script>