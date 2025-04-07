import { defineStore } from 'pinia';

interface User {
    id: number | null;
    username: string | null;
    image: string | null;
    role: 'user' | 'marketing' | 'moderator' | 'admin' | null;
    createdAt: string | null;
    updatedAt: string | null;
  }

export const useUserStore = defineStore('user', () => {
  const id = ref<User['id']>(null);
  const username = ref<User['username']>(null);
  const image = ref<User['image']>(null);
  const role = ref<User['role']>(null);
  const createdAt = ref<User['createdAt']>(null);
  const updatedAt = ref<User['updatedAt']>(null);

  const isLoggedIn = computed(() => !!username.value);

  const config = useRuntimeConfig();

  const clear = () => {
    id.value = null;
    username.value = null;
    image.value = null;
    role.value = null;
    createdAt.value = null;
    updatedAt.value = null;
  };

  const logout = async () => {
    clear();
    try {
      const res = await $fetch<{user: User}>(`${config.public.API_URL}/logout`, {
        credentials: 'include',
      });
      console.log(res);
    }catch(err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    try {
      const headers = import.meta.server 
        ? { cookie: useRequestHeaders(['cookie']).cookie || '' } 
        : {};

      const res = await $fetch<{user: User}>(`${config.public.API_URL}/check-user`, {
        credentials: 'include',
        headers
      });

      id.value = res.user.id;
      username.value = res.user.username;
      image.value = res.user.image;
      role.value = res.user.role;
      createdAt.value = res.user.createdAt;
      updatedAt.value = res.user.updatedAt;

    } catch (err) {
      console.error(err);
    }
  };

  return {
    id,
    username,
    image,
    role,
    createdAt,
    updatedAt,
    isLoggedIn,
    fetchUser,
    clear,
    logout,
  };
});