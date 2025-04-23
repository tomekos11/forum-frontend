<template>
  <div class="modal">
    <form class="space-y-2 mx-auto" @submit.prevent="onSubmit">
      <!-- Formularz logowania -->
      <template v-if="!isRegister">
        <div class="text-center mb-3">
          Logowane użytkownika
        </div>
      
        <div label="Nazwa użytkownika" name="username" class="flex flex-col">
          <UInput v-model="form.username" placeholder="Wpisz nazwę użytkownika"  />
        </div>

        <div label="Hasło" name="password" class="flex flex-col">
          <UInput v-model="form.password" type="password" placeholder="Wpisz hasło" />
        </div>

        <UButton type="submit" label="Zaloguj się" class="w-full bg-green-500 text-white hover:bg-green-600" />

        <div v-if="error" class="text-red-800">
          Konto {{ error.username }} zostało zbanowane dnia {{ formatDate(error.createdAt || '') }} z powodu: {{ error.reason }}. Blokada potrwa do dnia {{ formatDate(error.bannedUntil) }}
        </div>

        <p class="text-center text-sm mt-4">
          Jeszcze nie masz konta? 
          <span class="text-green-600 cursor-pointer hover:underline" @click="toggleRegister">Załóż je</span>
        </p>
      </template>

      <!-- Formularz rejestracji -->
      <template v-else>

        <div class="text-center mb-3">
          Rejestracja użytkownika
        </div>
      
        <div label="Nazwa użytkownika" name="username" class="flex flex-col">
          <UInput v-model="form.username" placeholder="Wpisz nazwę użytkownika" />
        </div>

        <div label="Hasło" name="password" class="flex flex-col">
          <UInput v-model="form.password" type="password" placeholder="Wpisz hasło" />
        </div>

        <div label="Powtórz hasło" name="confirmPassword" class="flex flex-col">
          <UInput v-model="form.confirmPassword" type="password" placeholder="Powtórz hasło" />
        </div>

        <UButton type="submit" label="Zarejestruj się" class="w-full bg-green-500 text-white hover:bg-green-600" />
        <p class="text-center text-sm mt-4">
          Masz już konto? 
          <span class="text-green-600 cursor-pointer hover:underline" @click="toggleRegister">Zaloguj się</span>
        </p>
      </template>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore } from '~/stores/user';
import type { Ban, Notification, User } from '~/types/types';
import { useFetchWithAuth } from '../composables/useFetchWithAuth';
import { formatDate } from '~/helpers/date';

interface Error extends Ban {
  username: string;
}

const emit = defineEmits(['close-modal']);
const userStore = useUserStore();

const isRegister = ref(false); // Kontroluje przełączanie między logowaniem a rejestracją
const toast = useToast();

const error = ref<Error | null>(null);

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

const toggleRegister = () => {
  isRegister.value = !isRegister.value;
};

const onSubmit = async () => {
  if (isRegister.value) {
    await register();
  } else {
    await login();
  }
};

const login = async () => {
  const loginData = {
    username: form.username,
    password: form.password
  };

  try {
    const { user, notifications: nots } = await useFetchWithAuth<{user: User, notifications: Notification[] }>('/login', {
      body: loginData,
      method: 'post',
    });
    

    if(user) {
      userStore.setUser(user, nots);
    }

    toast.add({
      title: 'Poprawnie zalogowano',
      description: `Witaj z powrotem, ${loginData.username}`
    });
    emit('close-modal');
  } catch (err) {
    const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';

    if(err.response._data?.isBanned) {
      error.value = {
        username: form.username,
        ...err.response._data
      };

      toast.add({
        title: 'Konto jest zablokowane'
      });
    } else {
      toast.add({
        title: 'Ups wystąpił problem',
        description: errorMessage
      });
    }

    
  }
};

const register = async () => {

  const registerData = {
    username: form.username,
    password: form.password,
    confirmPassword: form.confirmPassword
  };

  try {

    const newUser = await useFetchWithAuth<User>('/register', {
      body: registerData,
      method: 'post',
    });

    
    useUserStore().setUser(newUser, []);

    toast.add({
      title: 'Poprawnie zarejestrowano',
      description: `Dziękujemy, ${registerData.username}`
    });
    emit('close-modal');
  } catch (err) {
    const errorMessage = err.response?._data?.error || err.message || 'Nieznany błąd';
    toast.add({
      title: 'Ups wystąpił problem',
      description: errorMessage
    });
  }
};
</script>

<style scoped>
.modal {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
</style>
