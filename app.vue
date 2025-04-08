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
const forumsStore = useForumsStore();

forumsStore.fetchForums();

// if (import.meta.server) {
//   onServerPrefetch(async () => {
//     await userStore.fetchUser();
//   });
// }

// await useAsyncData('user', () => userStore.fetchUser());
userStore.fetchUser();
</script>