// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon'
  ],
  app: {
    head: {
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/tailwind.min.css' 
        }
      ]
    }
  },
  build: {
    transpile: ['heic2any']
  },
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['heic2any']
    }
  },
  ssr: {
    noExternal: ['heic2any']
  }
})