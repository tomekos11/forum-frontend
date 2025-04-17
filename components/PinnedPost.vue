<template>
  <div
    class="p-4 rounded-lg shadow-sm bg-teal-950"
  >
    <div class="flex">
      <UserImgWithPopover :user="post.user" size="big" />
      <div>
        <h3 class="font-semibold text-lg text-green-600">{{ post.user.username }}</h3>

        <!-- Tryb wyświetlania i edycji -->
        <div>
          <p class="text-gray-200">{{ post.content }}</p>
        </div>

        <small class="text-gray-500">{{ formatDate(post.createdAt) }}</small>
      </div>

      <div v-if="!post.isDeleted" class="ml-auto flex gap-2 flex-col justify-between items-end">

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
                <UButton label="Odepnij post" @click="$emit('unpin', post)"/>
              </div>
            </template>
          </UModal>

          <UTooltip text="Odpowiedź na ten post">
            <UButton icon="i-lucide-reply" size="md" color="info" variant="solid" />
          </UTooltip>
        </div>

        <reaction-segment v-if="post" :post="post" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/helpers/date';
import { useUserStore } from '~/stores/user';
import type { Post, Topic } from '~/types/types';

// Props
interface Props {
  post: Post;
}

defineProps<Props>();
useToast();
const userStore = useUserStore();

const showUnpinPostModal = ref(false);

defineEmits(['unpin']);

// const unpinPost = async () => {
//   try {
//     const { message } = await useFetchWithAuth<{message: string; topic: Topic}>('/posts/pin', {
//       body: {
//         topicId: props.post.topicId,
//         postId: null,
//       },
//       method: 'POST'
//     });
    
//     toast.add({
//       title: message,
//     });

//     showUnpinPostModal.value = false;
//   } catch (e) {
//     console.error(e);
//   }
// };
</script>