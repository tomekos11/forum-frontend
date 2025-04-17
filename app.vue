<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </UApp>

</template>

<script setup>
import { useUserStore } from '~/stores/user';
import { useForumsStore } from './stores/forum';

const userStore = useUserStore();
useForumsStore();

userStore.fetchUser();
</script>