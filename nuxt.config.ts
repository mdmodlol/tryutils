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
    '@nuxtjs/robots',
    'nuxt-gtag',
    '@nuxt/content',
    '@nuxtjs/i18n'
  ],
  // i18n 国际化配置
  i18n: {
    locales: [
      {
        code: 'zh',
        name: '中文',
        file: 'zh.json'
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      }
    ],
    defaultLocale: 'zh',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'zh'
    }
  },
  // Content 模块配置
  app: {
    head: {
      link: [
        // Favicon 和 PWA 相关文件
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      meta: [
        // PWA 相关 meta 标签
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'TryUtils' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        { name: 'msapplication-config', content: '/browserconfig.xml' }
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
  // Sitemap 配置
  sitemap: {
    hostname: 'https://www.tryutils.com',
    gzip: true,
    routes: [
      '/zh',
      '/zh/about',
      '/zh/contact',
      '/zh/blog',
      '/en',
      '/en/about', 
      '/en/contact',
      '/en/blog'
    ]
  },
  // Robots.txt 配置
  robots: {
    UserAgent: '*',
    Allow: '/',
    Sitemap: 'https://www.tryutils.com/sitemap.xml'
  },
  gtag: {
    id: 'G-M8PTWVBGJL'
  },
  nitro: {
    experimental: {
      wasm: true
    }
  }
})
