

export const useFetchWithAuth = <T>(url: string, options: any = {}) => {
  const config = useRuntimeConfig();

  const headers = import.meta.server
    ? { cookie: useRequestHeaders(['cookie']).cookie || '' }
    : {};
  
  return $fetch<T>(config.public.API_URL + url, {
    credentials: 'include',
    headers,
    ...options,
  });
};