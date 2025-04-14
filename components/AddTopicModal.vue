<template>
  <UModal title="Dodaj temat">
    <UButton label="Dodaj temat" icon="i-lucide-mail-plus"/>

    <template #content>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold"> Dodaj temat do <span class="text-green-800">{{ forumName }}</span></h2>
        </template>
                
        <UFormField label="Nazwa tematu" required>
          <UInput
            v-model="newTopicName"
            placeholder="Wpisz nazwę tematu"
            label="Bio"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Opis tematu" required class="mt-3">
          <UTextarea
            v-model="firstPostContent"
            placeholder="Wpisz opis tematu"
            label="Opis"
            class="w-full"
            :rows="4"
          />
        </UFormField>

        <UFormField v-if="userStore.isAdminOrModerator" help="Temat główny wyświetla się powyżej wszystkich innych tematów">
          <UCheckbox v-model="isPrimary" class="mt-3" label="Czy jest to temat główny"/>
        </UFormField>
             
        <UButton label="Potwierdź" icon="i-lucide-mail-plus" class="mt-3" @click="saveTopic"/>
      </UCard>

    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { Topic } from '~/types/types';


interface Props {
  forumName: string
  forumSlug: string
}

const props = defineProps<Props>();

const userStore = useUserStore();
const toast = useToast();
const router = useRouter();

const newTopicName = ref('');
const firstPostContent = ref('');
const isPrimary = ref(false);

const saveTopic = async () => {
  try {

    const topic = await useFetchWithAuth<Topic>(`/topics/${props.forumSlug}`, {
      method: 'POST',
      body: {
        name: newTopicName.value,
        isPrimary: isPrimary.value,
        postContent: firstPostContent.value
      },
    });
  
    toast.add({
      title: 'Dodawanie tematu',
      description: 'Poprawnie dodano temat'
    });

    router.push(`/forums/${router.currentRoute.value.params.forumSlug}/topics/${topic.slug}?page=1`);

  } catch (err) {
    const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';

    toast.add({
      title: 'Ups wystąpił problem',
      description: errorMessage
    });
  }
};
</script>