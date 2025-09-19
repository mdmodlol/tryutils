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
    '@nuxtjs/i18n',
    '@nuxt/image'
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
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      title: 'TryUtils - 实用工具集合',
      link: [
        // Favicon 和 PWA 相关文件
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      meta: [
        { name: 'description', content: 'TryUtils提供各种实用的在线工具，包括HEIC图片转换、文件处理等功能，让您的工作更加高效便捷。' },
        { name: 'keywords', content: 'HEIC转换,图片转换,在线工具,实用工具,文件处理' },
        { name: 'author', content: 'TryUtils Team' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        // PWA 相关 meta 标签
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'TryUtils' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        { name: 'msapplication-config', content: '/browserconfig.xml' },
        { property: 'og:title', content: 'TryUtils - 实用工具集合' },
        { property: 'og:description', content: 'TryUtils提供各种实用的在线工具，包括HEIC图片转换、文件处理等功能。' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.tryutils.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'TryUtils - 实用工具集合' },
        { name: 'twitter:description', content: 'TryUtils提供各种实用的在线工具，包括HEIC图片转换、文件处理等功能。' }
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
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'heic-converter': ['heic2any'],
            'vendor': ['vue', 'vue-router']
          }
        }
      }
    }
  },
  // 性能优化配置
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false
  },
  // 图片优化
  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 50,
          height: 50
        }
      },
      cover: {
        modifiers: {
          format: 'webp',
          width: 800,
          height: 400,
          fit: 'cover'
        }
      }
    }
  },
  // Sitemap 配置
  sitemap: {
    hostname: 'https://www.tryutils.com',
    gzip: true,
    exclude: [
      '/admin/**',
      '/api/**'
    ],
    routes: async () => {
      // 静态路由配置
      const staticRoutes = [
        // 中文路由
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/about', changefreq: 'monthly', priority: 0.8 },
        { url: '/contact', changefreq: 'monthly', priority: 0.7 },
        { url: '/blog', changefreq: 'weekly', priority: 0.9 },
        { url: '/privacy', changefreq: 'yearly', priority: 0.5 },
        // 英文路由
        { url: '/en', changefreq: 'daily', priority: 1.0 },
        { url: '/en/about', changefreq: 'monthly', priority: 0.8 },
        { url: '/en/contact', changefreq: 'monthly', priority: 0.7 },
        { url: '/en/blog', changefreq: 'weekly', priority: 0.9 },
        { url: '/en/privacy', changefreq: 'yearly', priority: 0.5 }
      ]
      
      return staticRoutes
    }
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
    },
    externals: {
      inline: ['jszip']
    }
  }
})
