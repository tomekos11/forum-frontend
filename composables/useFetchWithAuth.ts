

export const useFetchWithAuth = <T>(url: string, options: any = {}) => {
  const headers = import.meta.server
    ? { cookie: useRequestHeaders(['cookie']).cookie || '' }
    : {};
  
  return $fetch<T>(url, {
    credentials: 'include',
    headers,
    ...options,
  });
};