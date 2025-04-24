<template>
  <div>
    <UButton
      icon="i-lucide-message-circle-warning"
      label="Zgłoś"
      color="error"
      class="w-full"
      variant="soft"
      @click="showModal = true"
    />

    <UModal v-model:open="showModal" title="Zgłoś post">
      <template #content>          
        <UCard class="max-h-[80vh] overflow-y-auto">
          <template #header>
            <h2 class="text-xl font-semibold">Zgłaszanie posta</h2>
          </template>

          <div
            class="rounded-lg bg-slate-800  shadow-sm mb-4"
          >
            <div class="flex">
              <UserImgWithPopover :user="post.user" size="big" />

              <div class="w-full">
                <h3 class="font-semibold text-lg text-green-600">{{ post.user.username }}</h3>
                <p class="text-gray-200">{{ post.content }}</p>
              </div>
            </div>
          </div>
        
          <form @submit.prevent="onSubmit">
            <UFormField label="Powód zgłoszenia" required>
              <USelect
                v-model="reason"
                :items="reasons"
                placeholder="Wybierz powód"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Szczegóły" class="mt-3" required>
              <UInput
                v-model="message"
                placeholder="Opisz problem"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <div class="flex justify-end gap-2 mt-4">
              <UButton label="Anuluj" color="error" @click="showModal = false" />
              <UButton label="Zgłoś post" type="submit" />
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '~/stores/user';
import type { Post } from '~/types/types';

interface Props {
  post: Post
}

const props = defineProps<Props>();

const userStore = useUserStore();
const showModal = ref(false);

const message = ref('');
const reasons = [
  { label: 'Hejt / obraźliwa treść', value: 'hate' },
  { label: 'Spam / reklama', value: 'spam' },
  { label: 'Nieprawdziwa informacja', value: 'false-info' }
];

const reason = ref(reasons[0]);

const onSubmit = async () => {
  await useFetchWithAuth('/reports', {
    method: 'post',
    body: {
      reportableType: 'Post',
      reportableId: props.post.id,
      reason: reason.value,
      message: message.value
    }
  });

  showModal.value = false;
};
</script>
