<template>
  <div
    class="p-4 rounded-lg shadow-sm bg-teal-950"
  >
    <div class="flex flex-col sm:flex-row gap-2">

      <div class="flex flex-row sm:flex-col items-center sm:items-start gap-2">
        <UserImgWithPopover :user="pinnedPost!.user" :size="isMobile ? 'small' : 'big'" />

        <div class="flex items-center justify-between sm:mt-1 leading-tight w-full">
          <div class="flex flex-col sm:items-start items-start">
            <h3 v-if="isMobile" class="font-semibold text-xl sm:text-xl text-green-600">
              {{ pinnedPost!.user.username }}
            </h3>
            <div class="text-sm sm:text-xs text-gray-500">{{ formatDateShort(pinnedPost!.createdAt) }}</div>
          </div>
          <div v-if="!pinnedPost!.isDeleted && isMobile" class="ml-auto flex flex-col items-end">
            <UButton label="Wyróżniony" icon="i-lucide-pin" variant="ghost" class="pr-0"/>
            <div class="flex gap-2">

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
          </div>
        </div>
      </div>

      <!-- Treść posta -->
      <div class="w-full flex flex-col min-h-full">
        <h3 v-if="!isMobile" class="font-semibold text-lg text-green-600">{{ pinnedPost!.user.username }}</h3>

        <p class="text-gray-200">
          <span v-html="parsedContent" />
        </p>
      </div>

      <div v-if="!pinnedPost!.isDeleted" class="ml-auto flex gap-2 flex-col justify-between items-end">

        <div v-if="!pinnedPost!.isDeleted && !isMobile" class="ml-auto flex flex-col items-end gap-2">
          <UButton label="Wyróżniony" icon="i-lucide-pin" variant="ghost" class="pr-0"/>
          <div class="flex gap-2">

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
        </div>
        <reaction-segment v-if="pinnedPost" :post="pinnedPost" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import { formatDateShort } from '~/helpers/date';
import { useUserStore } from '~/stores/user';
import { usePostsStore } from '~/stores/posts';

useToast();

const isMobile = ref(false);
const isReady = ref(false);

onMounted(() => {
  isMobile.value = window.innerWidth < 640;
  isReady.value = true;
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 640;
  });
});

const { pinnedPost, togglePostPin } = usePostsStore();
const userStore = useUserStore();

const showUnpinPostModal = ref(false);

const parsedContent = ref('');

onMounted(() => {
  const processedContent = pinnedPost!.content.replace(/\[quote](.*?)\[\/quote]/gs, (_, quoteText) => {
    return `
      <blockquote class="border-l-4 border-emerald-500 bg-gray-50 dark:bg-gray-800 p-4 my-4">
        <p class="text-gray-900 dark:text-gray-100">${quoteText.trim()}</p>
      </blockquote>
    `;
  });

  parsedContent.value = DOMPurify.sanitize(processedContent);
});

watch(() => pinnedPost!.content, (newContent) => {
  const processedContent = newContent.replace(/\[quote](.*?)\[\/quote]/gs, (_, quoteText) => {
    return `
      <blockquote class="border-l-4 border-emerald-500 bg-gray-50 dark:bg-gray-800 p-4 my-4">
        <p class="text-gray-900 dark:text-gray-100">${quoteText.trim()}</p>
      </blockquote>
    `;
  });

  parsedContent.value = DOMPurify.sanitize(processedContent);
});

</script>