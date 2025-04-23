<template>
  <UModal v-model:open="showModal" title="Odbanowanie użytkownika">
    <UButton
      color="info"
      label="Odbanuj użytkownika"
      icon="i-lucide-lock-open"
    />

    <template #content>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Odbanowanie użytkownika</h2>
        </template>
        
        <form @submit.prevent="onSubmit">
          <div class="mb-5">
            <div v-if="user.banInfo?.unlockDate">
              Dotychczasowa blokada powinna potrwać jeszcze<br>
              <template v-if="timeRemaining?.years">
                {{ timeRemaining?.years }} lat
              </template>
              <template v-if="timeRemaining?.months">
                {{ timeRemaining?.months }} miesięcy
              </template>
              <template v-if="timeRemaining?.days">
                {{ timeRemaining?.days }} dni
              </template>
              <template v-if="timeRemaining?.hours">
                {{ timeRemaining?.hours }} godziny
              </template>
              {{ timeRemaining?.minutes }} minuty
  
            </div>
            <div v-else>
              Dotychczasowa blokada powinna być pernamentna
            </div>
          </div>

          <UFormField label="Komentarz" required>
            <UInput
              v-model="comment"
              placeholder="Opisz dlaczego zdejmujesz blokadę"
              label="Blokada"
              size="xl"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-2 mt-4">
            <UButton label="Anuluj" color="error" @click="showModal = false"/>
            <UButton label="Odbanuj użytkownika" type="submit"/>
          </div>
        </form>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import type { User } from '~/types/types';

const showModal = ref(false);

const user = defineModel<User>('user', {
  required: true
});

const unlockDate = computed(() =>
  user.value.banInfo?.unlockDate ? DateTime.fromISO(user.value.banInfo.unlockDate) : null
);

const now = ref(DateTime.now());

let intervalId: number;

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = DateTime.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const timeRemaining = computed(() => {
  if (!unlockDate.value) return null;

  const diff = unlockDate.value.diff(now.value, ['years', 'months', 'days', 'hours', 'minutes']);

  return {
    years: Math.floor(diff.years),
    months: Math.floor(diff.months),
    days: Math.floor(diff.days),
    hours: Math.floor(diff.hours),
    minutes: Math.floor(diff.minutes)
  };
});

const comment = ref('');

const onSubmit = async () => {
  try {
    await useFetchWithAuth<{message: string; user: User}>(`/bans/${user.value.username}`, {
      method: 'delete',
      params: {
        comment: comment.value
      }
    });

    user.value.banInfo = {
      isBanned: false,
      unlockDate: null
    };
  } catch (e) {
    console.error(e);
  }
};
</script>