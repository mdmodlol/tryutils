// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-30',
  devtools: { enabled: true },
  site: {
    url: 'https://www.tryutils.com',
  },
  modules: [
    '@nuxt/eslint',
    'nuxt-icon',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    'nuxt-gtag'

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
  gtag: {
    id: 'G-M8PTWVBGJL' // 3. 把这里换成你自己的衡量ID
  },
  ssr: {
    noExternal: ['heic2any']
  }
})