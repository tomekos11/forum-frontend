<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </UApp>

</template>

<script setup>
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
userStore.fetchUser();
</script>