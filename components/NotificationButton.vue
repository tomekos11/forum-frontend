<template>
  <div v-if="userStore.isLoggedIn">
    <UPopover :popper="{ offset: 8 }">
      <!-- Trigger: ikona dzwonka w chipie -->
      <UChip v-if="userStore.notifications.length" inset  color="error">
        <UButton
          icon="i-lucide-bell"
          variant="ghost"
          color="neutral"
        />
      </UChip>

      <UButton v-else icon="i-lucide-bell" variant="ghost" color="neutral"/>

      <!-- Zawartość popovera -->
      <template #content>
        <div class="w-64 max-h-80 overflow-y-auto p-2">
          <div v-for="(notification, index) in userStore.notifications" :key="index" class="p-2 rounded hover:bg-slate-950 text-sm cursor-pointer text-center">
            Nowe wiadomości w temacie<br>
            <strong>{{ notification.topicName }}</strong> w ilości: {{ notification.count }}
            <UButton
              icon="i-lucide-arrow-up-right"
              size="xs"
              variant="ghost"
              :to="`/forums/${notification.forumSlug}/topics/${notification.topicSlug}?page=${notification.page}`"
            />
            
          </div>

          <div v-if="!userStore.notifications.length" class="text-center">
            <div>Brak nowych powiadomień</div>
          </div>

          <div class="text-center">
            <UButton label="Lista powiadomień" class="mt-2" to="/notifications" />
          </div>

        </div>
      </template>
    </UPopover>
  </div>
  
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
</script>