<template>
  <nav class="mx-2 sm:mx-4 md:mx-6 lg:mx-10">
    <UNavigationMenu
      highlight
      highlight-color="primary"
      orientation="horizontal"
      :items="items"
      class="data-[orientation=horizontal]:border-b border-(--ui-border) data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
    > 
      <template #user>
        <template v-if="userStore.isLoggedIn">
          <UPopover v-model="isDropdownOpen" placement="bottom-end" @close="isDropdownOpen = false">

            <div @click="isDropdownOpen = true">
              <UAvatar :src="userStore.data?.image || ''" />

              {{ userStore.username }}
            </div>

            <template #content>
              <div class="dropdown-menu">
                <UButton 
                  label="Profil" 
                  color="neutral"
                  class="hover:bg-gray-200"
                  :to="`/profiles/${userStore.username}`"
                />
                <UButton 
                  label="Ustawienia" 
                  color="neutral"
                  class="hover:bg-gray-200"
                  @click="() => console.log(2)"
                />
                <UButton 
                  label="Wyloguj się" 
                  color="neutral"
                  class="text-red-500 hover:bg-red-100" 
                  @click="userStore.logout()"
                />
              </div>
            </template>
          </UPopover>
        </template>

        <template v-else>
          <UModal v-model:open="showModal" title="Zaloguj się">
            <UButton>Zaloguj się</UButton>
            <template #content>
              <login-modal-content @close-modal="showModal = false"/>
            </template>
          </UModal>
        </template>
      </template>


      <template #users-search>
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
                  <UAvatar :src="user.data?.image || ''" size="xs"/>
                  <span class="ml-2 text-sm">{{ user.username }}</span>
                </NuxtLink>
              </template>
              <div v-else class="text-sm">
                Nie znaleziono użytkownika
              </div>
            </div>
          </template>
        </UPopover>
      </template>

      <!-- <template #notifications>
        <UChip inset color="error">
          <UButton icon="i-lucide-bell" variant="ghost" color="neutral"/>
        </UChip>
      </template> -->
      
    </UNavigationMenu >
  </nav>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { useDebounceFn, useEventBus } from '@vueuse/core';
import { useForumsStore } from '~/stores/forum';
import { useUserStore } from '~/stores/user';
import type { User } from '~/types/types';

const isDropdownOpen = ref(false);
const isUsersListVisible = ref(false);
const showModal = ref(false);

const userStore = useUserStore();
const forumsStore = useForumsStore();

const items = computed<NavigationMenuItem[][]>(() => ([
  [
    {
      label: 'Lista forów',
      icon: 'i-lucide-book-open',
      children: forumsStore.navigationForums
    },
    {
      slot: 'users-search'
    }
  ],
  
  [
    {
      slot: 'notifications',
    },
    {
      slot: 'user'
    },
  ]
]));

const usernameToSearch = ref('');

const showLoginModal = () => {
  showModal.value = true;
};

const userBus = useEventBus<string | undefined>('user');

const unsubscribe = userBus.on(showLoginModal);

onBeforeUnmount(() => {
  unsubscribe();
});

watch(() => userStore.isLoggedIn, (nv) => {
  console.log(nv);
}, {
  immediate: true
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
  background-color: white !important;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  padding: 8px;
}

/* Stylizacja elementów menu */
.dropdown-item {
  margin-bottom: 8px;
}

.dropdown-item:last-child {
  margin-bottom: 0;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.user-link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
</style>