<template>
  <UPopover mode="hover" :open-delay="400" :close-delay="100">
    <img v-if="size === 'big'" class="rounded-sm mr-5 w-[100px] max-h-[100px]" :src="user.data?.image || ''">
    <UAvatar v-else :src="user.data?.image || ''" size="sm" class="mr-1"/>
    
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <!-- Lewa część z tekstem -->
            <div>
              <h2 class="text-xl font-semibold">{{ user.username }}</h2>
              <p class="text-gray-600 text-sm">{{ user.data?.bio }}</p>
            </div>
      
            <!-- Prawa część z obrazkiem (avatar) -->
            <UAvatar 
              :src="user.data?.image || ''" 
              alt="Avatar" 
              class="w-12 h-12 rounded-full" 
            />
          </div>
        </template>
                            
        <div>
          {{ user.data?.description }}
        </div>
        <UButton label="Przejdź do profilu użytkownika" :to="`/profiles/${user.username}`" />
      </UCard>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { User } from '~/types/types';

interface Props {
  user: User
  size?: 'big'
}

defineProps<Props>();
</script>