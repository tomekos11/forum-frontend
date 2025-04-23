<template>
  <UModal v-model:open="showModal" title="Banowanie użytkownika">
    <UButton
      color="error"
      label="Zbanuj użytkownika"
      icon="i-lucide-ban"
    />

    <template #content>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Banowanie użytkownika</h2>
        </template>
        
        <form @submit="onSubmit">
          <UFormField label="Powód blokady" required>
            <UInput
              v-model="reason"
              placeholder="Wpisz powód blokady"
              label="Bio"
              size="xl"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Czas trwania blokady" required class="mt-3">
            <UButtonGroup class="flex">
              <UInputNumber v-model="dateNumber" size="xl" class="grow" color="neutral" variant="outline" :min="0"/>

              <USelect
                v-model="dateType"
                size="md"
                trailing-icon="i-lucide-arrow-down"
                :items="items"
                class="w-40"
              />
            </UButtonGroup>
          </UFormField>

          <div class="flex justify-end gap-2 mt-4">
            <UButton label="Anuluj" color="error" @click="showModal = false"/>
            <UButton label="Zbanuj użytkownika" type="submit"/>
          </div>
        </form>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { User } from '~/types/types';

const showModal = ref(false);

const user = defineModel<User>('user', {
  required: true
});

const items = ref([
  [
    { label: 'Dzień', value: 'd', key: 'd' },
    { label: 'Miesiąc', value: 'm', key: 'm' },
    { label: 'Rok', value: 'y', key: 'y' }
  ]
]);

const dateNumber = ref<number>(1);
const dateType = ref<'d' | 'm' | 'y'>('d');

const reason = ref('');

const onSubmit = () => {
  useFetchWithAuth('/bans', {
    method: 'post',
    body: {
      userId: user.value.id,
      duration: `${dateNumber.value}${dateType.value}`,
      reason: reason.value
    }
  });
};
</script>