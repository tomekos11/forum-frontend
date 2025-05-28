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

  icon: {
    mode: 'svg'
  },

  css: ['~/assets/css/main.css'],

  security: {
    // rateLimiter: false,
    nonce: true,
    headers: {
      contentSecurityPolicy: {
        'default-src': ['\'self\''],
        'connect-src': ['\'self\'', import.meta.env.NUXT_PUBLIC_API_URL, import.meta.env.NUXT_PUBLIC_API_URL_HTTPS],
        'script-src': ['\'self\'', '\'nonce-{{nonce}}\'', '\'strict-dynamic\''],
        'style-src': ['\'self\'', '\'nonce-{{nonce}}\''],
        'img-src': ['\'self\'', 'data:', 'blob:', 'https://i.pravatar.cc', import.meta.env.NUXT_PUBLIC_API_URL, import.meta.env.NUXT_PUBLIC_API_URL_HTTPS],
        'font-src': ['\'self\''],
        'object-src': ['\'none\''],
        'frame-ancestors' : ['\'none\''],
        'upgrade-insecure-requests': true,
      },
    },
  },

  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': import.meta.env.NUXT_PUBLIC_API_URL,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      }
    },
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      },
      // security: {
      // corsHandler: false
      // }
    }
  },

  runtimeConfig: {
    public: {
      API_URL: import.meta.env.NUXT_PUBLIC_API_URL,
      API_URL_HTTPS: import.meta.env.NUXT_PUBLIC_API_URL_HTTPS,
    }
  }
});