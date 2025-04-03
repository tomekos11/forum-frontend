import { createPinia } from 'pinia';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(nuxtApp => {
  // if (import.meta.client) {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
  // }
});