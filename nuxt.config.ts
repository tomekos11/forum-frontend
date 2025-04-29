// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image', '@nuxt/ui', 'nuxt-security', '@pinia/nuxt'],

  plugins: [
    // { src: '~/plugins/pinia.ts', mode: 'all' }
  ],

  eslint: {
    // checker: true,
  },

  css: ['~/assets/css/main.css'],

  security: {
    nonce: true,
    headers: {
      contentSecurityPolicy: {
        'default-src': ['\'self\''],
        'connect-src': ['\'self\'', import.meta.env.NUXT_PUBLIC_API_URL],
        'script-src': ['\'self\'', '\'nonce-{{nonce}}\'', '\'strict-dynamic\''],
        'style-src': ['\'self\'', 'https:', '\'unsafe-inline\''],
        'img-src': ['\'self\'', 'data:', 'blob:', 'https://i.pravatar.cc', import.meta.env.NUXT_PUBLIC_API_URL],
        'font-src': ['\'self\''],
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