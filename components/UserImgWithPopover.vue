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
          <div class="text-sm">
            {{ user.data?.description }}
          </div>

          <div class="flex justify-between text-sm my-5">
            <!-- <div v-for="stat in user.data?.stats" :key="stat">
            {{ stat }}
          </div> -->

            <div class="flex flex-col items-center justify-center">
              <div>{{ user.data?.stats?.posts }}</div>
              <div>Postów</div>
            </div>
            <div class="flex flex-col items-center justify-center">
              <div>{{ user.data?.stats?.repPlus }}</div>
              <div>Reakcji +</div>
            </div>
            <div class="flex flex-col items-center justify-center">
              <div>{{ user.data?.stats?.repMinus }}</div>
              <div>Reakcji -</div>
            </div>
          </div>

          <UButton label="Przejdź do profilu użytkownika" size="sm" :to="`/profiles/${user.username}`" />
        </div>
        
        
        
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