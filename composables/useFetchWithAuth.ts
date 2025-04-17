export const useFetchWithAuth = <T>(url: string, options: any = {}): Promise<T> => {
  const config = useRuntimeConfig();

  const headers = import.meta.server
    ? { cookie: useRequestHeaders(['cookie']).cookie || '' }
    : {};
    
  return $fetch<T>(config.public.API_URL + url, {
    credentials: 'include',
    headers,
    ...options,
  }).catch(async (error) => {
    const isSSR = import.meta.server;

    // Logika dla SSR
    if (isSSR) {
      const statusCode = error.statusCode || error.response?.status;
      const isConnectionError = error.code === 'ECONNREFUSED' || error?.cause?.message === 'fetch failed';

      if (statusCode === 500 || isConnectionError) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Błąd połączenia z API',
          fatal: true,
        });
      }
    }
    else {
      const shouldRedirect = 
        error?.response?.status === 500 ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('ERR_CONNECTION_REFUSED');

      if (shouldRedirect) {
        // return navigateTo('/500');

        await navigateTo('/500', { redirectCode: 302, replace: true });
        throw new Error('Client redirect triggered'); // 👈 Nowy błąd
      }
    }

    throw error;
  });
};