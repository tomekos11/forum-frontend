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
            :src="user.data.image || ''"
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
          <UButton color="primary" icon="i-heroicons-pencil-square" @click="editProfile">
            Edytuj profil
          </UButton>
        </template>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { UCard } from '#components';
import { useUserStore } from '~/stores/user';
import type { User } from '~/types/types';

const userStore = useUserStore();
const canEdit = computed(() => userStore.username === route.params.username || ['admin', 'moderator'].includes(userStore.role));

const editProfile = () => {
  console.log('1');
};

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
</script>