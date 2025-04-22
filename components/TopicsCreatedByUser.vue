<template>
  <div class="flex flex-col justify-between h-full">
    <UAccordion
      v-if="topics?.length"
      :ui="{
        body: 'px-3',
        header: 'hover:bg-green-800 px-3 transition'
      }"
      :items="topics"
    >
      <template #leading="{ item: topic }">
        <div class="flex items-center gap-3">
          <div>
            {{ topic.name }}
          </div>

          <UBadge
            icon="i-lucide-notebook-pen"
            size="md"
            color="neutral"
            variant="outline"
          >
            Liczba postów {{ topic.postCounter }}
          </UBadge>
          
        </div>
      </template>
  
      <template #body="{ item: topic }">
        <p class="text-sm text-gray-500 line-clamp-3">
          {{ topic.posts?.[0]?.content }}
        </p>
  
        <UButton
          color="primary"
          size="xs"
          variant="ghost"
          class="mt-3 mr-2"
          :to="`/forums/${topic.forum?.slug}/topics/${topic.slug}`"
        >
          Przejdź do tematu
        </UButton>
      </template>
    </UAccordion>
  
    <div v-if="topics?.length" class="mb-6 flex justify-center">
      <UButton
        icon="i-lucide-list"
        color="primary"
        :to="`/forums/`"
      >
        Wszystkie tematy użytkownika
      </UButton>
    </div>

    <div v-if="!topics?.length" class="text-sm mt-4">
      <UIcon name="i-lucide-x" class="text-red-500"/> Użytkownik nie stworzył żadnego tematu
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Topic } from '~/types/types';

const topics = defineModel<Topic[]>('topics');

</script>