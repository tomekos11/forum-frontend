export default defineNuxtPlugin(() => {
  process.on('uncaughtException', (err) => {
    console.error('Nieobsłużony wyjątek:', err);
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Nieobsłużona obietnica:', reason);
  });
});
