<template>
  <nav class="mx-10">
    <UNavigationMenu
      highlight
      highlight-color="primary"
      orientation="horizontal"
      :items="items"
      class="data-[orientation=horizontal]:border-b border-(--ui-border) data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
    > 
      <template #user>
        <template v-if="userStore.isLoggedIn">
          <!-- Dropdown menu -->
          <UPopover v-model="isDropdownOpen" placement="bottom-end" @close="isDropdownOpen = false">
            <!-- Główny przycisk -->
            <!-- <UButton label="Pokaż menu" class="bg-blue-500 text-white hover:bg-blue-600" /> -->

            <div @click="isDropdownOpen = true">
              <UAvatar src="https://github.com/benjamincanac.png" />

              {{ userStore.username }}
            </div>

            <!-- Zawartość rozwijanego menu -->
            <template #content>
              <div class="dropdown-menu">
                <UButton 
                  label="Profil" 
                  color="neutral"
                  class="hover:bg-gray-200"
                  @click="() => console.log(1)"
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
          <UModal v-model:open="showLoginModal" title="Zaloguj się">
            <UButton>Zaloguj się</UButton>
            <template #content>
              <login-modal-content @close-modal="showLoginModal = false"/>
            </template>
          </UModal>
        </template>
      </template>
      
    </UNavigationMenu >
  </nav>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { useForumsStore } from '~/stores/forum';
import { useUserStore } from '~/stores/user';

const isDropdownOpen = ref(false);
const showLoginModal = ref(false);

const userStore = useUserStore();
const forumsStore = useForumsStore();

const items = computed<NavigationMenuItem[][]>(() => ([
  [
    {
      label: 'Lista forów',
      icon: 'i-lucide-book-open',
      children: forumsStore.navigationForums
    },
  ],
  
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      badge: '3.8k',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    },
    {
      label: 'Help',
      icon: 'i-lucide-circle-help',
      disabled: true
    },
    {
      label: 'Zaloguj się',
      slot: 'user'
    },
  ]
]));
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
</style>