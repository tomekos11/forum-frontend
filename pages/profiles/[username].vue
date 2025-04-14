<template>
  <UContainer class="py-10">
    <UCard class="max-w-md mx-auto text-center">
      <div v-if="user" class="flex flex-col items-center space-y-4">
        <div class="relative inline-block w-fit">
          <img
            :src="user.data?.image || ''"
            alt="Avatar"
            class="rounded-full w-32 h-32 object-cover"
          >

          <UModal v-if="canEdit" title="Zmiana avatara użytkownika">
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
    
                <div class="text-sm mt-2">
                  Aby zmienić zdjęcie naciśnij poniższy guzik i wybierz zdjęcie, które się będzie wyświetlało innym użytkownikom.
                </div>
    
                <img
                  :src="newImg.preview || defaultAvatar"
                  alt="Avatar"
                  class="rounded-full w-32 h-32 object-cover my-2 mx-auto"
                >
                
                <!-- Ukryty input -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                >

                <UButton :label="!newImg.preview ? 'Dodaj zdjęcie' : 'Zmień zdjęcie'" @click="selectFile" />
  
                <!-- Opcjonalnie: przycisk Zapisz -->
                <UButton v-if="newImg.preview" color="primary" class="ml-2" @click="savePhoto">
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
import type { User, UserData } from '~/types/types';

const userStore = useUserStore();
const canEdit = computed(() => userStore.username === route.params.username || ['admin', 'moderator'].includes(userStore.role));
const searchQuery = ref('');
const showEditProfileModal = ref(false);

const route = useRoute();

const { data: user } = useAsyncData(
  `user-${route.params.username}`,
  async () => {

    const user = await useFetchWithAuth<User>(`/users/${route.params.username}`);

    return user;
  },
  { server: true }
);

const bio = ref('');
const description = ref('');

interface NewImg {
  preview: string | null
  blob: Blob | null
}

const newImg = ref<NewImg>({
  preview: user.value?.data?.image || null,
  blob: null
});


watch(
  () => user.value,
  (newUser) => {
    if (newUser && newUser.data) {
      bio.value = newUser.data.bio || '';
      description.value = newUser.data.description || '';
      newImg.value.preview = user.value?.data?.image || null;
    }
  },
  { immediate: true }
);

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
      const arrayBuffer = event.target?.result;
      const blob = new Blob([arrayBuffer], { type: file.type });
      const objectUrl = URL.createObjectURL(blob);

      newImg.value.preview = objectUrl;
      newImg.value.blob = blob;
    };

    reader.readAsArrayBuffer(file);
  }
};

const savePhoto = async () => {
  const formData = new FormData();
  if(newImg.value.blob) {
    formData.append('avatar', newImg.value.blob);
  }
  
  formData.append('username', route.params.username.toString());

  try {
    const { data: userData } = await useFetchWithAuth<{message: string; data: UserData}>('/users/avatar', {
      method: 'post',
      body: formData
    });

    if(user.value) {
      user.value.data = userData;

      if(user.value.id === userStore.id) {
        userStore.data = userData;
      }
    }

    toast.add({
      title: 'Profil użytkownika',
      description: 'Poprawnie zmieniono zdjęcie'
    });
  } catch (err) {
    console.error(err);
  }
  

};

const toast = useToast();

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

  showEditProfileModal.value = false;

  toast.add({
    title: 'Profil użytkownika',
    description: 'Poprawnie zmieniono dane'
  });
};
</script>