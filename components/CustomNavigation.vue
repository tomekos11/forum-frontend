<template>
  <nav class="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-slate-950">
    <!-- Lewa strona - linki i wyszukiwarka -->
    <div class="flex items-center gap-4">
      <NuxtLink to="/" class="text-lg font-semibold hover:underline text-nowrap">Lista forów</NuxtLink>

      <UPopover
        v-model:open="isUsersListVisible"
        :content="{
          side: 'bottom',
          align: 'start',
        }"
          
        @close="isUsersListVisible = false"
      >
        <!-- To jest trigger popovera! -->
        <div class="relative inline-block w-full">
          <UInput
            v-model="usernameToSearch"
            placeholder="Użytkownik..."
            @update:model-value="debouncedSearchUsers"
          />
        </div>
          

        <template #content>
          <div class="p-2 w-[196px]">
            <template v-if="usersList.length">
              <NuxtLink
                v-for="user in usersList"
                :key="user.id"
                :to="`/profiles/${user.username}`"
                class="user-link flex items-center p-2 rounded hover:bg-slate-800 transition-colors"
              >
                <UAvatar
                  :src="user.data?.image || ''"
                  :alt="user?.username || 'Avatar'"
                  size="xs"
                />
                <span class="ml-2 text-sm">{{ user.username }}</span>
              </NuxtLink>
            </template>
            <div v-else class="text-sm">
              Nie znaleziono użytkownika
            </div>
          </div>
        </template>
      </UPopover>
    </div>

    <!-- Prawa strona - notyfikacje + użytkownik -->
    <div class="flex items-center gap-4">

      <notification-button />

      <template v-if="userStore.isLoggedIn">
        <UPopover v-model="isDropdownOpen" placement="bottom-end" @close="isDropdownOpen = false">
          <div class="flex items-center gap-2 cursor-pointer" @click="isDropdownOpen = true">
            <UAvatar :src="userStore.data?.image || ''" :alt="userStore?.username || 'Avatar'"  />
            <span>{{ userStore.username }}</span>
          </div>

          <template #content>
            <div class="dropdown-menu bg-slate-800">
              <UButton 
                label="Profil" 
                icon="i-lucide-user"
                variant="ghost"
                :to="`/profiles/${userStore.username}`"
              />
              <UButton 
                label="Zgłoszenia" 
                icon="i-lucide-message-circle-warning"
                variant="ghost"
                to="/reports"
              />
              <UButton 
                label="Wyloguj się" 
                color="error"
                icon="i-lucide-log-out"
                variant="ghost"
                @click="userStore.logout()"
              />
            </div>
          </template>
        </UPopover>
      </template>

      <template v-else>
        <UModal v-model:open="showModal" title="Zaloguj się">
          <UButton>Zaloguj</UButton>
          <template #content>
            <login-modal-content @close-modal="showModal = false"/>
          </template>
        </UModal>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useDebounceFn, useEventBus } from '@vueuse/core';
import { useUserStore } from '~/stores/user';
import type { User } from '~/types/types';

const isDropdownOpen = ref(false);
const isUsersListVisible = ref(false);
const showModal = ref(false);

const userStore = useUserStore();

const usernameToSearch = ref('');

const showLoginModal = () => {
  showModal.value = true;
};

const userBus = useEventBus<string | undefined>('user');

const unsubscribe = userBus.on(showLoginModal);

onBeforeUnmount(() => {
  unsubscribe();
});

const debouncedSearchUsers = useDebounceFn(() => findUsers(), 700);

const usersList = ref<User[]>([]);

const findUsers = async () => {
  if(!usernameToSearch.value) return;

  usersList.value = await useFetchWithAuth<User[]>('/users/find', {
    params: {
      name: usernameToSearch.value
    }
  });

  isUsersListVisible.value = true;
};

watch(usernameToSearch, (nv) => {
  if(!nv) {
    usersList.value = [];
  }
});
</script>

<style scoped>
/* Stylizacja menu */
.dropdown-menu {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
}

/* Stylizacja elementów menu */
.dropdown-item {
  margin-bottom: 8px;
}

.dropdown-item:last-child {
  margin-bottom: 0;
}

.user-link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
</style>