export default defineNuxtRouteMiddleware((to) => {
  const error = useError();

  if (import.meta.server && error?.value?.statusCode === 500) {
    // Logowanie błędu do konsoli
    console.error('Błąd 500 na serwerze podczas nawigacji:', {
      url: to.fullPath,
      error,
    });

    // Ewentualnie, wywołaj funkcję logowania do zew. systemu, np. Sentry
    // Sentry.captureException(error);

    return navigateTo('/500', { redirectCode: 302 });
  }
});
