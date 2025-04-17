import { defineStore } from 'pinia';
import type { Forum } from '~/types/types';

interface Forums {
    forums: Forum[] | null
  }

export const useForumsStore = defineStore('forums', () => {
  // const forums = ref<Forums['forums']>(null);
  
  const navigationForums = computed(() => {
    return forums.value?.map(forum => ({
      label: forum.name,
      description: forum.description,
      to: `/forums/${forum.slug}`
    })) || [];
  });
  

  // const { data } = await useFetch<Forum[]>(`${config.public.API_URL}/forums`);
  // if (data.value) {
  //   forums.value = data.value;
  // }

  const { data: forums } = useAsyncData(async () => {
    try {
      const res = await useFetchWithAuth<Forum[]>('/forums');
      return res;
    } catch (err) {
      return null; 
    }
      
  });


  return {
    forums,
    navigationForums,
  };
});