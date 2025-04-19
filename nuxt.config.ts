// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-security',
  ],

  plugins: [
    { src: '~/plugins/pinia.ts', mode: 'all' }
  ],

  eslint: {
    // checker: true,
  },

  css: ['~/assets/css/main.css'],

  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ['\'self\''],
        'connect-src': ['\'self\'', import.meta.env.NUXT_PUBLIC_API_URL],
        'script-src': ['\'self\'', 'https:', '\'unsafe-inline\''],
        'style-src': ['\'self\'', 'https:', '\'unsafe-inline\''],
        'img-src': ['\'self\'', 'data:', 'https:'],
        'font-src': ['\'self\'', 'https:', 'data:'],
        'object-src': ['\'none\''],
        'upgrade-insecure-requests': true,
      },
    },
  },

  runtimeConfig: {
    public: {
      API_URL: import.meta.env.NUXT_PUBLIC_API_URL
    }
  }
});