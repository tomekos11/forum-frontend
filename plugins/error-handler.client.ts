export default defineNuxtPlugin(() => {
  // Global Vue error handler (client-side)
  const app = useNuxtApp();
  app.vueApp.config.errorHandler = (err, vm, info) => {
    console.error('Vue Global Error Handler:', err, info);
  };
});
