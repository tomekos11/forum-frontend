<template>
  <div
    :class="`p-4 rounded-lg bg-slate-800  ${post.notification ? 'shadow-[0_4px_12px_rgba(0,255,0,0.3)]' : 'shadow-sm'}`"
  >
    <div class="flex">
      <div class="flex flex-col">
        <UserImgWithPopover :user="post.user" size="big" />
        <div class="text-sm text-gray-500 mt- text-xs">{{ formatDateShort(post.createdAt) }}</div>
      </div>
      <div class="w-full flex flex-col min-h-full">
        <h3 class="font-semibold text-lg text-green-600">{{ post.user.username }}</h3>

        <post-edit-content
          v-if="shouldEditPost"
          :edit-post="editPost!"
          @cancel="editPost = null"
        />

        <div v-else>
          <p class="text-gray-200" @mouseup="showMenuIfTextSelected">
            <span v-html="parsedContent" />
          </p>

          {{ selectedText }}

          <UTooltip
            v-if="userStore.isLoggedIn"
            v-model:open="showMenu"
            :disable-hoverable-content="true"
            :ui="{ content: 'h-fit w-fit' }"
            :content="{ align: 'center', side: 'bottom' }"
          >
            <div/>
            <template #content>
              <UButton label="Zacytuj" icon="i-lucide-quote" variant="ghost" @click="quote" />
            </template>
          </UTooltip>
        </div>

        <!-- Stopka z informacją o edycji/usunięciu -->
        <div class="mt-auto pt-4 text-sm">
          <template v-if="post.postHistories?.length && post.postHistories[0]">
            <div v-if="post.postHistories[0].editorId === post.userId" class="text-gray-500">
              {{ post.postHistories[0].isDeleted ? 'Usunięty:' : 'Ostatnia edycja:' }}
              {{ formatDate(post.postHistories[0].createdAt || '') }}
            </div>
            <div v-else class="text-red-500">
              {{ post.postHistories[0].isDeleted ? 'Usunięty:' : 'Ostatnia edycja:' }}
              {{ formatDate(post.postHistories[0]?.createdAt || '') }}
              przez {{ post.postHistories[0]?.editor.username }}
            </div>
          </template>
        </div>
      </div>


      <div v-if="!post.isDeleted" class="ml-auto flex gap-2 flex-col justify-between items-end">
        <UPopover :popper="{ placement: 'bottom-end' }">
          <UButton icon="i-lucide-more-vertical" size="md" variant="ghost" color="neutral" />

          <template #content>
            <div class="flex flex-col gap-1 p-2 min-w-[160px]">

              <!-- Pin post -->
              <UButton
                v-if="userStore.isAdminOrModerator"
                :icon="isPostPinned(post) ? 'i-lucide-badge-check' : 'i-lucide-badge-check'"
                :label="isPostPinned(post) ? 'Odznacz jako wyróżniony' : 'Wyróżnij post'"
                :color="isPostPinned(post) ? 'error' : 'neutral'"
                :variant="isPostPinned(post) ? 'ghost' : 'soft'"
                @click="postsStore.togglePostPin(post)"
              />

              <div
                v-else-if="isPostPinned(post)"
                class="flex items-center gap-2 text-sm text-primary"
              >
                <UIcon name="i-lucide-badge-check" />
                <span>Wyróżniony post</span>
              </div>

              <!-- Reply -->
              <UButton
                icon="i-lucide-reply"
                label="Odpowiedz"
                color="info"
                variant="soft"
              />

              <!-- Edit -->
              <UButton
                v-if="post.user.id === userStore.id || userStore.isAdminOrModerator"
                icon="i-lucide-pencil"
                label="Edytuj"
                :color="userStore.isAdminOrModerator ? 'primary' : 'info'"
                variant="soft"
                @click="startEditing(post)"
              />

              <post-delete-button
                v-if="post.user.id === userStore.id || userStore.isAdminOrModerator"
                :post="post"
              />

              <post-report-button v-if="post.user.id !== userStore.id" :post="post" />
      
            </div>
          </template>
        </UPopover>

        <reaction-segment v-if="post" :post="post" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventBus, useTextSelection } from '@vueuse/core';
import DOMPurify from 'dompurify';
import type { EditPost, Post } from '~/types/types';
import { useUserStore } from '~/stores/user';
import { formatDate, formatDateShort } from '~/helpers/date';
import { usePostsStore } from '~/stores/posts';

interface Props {
  post: Post;
}

const props = defineProps<Props>();

const userStore = useUserStore();
const postsStore = usePostsStore();

const quoteBus = useEventBus<string>('quote');

const editPost = ref<EditPost | null>(null);

const shouldEditPost = computed(() => editPost.value?.postId === props.post.id);

const isPostPinned = (post: Post) => {
  return post.id === postsStore.pinnedPost?.id;
};

const startEditing = (post: Post) => {
  editPost.value = {
    postId: post.id,
    content: post.content
  };
};

const showMenu = ref(false);

const selectedText = ref('');
const selection = useTextSelection();

const showMenuIfTextSelected = async () => {
  await setTimeout(() => {
    const text = selection.text.value ? selection.text.value : '';
    if (text.trim()) {
      showMenu.value = true;
    } else {
      showMenu.value = false;
    }
  }, 20);
};

const quote = () => {
  const selection = window.getSelection();
  const text = selection ? selection.toString() : '';

  selectedText.value = text;
  showMenu.value = false;

  quoteBus.emit('quote', selectedText.value);

  selectedText.value = '';
};


const parsedContent = ref('');

onMounted(() => {
  const processedContent = props.post.content.replace(/\[quote](.*?)\[\/quote]/gs, (_, quoteText) => {
    return `
      <blockquote class="border-l-4 border-emerald-500 bg-gray-50 dark:bg-gray-800 p-4 my-4">
        <p class="text-gray-900 dark:text-gray-100">${quoteText.trim()}</p>
      </blockquote>
    `;
  });

  parsedContent.value = DOMPurify.sanitize(processedContent);
});

watch(() => props.post.content, (newContent) => {
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