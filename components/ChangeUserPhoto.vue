<template>
  <UModal v-model:open="showModal" title="Zmiana avatara użytkownika">
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
    
        <div class="text-center">
          <UAvatar
            :src="newImg.preview || ''"
            :alt="user?.username || 'Avatar'"
            class="rounded-full w-32 h-32 object-cover my-2 mx-auto"
          />
        </div>
        
                
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
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { User } from '~/types/types';

interface NewImg {
  preview: string | null
  blob: Blob | null
}

const user = defineModel<User>('user');

const newImg = ref<NewImg>({
  preview: user.value?.data?.image || null,
  blob: null
});

const showModal = ref(false);
const route = useRoute();
const toast = useToast();
const userStore = useUserStore();

watch(
  () => user.value,
  (newUser) => {
    if (newUser && newUser.data) {
      newImg.value.preview = user.value?.data?.image || null;
    }
  },
  { immediate: true }
);

const fileInput = useTemplateRef('fileInput');

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
</script>