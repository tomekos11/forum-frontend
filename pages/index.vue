<template>
  <div class="mx-2 sm:mx-4 md:mx-6 lg:mx-10">
    <div class="mt-10">

      <UBreadcrumb :items="items">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>

      <div class="text-xl text-center">Forum odnośnie cyberbezpieczeństwa</div>

      <div class="flex flex-col mt-10">
        <NuxtLink 
          v-for="forum in useForumsStore().forums" 
          :key="forum.slug" 
          :to="`/forums/${forum.slug}`"
          class="block"
        >
          <UCard class="cursor-pointer hover:bg-green-700 transition">
            <template #header>
              <div class="flex items-center justify-between w-full">
                <!-- Lewa strona -->
                <div class="flex items-center">
                  <UAvatar src="https://github.com/benjamincanac.png" size="xl" class="mr-5"/>
                  <span>{{ forum.name }}</span>
                </div>

                <!-- Prawa strona (Counter + "odpowiedzi") -->
                <div class="flex gap-5">
                  <div class="text-right">
                    <span class="font-bold text-lg">{{ forum.postCounter || 0 }}</span> <!-- Counter -->
                    <div class="text-sm text-gray-400">odpowiedzi</div> <!-- Tekst "odpowiedzi" -->
                  </div>
                  <div class="w-[160px] truncate">
                    <UAvatar src="https://github.com/benjamincanac.png" size="md" class="mr-1"/>
                    <span class="text-sm">{{ forum.latestPost.title }}</span>
                    <div class="text-sm text-center">
                      <span class="text-gray-400">{{ formatDate(forum.latestPost.createdAt) }}</span>
                    </div>
                  </div>
                </div>   
              </div>
            </template>
          </UCard>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui';
import { formatDate } from '~/helpers/date';
import { useForumsStore } from '~/stores/forum';

const items: BreadcrumbItem[] = [
  {
    label: 'Forum cybersecurity',
    to: '/',
    icon: 'i-heroicons-home'
  },
];

</script>