export default defineNuxtRouteMiddleware(() => {
  const error = useError();

  if (import.meta.server && error?.statusCode === 500) {
    return navigateTo('/500', { redirectCode: 302 });
  }
});