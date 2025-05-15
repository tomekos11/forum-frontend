<template>
  <UPopover :popper="{ placement: 'bottom-end' }">
    <UButton icon="i-lucide-more-vertical" size="md" variant="ghost" color="neutral" />

    <template #content>
      <div class="flex flex-col gap-1 p-2 min-w-[160px]">
        <!-- Pin post -->
        <UButton
          v-if="isPostPinned(post)"
          icon="i-lucide-badge-check"
          label="Wyróżniony post"          
        />
        
        <UButton
          v-if="userStore.isAdminOrModerator"
          :icon="isPostPinned(post) ? 'i-lucide-badge-check' : 'i-lucide-badge-check'"
          :label="isPostPinned(post) ? 'Odznacz jako wyróżniony' : 'Wyróżnij post'"
          :color="isPostPinned(post) ? 'error' : 'neutral'"
          :variant="isPostPinned(post) ? 'ghost' : 'soft'"
          @click="togglePin(post)"
        />

        <!-- Reply -->
        <UButton
          icon="i-lucide-reply"
          label="Odpowiedz"
          color="info"
          variant="soft"        
        />

        <!-- Edit -->
        <UButton
          v-if="canEdit"
          icon="i-lucide-pencil"
          label="Edytuj"
          :color="isAdminOrMod ? 'primary' : 'info'"
          variant="soft"
          @click="$emit('edit')"
        />

        <post-delete-button
          v-if="canEdit"
          :post="post"
        />

        <post-report-button
          v-if="!isOwner"
          :post="post"
        />
      </div>
    </template>
  </UPopover>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '~/stores/user';
import { usePostsStore } from '~/stores/posts';

const props = defineProps({
  post: Object,
});

const emit = defineEmits(['edit']);

const userStore = useUserStore();
const postsStore = usePostsStore();

const isAdminOrMod = computed(() => userStore.isAdminOrModerator);
const isOwner = computed(() => userStore.id === props.post.user.id);
const canEdit = computed(() => isOwner.value || isAdminOrMod.value);

function togglePin(post) {
  postsStore.togglePostPin(post);
}

const isPostPinned = (post) => {
  return post.id === postsStore.pinnedPost?.id;
};

</script>
