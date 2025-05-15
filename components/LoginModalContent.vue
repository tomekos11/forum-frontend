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
          <UInput
            v-model="form.username"
            placeholder="Wpisz nazwę użytkownika"
            @focus="usernameFocused = true"
            @blur="usernameFocused = false"
          />

          <UCollapsible v-model:open="usernameFocused" >
            <template #content>
              <div class="mt-2">
    
                <p class="text-sm font-medium">
                  {{ usernameText }}. Musi zawierać:
                </p>
    
                <ul class="space-y-1" aria-label="Password requirements">
                  <li
                    v-for="(req, index) in usernameStrength"
                    :key="index"
                    class="flex items-center gap-0.5"
                    :class="req.met ? 'text-green-600' : 'text-gray-400'"
                  >
                    <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
    
                    <span class="text-xs font-light">
                      {{ req.text }}
                      <span class="sr-only">
                        {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </template>
          </UCollapsible>
        </div>

        <div label="Hasło" name="password" class="flex flex-col">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Wpisz hasło"
            @focus="passwordFocused = true"
            @blur="passwordFocused = false"
          />

          <UCollapsible v-model:open="passwordFocused" >
            <template #content>
              <div class="mt-2">
                <UProgress
                  :color="passwordColor"
                  :indicator="passwordText"
                  :model-value="passwordScore"
                  :max="4"
                  size="sm"
                />
    
                <p class="text-sm font-medium">
                  {{ passwordText }}. Musi zawierać: 
                </p>
    
                <ul class="space-y-1" aria-label="Password requirements">
                  <li
                    v-for="(req, index) in passwordStrength"
                    :key="index"
                    class="flex items-center gap-0.5"
                    :class="req.met ? 'text-green-600' : 'text-gray-400'"
                  >
                    <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
    
                    <span class="text-xs font-light">
                      {{ req.text }}
                      <span class="sr-only">
                        {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </template>
          </UCollapsible>
        </div>

        <div label="Powtórz hasło" name="confirmPassword" class="flex flex-col">
          <UInput
            v-model="form.confirmPassword"
            type="password"
            placeholder="Powtórz hasło"
            @focus="confirmPasswordFocused = true"
            @blur="confirmPasswordFocused = false"
          />

          <UCollapsible v-model:open="confirmPasswordFocused" >
            <template #content>
              <div class="mt-2">

                <p class="text-sm font-medium">
                  <template v-if="!form.confirmPassword.length">
                    Wpisz takie samo hasło jak w poprzednim polu
                  </template>
                  <template v-else>
                    <UIcon
                      :name="form.password === form.confirmPassword ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                      :class="`size-4 shrink-0 ${form.password === form.confirmPassword ? 'text-green-600': 'text-red-600'}`"
                    />

                    {{ form.password === form.confirmPassword ? 'Hasła zgadzają się' : 'Podano dwa różne hasła' }}
                  </template>
                </p>
              </div>
            </template>
          </UCollapsible>
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



const checkPasswordStrength = (str: string) => {
  const requirements = [
    { regex: /.{8,}/, text: 'Co najmniej 8 znaków' },
    { regex: /\d/, text: 'Co najmniej 1 numer' },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'Co najmniej 1 znak specjalny' },
    { regex: /[A-Z]/, text: 'Co najmniej 1 duża litera' }
  ];

  return requirements.map(req => ({ met: req.regex.test(str), text: req.text }));
};

const passwordFocused = ref(false);
const passwordStrength = computed(() => checkPasswordStrength(form.password));
const passwordScore = computed(() => passwordStrength.value.filter(req => req.met).length);

const passwordColor = computed(() => {
  if (passwordScore.value === 0) return 'neutral';
  if (passwordScore.value <= 1) return 'error';
  if (passwordScore.value <= 2) return 'warning';
  if (passwordScore.value === 3) return 'warning';
  return 'success';
});

const passwordText = computed(() => {
  if (passwordScore.value === 0) return 'Wpisz hasło';
  if (passwordScore.value <= 2) return 'Słabe hasło';
  if (passwordScore.value === 3) return 'Średnie hasło';
  return 'Mocne hasło';
});

const checkLoginStrength = (str: string) => {
  const requirements = [
    { regex: /.{3,}/, text: 'Co najmniej 3 znaki' },
    { regex: /^.{0,30}$/, text: 'Maksymalnie 30 znaków' },
  ];

  return requirements.map(req => ({ met: req.regex.test(str), text: req.text }));
};

const usernameFocused = ref(false);
const usernameStrength = computed(() => checkLoginStrength(form.username));
const usernameScore = computed(() => usernameStrength.value.filter(req => req.met).length);

const usernameText = computed(() => {
  if (usernameScore.value === 0) return 'Wpisz login';
  if (usernameScore.value <= 1) return 'Login jest za słaby';
  return 'Login jest wystarczająco silny';
});

const confirmPasswordFocused = ref(false);
  
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
