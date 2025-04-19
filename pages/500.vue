<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-slate-900">
    <div class="text-center max-w-md p-6 bg-slate-800 shadow-2xl rounded-2xl">
      <div class="text-6xl font-bold text-red-600 mb-4">500</div>
      <p class="text-xl font-semibold mb-2 text-white">Wewnętrzny błąd serwera</p>
      <p class="text-gray-400 mb-6">
        Coś poszło nie tak po naszej stronie. Spróbuj ponownie za chwilę.
      </p>
      <UButton color="error" size="lg" @click="goHome">
        Wróć na stronę główną
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const goHome = () => {
  router.push('/');
};

const checkIfApiIsUp = async () => {
  try {
    const isUp = await useFetchWithAuth('/is-api-online');

    if(isUp) {
      router.replace('/');
    }

  } catch (err) {
    setTimeout(checkIfApiIsUp, 5000);
  }
};

await checkIfApiIsUp();
</script>
