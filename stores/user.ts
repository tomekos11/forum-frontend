import type { Notification, User } from '~/types/types';

export const useUserStore = defineStore('user', () => {
  const id = ref<User['id']>(null);
  const username = ref<User['username']>(null);
  const role = ref<User['role']>(null);
  const data = ref<User['data']>(null);
  const createdAt = ref<User['createdAt']>(null);
  const updatedAt = ref<User['updatedAt']>(null);
  const notifications = ref<Notification[]>([]);

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

  const setUser = (user: User, nots: Notification[]) => {
    id.value = user.id;
    username.value = user.username;
    data.value = user.data;
    role.value = user.role;
    createdAt.value = user.createdAt;
    updatedAt.value = user.updatedAt;
    notifications.value = nots;
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

  const fetchUser = async () => {

    const { data: fetchedUser } = await useAsyncData('user', async () => {

      try {
        const { user, notifications: nots } = await useFetchWithAuth<{notifications: Notification[], user: User}>('/check-user');

        return {
          user,
          nots
        };
      } catch (err) {
        return {
          id: null,
          username: null,
          data: null,
          role: null,
          createdAt: null,
          updatedAt: null,
          notifications: [],
        };
      }
    });


    if (fetchedUser.value && fetchedUser.value.user && fetchedUser.value.nots) {
      setUser(fetchedUser.value.user, fetchedUser.value.nots);
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
    notifications,
    setUser,
    fetchUser,
    clear,
    logout,
  };
});