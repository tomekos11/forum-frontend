// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui'
  ],

  plugins: [
    { src: '~/plugins/pinia.ts', mode: 'client' }
  ],

  eslint: {
    // checker: true,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      API_URL: import.meta.env.NUXT_PUBLIC_API_URL
    }
  }
});