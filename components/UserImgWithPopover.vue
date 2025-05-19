<template>
  <UPopover mode="hover" :open-delay="400" :close-delay="100">


    <UAvatar
      v-if="size === 'big' && !slots.default"
      :src="user.data?.image || ''"
      :alt="user.username || 'Avatar'"
      :ui="{
        root: 'inline-table rounded-sm mr-5 w-[100px] max-h-[100px]',
        fallback: `rounded-sm w-[100px] h-[100px] flex items-center justify-center shadow ${!user.data?.image ? 'bg-slate-900' : ''}`
      }"
    />

    <!-- <img v-if="size === 'big' && !slots.default" class="rounded-sm mr-5 w-[100px] max-h-[100px]" :src="user.data?.image || ''"> -->

    <UAvatar v-else-if="!slots.default" :src="user.data?.image || ''" :alt="user?.username || 'Avatar'" size="2xl" class="mr-1"/>

    <slot />
    
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
              :alt="user?.username || 'Avatar'" 
              class="w-12 h-12 rounded-full" 
            />
          </div>
        </template>
        
        <div>
          <div class="text-sm">
            {{ user.data?.description }}
          </div>

          <div class="flex justify-between text-sm my-5">

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
  size?: 'big' |'small'
}

defineProps<Props>();

const slots = useSlots();
</script>