<template>
  
  <UContainer class="my-5">
    <UAlert
      class="mb-10"
      title="Pouczenie"
      description="Po przejściu do tematu z nieodczytami postami, nieprzeczytane wiadomości mają zieloną poświatę."
      icon="i-lucide-circle-alert"
      :ui="{
        icon: 'text-[42px]'
      }"
    />

    <template v-for="(val, key) in response" :key="key">
      <!-- <h1 class="text-lg text-center mt-10 mb-2">
        <template v-if="key === 'unread' && val.length">
          Tematy z nowymi, nieodczytanymi postami
        </template>

        <template v-else-if="key === 'read' && val.length">
          Tematy z odczytanymi wszystkimi powiadomieniami
        </template>
      </h1> -->
      <NuxtLink 
        v-for="notif in response?.[key]" 
        :key="notif.topic.id" 
        :to="`/forums/${notif.topic.forum?.slug}/topics/${notif.topic.slug}`"
        class="block"
      >
        <UCard
          :ui="{
            header: 'p-2'
          }"
          :class="`cursor-pointer hover:bg-green-700 transition ${key === 'unread' ? 'bg-emerald-950 mb-2' : ''}`"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between w-full gap-4">
              <!-- Lewa strona -->
              <div class="flex items-center flex-1 sm:flex-row sm:items-center">
                <span v-if="key === 'unread'" class="mr-5">
                  🟢
                </span>

                <UAvatar :text="notif.topic.name[0].toUpperCase()" size="lg" :class="`mr-5 ${notif.topic.isPrimary ? 'bg-slate-950' : ''}`"/>
                <UIcon v-if="notif.topic.isClosed" name="i-lucide-lock" size="xs" class="mr-2" />
                <span class="text-sm sm:text-base whitespace-nowrap">{{ notif.topic.name }}</span> <!-- Zapobiega zawijaniu -->
              </div>

              <!-- Prawa strona (Counter + "odpowiedzi") -->
              <div class="flex gap-3 sm:gap-5 items-center justify-end">
                <!-- <div class="text-center">
                  <span class="font-bold text-lg">{{ notif.topic.postCounter || 0 }}</span>
                  <div class="text-sm text-gray-400">Odpowiedzi</div>
                </div>

                <div v-if="notif.unreadCount" class="text-center">
                  <span class="font-bold text-lg">{{ notif.unreadCount }}</span>
                  <div class="text-sm text-gray-400">Nieprzeczytane</div>
                </div> -->
                <div class="flex gap-2 items-center justify-between">
                  <!-- <UBadge icon="i-lucide-mail" :label="notif.topic.postCounter || 0" color="neutral" class="mr-1" /> -->
                  <UTooltip v-if="notif.unreadCount">
                    <UBadge icon="i-lucide-mail-warning" color="error" :label="notif.unreadCount" />
                    <template #content>
                      <div>
                        Nieprzeczytanych wiadomości: <strong>{{ notif.unreadCount }}</strong>
                      </div>
                      <div v-if="notif.lastReadAt">
                        Ostatnio odczytane powiadomienie: {{ formatDate(notif.lastReadAt) }}
                      </div>
                    </template>
                  </UTooltip>

                  <div class="text-center">
                    <div class="text-sm text-gray-400">Ostatnia aktualizacja</div>
                    <span class="text-sm">{{ formatDate(notif.lastPostAt) }}</span>
                  </div>
                  
                </div>

                <div class="w-[160px] truncate">
                  <template v-if="notif.topic?.posts && notif.topic.posts[0]">
                    <user-img-with-popover :user="notif.topic.posts[0].user || null" />

                    <span class="text-sm">{{ notif.topic.posts[0].user.username }}</span>
                    <div class="text-sm text-center">
                      <span class="text-gray-400">{{ formatDate(notif.topic.createdAt) }}</span>
                    </div>
                  </template>
                </div>
              </div>   
            </div>
          </template>
        </UCard>
      </NuxtLink>
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import { formatDate } from '~/helpers/date';
import { useUserStore } from '~/stores/user';
import type { Topic } from '~/types/types';

interface Notif {
  lastPostAt: string;
  lastReadAt: string;
  topic: Topic;
  unreadCount?: number;
}

interface Response {
  read: Notif[];
  unread: Notif[];
}

const userStore = useUserStore();

const { data: response, execute: refresh } = useAsyncData(async () => {
  try {
    return useFetchWithAuth<Response>('/notification');
  } catch (e) {
    console.error(e);
    return {
      unread: [],
      read: []
    };
  }
});

watch(() => userStore.isLoggedIn, (nv) => {
  if(nv) {
    refresh();
  } else {
    response.value = {
      unread: [],
      read: []
    };
  }
});
</script>