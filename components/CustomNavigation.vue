<template>
  <nav class="mx-10">
    <UNavigationMenu
      highlight
      highlight-color="primary"
      orientation="horizontal"
      :items="items"
      class="data-[orientation=horizontal]:border-b border-(--ui-border) data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
    > 
      <!-- <template #logged-user-leading>
        <UAvatar src="https://github.com/benjamincanac.png" />
      </template> -->

      <template #user>
        <template v-if="userStore.isLoggedIn">
          <UAvatar src="https://github.com/benjamincanac.png" />

          {{ userStore.username }}
          
          <!-- Dropdown menu -->
          <UPopover placement="bottom-end" @close="isDropdownOpen = false">
            <UButton label="Pokaż menu" />

            <template #content>
              <div @click="logout">
                Wyloguj się
              </div>
            </template>
          </UPopover>

        </template>

        <template v-else>
          <UModal title="Zaloguj się">
            <UButton>Zaloguj się</UButton>
            <template #content>
              <login-modal-content />
            </template>
          </UModal>
        </template>
      </template>
      
    </UNavigationMenu >
  </nav>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { useUserStore } from '~/stores/user';

const isDropdownOpen = ref(false);

const userStore = useUserStore();
const showLoginModal = ref(false);

const items = computed<NavigationMenuItem[][]>(() => ([
  [
    {
      label: 'Guide',
      icon: 'i-lucide-book-open',
      children: [
        {
          label: 'Introduction',
          description: 'Fully styled and customizable components for Nuxt.',
          icon: 'i-lucide-house'
        },
        {
          label: 'Installation',
          description: 'Learn how to install and configure Nuxt UI in your application.',
          icon: 'i-lucide-cloud-download'
        },
        {
          label: 'Icons',
          icon: 'i-lucide-smile',
          description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
        },
        {
          label: 'Colors',
          icon: 'i-lucide-swatch-book',
          description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
        },
        {
          label: 'Theme',
          icon: 'i-lucide-cog',
          description:
            'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
        }
      ]
    },
    {
      label: 'Composables',
      icon: 'i-lucide-database',
      children: [
        {
          label: 'defineShortcuts',
          icon: 'i-lucide-file-text',
          description: 'Define shortcuts for your application.',
          to: '/composables/define-shortcuts'
        },
        {
          label: 'useOverlay',
          icon: 'i-lucide-file-text',
          description: 'Display a modal/slideover within your application.',
          to: '/composables/use-overlay'
        },
        {
          label: 'useToast',
          icon: 'i-lucide-file-text',
          description: 'Display a toast within your application.',
          to: '/composables/use-toast'
        }
      ]
    },
    {
      label: 'Components',
      icon: 'i-lucide-box',
      to: '/components',
      active: true,
      defaultOpen: true,
      children: [
        {
          label: 'Link',
          icon: 'i-lucide-file-text',
          description: 'Use NuxtLink with superpowers.',
          to: '/components/link'
        },
        {
          label: 'Modal',
          icon: 'i-lucide-file-text',
          description: 'Display a modal within your application.',
          to: '/components/modal'
        },
        {
          label: 'NavigationMenu',
          icon: 'i-lucide-file-text',
          description: 'Display a list of links.',
          to: '/components/navigation-menu'
        },
        {
          label: 'Pagination',
          icon: 'i-lucide-file-text',
          description: 'Display a list of pages.',
          to: '/components/pagination'
        },
        {
          label: 'Popover',
          icon: 'i-lucide-file-text',
          description: 'Display a non-modal dialog that floats around a trigger element.',
          to: '/components/popover'
        },
        {
          label: 'Progress',
          icon: 'i-lucide-file-text',
          description: 'Show a horizontal bar to indicate task progression.',
          to: '/components/progress'
        }
      ]
    }
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

const logout = () => {
  alert(1);
};
</script>