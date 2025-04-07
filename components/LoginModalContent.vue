<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <UFormGroup label="Nazwa użytkownika" name="username">
      <UInput v-model="form.username" placeholder="Wpisz nazwę użytkownika" />
    </UFormGroup>
  
    <UFormGroup label="Hasło" name="password">
      <UInput v-model="form.password" type="password" placeholder="Wpisz hasło" />
    </UFormGroup>
  
    <UButton type="submit" label="Zaloguj się" class="w-full" />
  </form>
</template>
  
<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false });
  
const form = reactive({
  username: '',
  password: ''
});
  
const onSubmit = async () => {
  login();
  isOpen.value = false;
};

const login = async () => {
  const config = useRuntimeConfig();

  const loginData = {
    username: form.username,
    password: form.password
  };

  console.log(config.public.API_URL);
  try {
    const res = await $fetch(`${config.public.API_URL}/login`, {
      body: loginData,
      method: 'post',
      credentials: 'include'
    });

    console.log(res);
  } catch (err) {
    console.error(err);
  }
};
</script>
  