<template>
  <UModal v-model:open="showModal" title="Zmiana danych użytkownika">
    <UButton color="primary" icon="i-heroicons-pencil-square">
      Edytuj profil
    </UButton>

    <template #content>
      <UCard>
        <div class="text-lg text-center font-semibold mb-4">
          Zmiana danych użytkownika
        </div>

        <div class="flex flex-col space-y-4">
          <UFormField label="Bio">
            <UInput
              v-model="bio"
              placeholder="Wpisz swoje bio"
              label="Bio"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Opis użytkownika">
            <UTextarea
              v-model="description"
              placeholder="Wpisz opis"
              label="Opis"
              class="w-full"
              :rows="4"
            />
          </UFormField>

          <UButton color="primary" class="mx-auto" icon="i-heroicons-pencil-square" @click="updateProfile">
            Zapisz zmiany
          </UButton>
        </div>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { User } from '~/types/types';

const showModal = ref(false);
const user = defineModel<User>('user');

const bio = ref('');
const description = ref('');

watch(
  () => user.value,
  (newUser) => {
    if (newUser && newUser.data) {
      bio.value = newUser.data.bio || '';
      description.value = newUser.data.description || '';
    }
  },
  { immediate: true }
);

const toast = useToast();
const route = useRoute();

const updateProfile = async () => {
  const { user: updatedUser } = await useFetchWithAuth<{message: string; user: User}>('/users/profile', {
    method: 'patch',
    body: {
      username: route.params.username,
      bio: bio.value,
      description: description.value
    },
  });

  if(user.value && user.value.data && updatedUser.data) {
    user.value.data.description = updatedUser.data.description;
    user.value.data.bio = updatedUser.data.bio;
  }

  showModal.value = false;

  toast.add({
    title: 'Profil użytkownika',
    description: 'Poprawnie zmieniono dane'
  });
};
</script>