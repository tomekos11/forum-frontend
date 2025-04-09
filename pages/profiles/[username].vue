<template>
  <UContainer class="py-10">
    <UCard class="max-w-md mx-auto text-center">
      <div v-if="user" class="flex flex-col items-center space-y-4">
        <!-- <UAvatar
          src="https://i.pravatar.cc/150?img=3"
          size="xl"
          alt="User avatar"
        /> -->
        <div class="relative inline-block w-fit">
          <img
            :src="user.data?.image || ''"
            alt="Avatar"
            class="rounded-full w-32 h-32 object-cover"
          >

          <!-- Button w prawym górnym rogu -->
          <UModal v-if="canEdit">
            <UButton
              size="xs"
              variant="soft"
              icon="i-heroicons-pencil-square"
              class="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 rounded-full shadow pointer"
            />

            <template #content>
              <UCard style="max-width: 600px;">

                <div>
                  Zmiana zdjęcia
                </div>
    
                <div>
                  Aby zmienić zdjęcie naciśnij poniższy guzik i wybierz plik o rozszerzeniu png, jpg lub jpeg.
                </div>
    

                <img
                  :src="preview || defaultAvatar"
                  alt="Avatar"
                  class="rounded-full w-32 h-32 object-cover my-2"
                >

                
                <!-- Ukryty input -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                >

                <UButton :label="!preview ? 'Dodaj zdjęcie' : 'Zmień zdjęcie'" @click="selectFile" />
  
                <!-- Opcjonalnie: przycisk Zapisz -->
                <UButton v-if="preview" color="primary" class="ml-2" @click="savePhoto">
                  Zapisz zdjęcie
                </UButton>
              </UCard>
            </template>
          </UModal>
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ $route.params.username }}</h2>
          <p class="text-gray-600 text-sm">{{ user.data?.bio }}</p>

          <p class="text-gray-400 text-sm mt-4">{{ user.data?.description }}</p>
        </div>

        <template v-if="canEdit">
          <UModal v-model:open="showEditProfileModal" title="Zmiana danych użytkownika">
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
      </div>

      <template v-else>
        <div class="text-sm">Użytkownik o nazwie {{ $route.params.username }} nie został odnaleziony</div>

        <UInput v-model="searchQuery" icon="i-lucide-search" size="md" variant="outline" class="mt-2" placeholder="Wyszukaj innego użytkownika" @keydown.enter="$router.push(`/profiles/${searchQuery}`)" />
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { UCard } from '#components';
import { useUserStore } from '~/stores/user';
import type { User } from '~/types/types';

const userStore = useUserStore();
const canEdit = computed(() => userStore.username === route.params.username || ['admin', 'moderator'].includes(userStore.role));
const searchQuery = ref('');
const showEditProfileModal = ref(false);

const config = useRuntimeConfig();
const route = useRoute();

const { data: user } = useAsyncData(
  `user-${route.params.username}`,
  async () => {
    const res = await $fetch<User>(`${config.public.API_URL}/users/${route.params.username}`);

    return res;
  },
  { server: true }
);

const bio = ref(user.value?.data?.bio || '');
const description = ref(user.value?.data?.description || '');

const preview = ref(null);
const fileInput = useTemplateRef('fileInput');
const defaultAvatar = 'https://placehold.co/150x150?text=Avatar';

function selectFile() {
  fileInput.value?.click();
}

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      preview.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const savePhoto = () => {
  console.log(1);
};

const toast = useToast();

const updateProfile = async () => {

  const config = useRuntimeConfig();

  const { user: updatedUser } = await $fetch<{message: string; user: User}>(`${config.public.API_URL}/users/profile`, {
    method: 'patch',
    body: {
      username: route.params.username,
      bio: bio.value,
      description: description.value
    },
    credentials: 'include'
  });

  if(user.value && user.value.data && updatedUser.data) {
    user.value.data.description = updatedUser.data.description;
    user.value.data.bio = updatedUser.data.bio;
  }

  showEditProfileModal.value = false;

  toast.add({
    title: 'Profil użytkownika',
    description: 'Poprawnie zmieniono dane'
  });
};
</script>