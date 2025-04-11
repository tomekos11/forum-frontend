import { defineStore } from 'pinia';
import type { User } from '~/types/types';

export const useUserStore = defineStore('user', () => {
  const id = ref<User['id']>(null);
  const username = ref<User['username']>(null);
  const role = ref<User['role']>(null);
  const data = ref<User['data']>(null);
  const createdAt = ref<User['createdAt']>(null);
  const updatedAt = ref<User['updatedAt']>(null);

  const isLoggedIn = computed(() => !!username.value);

  const config = useRuntimeConfig();

  const clear = () => {
    id.value = null;
    username.value = null;
    data.value = null;
    role.value = null;
    createdAt.value = null;
    updatedAt.value = null;
  };

  const setUser = (user: User) => {
    id.value = user.id;
    username.value = user.username;
    data.value = user.data;
    role.value = user.role;
    createdAt.value = user.createdAt;
    updatedAt.value = user.updatedAt;
  };

  const logout = async () => {
    clear();
    const toast = useToast();
    
    try {
      const res = await $fetch<{user: User}>(`${config.public.API_URL}/logout`, {
        credentials: 'include',
      });
      console.log(res);
      toast.add({
        title: 'Poprawnie wylogowano'
      });
    }catch(err) {
      console.error(err);
    }
  };

  // const fetchUser = async () => {

  //   try {
  //     const headers = import.meta.server 
  //       ? { cookie: useRequestHeaders(['cookie']).cookie || '' } 
  //       : {};

  //     const res = await $fetch<{user: User}>(`${config.public.API_URL}/check-user`, {
  //       credentials: 'include',
  //       headers
  //     });

  //     id.value = res.user.id;
  //     username.value = res.user.username;
  //     image.value = res.user.image;
  //     role.value = res.user.role;
  //     createdAt.value = res.user.createdAt;
  //     updatedAt.value = res.user.updatedAt;
      
  //     return { ...res.user };
  //   } catch (err) {
  //     console.error(err);
  //     return {
  //       id: null,
  //       username: null,
  //       image: null,
  //       role: null,
  //       createdAt: null,
  //       updatedAt: null,
  //     };
  //   }
  // };

  const fetchUser = async () => {

    const { data: fetchedUser } = await useAsyncData('user', async () => {

      try {
        const res = await useFetchWithAuth<{user: User}>(`${config.public.API_URL}/check-user`);

        // try {
        //   const headers = import.meta.server 
        //     ? { cookie: useRequestHeaders(['cookie']).cookie || '' } 
        //     : {};

        //   const res = await $fetch<{user: User}>(`${config.public.API_URL}/check-user`, {
        //     credentials: 'include',
        //     headers
        //   });

        return res.user;
      } catch (err) {
        return {
          id: null,
          username: null,
          data: null,
          role: null,
          createdAt: null,
          updatedAt: null,
        };
      }
    });


    if (fetchedUser.value) {
      setUser(fetchedUser.value);
    }

  };

  const isAdminOrModerator = computed(() => role.value === 'admin' || role.value === 'moderator');

  return {
    id,
    username,
    role,
    data,
    createdAt,
    updatedAt,
    isLoggedIn,
    isAdminOrModerator,
    setUser,
    fetchUser,
    clear,
    logout,
  };
});