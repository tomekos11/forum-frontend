<template>
  <div
    class="p-4 rounded-lg shadow-sm bg-teal-950"
  >
    <div class="flex">
      <UserImgWithPopover :user="pinnedPost!.user" size="big" />
      <div>
        <h3 class="font-semibold text-lg text-green-600">{{ pinnedPost!.user.username }}</h3>

        <!-- Tryb wyświetlania i edycji -->
        <div>
          <p class="text-gray-200">{{ pinnedPost!.content }}</p>
        </div>

        <small class="text-gray-500">{{ formatDate(pinnedPost!.createdAt) }}</small>
      </div>

      <div v-if="!pinnedPost!.isDeleted" class="ml-auto flex gap-2 flex-col justify-between items-end">

        <div class="flex gap-1">
          <UButton label="Wyrózniony post" icon="i-lucide-pin" variant="ghost"/>

          <UModal v-if="userStore.isAdminOrModerator" v-model:open="showUnpinPostModal" text="Odepnij post" title="Odepnij post" close size="sm">
            <UButton icon="i-lucide-pin-off" color="error" variant="ghost" />

            <template #body>
              <div>
                Czy na pewno chcesz odpiąć post?
              </div>
            </template>
            
            <template #footer>
              <div class="flex justify-end gap-2 ml-auto">
                <UButton label="Zamknij" color="error" @click="showUnpinPostModal = false"/>
                <UButton label="Odepnij post" @click="togglePostPin(pinnedPost!)"/>
              </div>
            </template>
          </UModal>

          <UTooltip text="Odpowiedź na ten post">
            <UButton icon="i-lucide-reply" size="md" color="info" variant="solid" />
          </UTooltip>
        </div>

        <reaction-segment v-if="pinnedPost" :post="pinnedPost" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/helpers/date';
import { useUserStore } from '~/stores/user';
import { usePostsStore } from '~/stores/posts';

useToast();

const { pinnedPost, togglePostPin } = usePostsStore();
const userStore = useUserStore();

const showUnpinPostModal = ref(false);

</script>