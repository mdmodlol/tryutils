// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-30',
  devtools: { enabled: true },
  site: {
    url: 'https://www.tryutils.com',
    name: 'TryUtils',
    description: 'Free online utilities for HEIC conversion, image compression, and practical browser-based tools.',
    defaultLocale: 'zh'
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
    '@nuxt/image',
    '@nuxtjs/color-mode'
  ],
  // Color mode 配置
  colorMode: {
    preference: 'system',      // 默认跟随系统
    fallback: 'light',         // 无法检测时的回退
    classSuffix: '',           // 使用 'dark' 而非 'dark-mode'
    storageKey: 'nuxt-color-mode'
  },
  // i18n 国际化配置
  i18n: {
    locales: [
      {
        code: 'zh',
        name: '中文',
        file: 'zh.json',
        iso: 'zh-CN'
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
        iso: 'en-US'
      }
    ],
    defaultLocale: 'zh',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      cookieCrossOrigin: false,
      cookieSecure: true,
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'zh',
      cookieDomain: null
    },
    skipSettingLocaleOnNavigate: false
  },
  // Content 模块配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      title: 'TryUtils - Free Online Tools for HEIC Conversion, Image Compression, and More',
      link: [
        // Favicon 和 PWA 相关文件
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        // DNS 预解析和预连接
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // 字体预加载
        { rel: 'preload', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
      ],
      meta: [
        { name: 'description', content: 'TryUtils provides free online tools for HEIC conversion, image compression, format conversion, and other browser-based utilities.' },
        { name: 'keywords', content: 'heic converter,image compressor,image format converter,online tools,free browser tools,heic to jpg,heic to png,tryutils' },
        { name: 'author', content: 'TryUtils Team' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'application-name', content: 'TryUtils' },
        // 安全相关
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'referrer', content: 'no-referrer-when-downgrade' },
        // PWA 相关 meta 标签
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'TryUtils' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        { name: 'msapplication-config', content: '/browserconfig.xml' },
        { name: 'msapplication-TileImage', content: '/android-chrome-192x192.png' },
        // Open Graph 标签
        { property: 'og:site_name', content: 'TryUtils' },
        { property: 'og:title', content: 'TryUtils - Free Online Tools for HEIC Conversion, Image Compression, and More' },
        { property: 'og:description', content: 'TryUtils provides free online tools for HEIC conversion, image compression, format conversion, and other browser-based utilities.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.tryutils.com' },
        { property: 'og:image', content: 'https://www.tryutils.com/android-chrome-512x512.png' },
        { property: 'og:image:width', content: '512' },
        { property: 'og:image:height', content: '512' },
        { property: 'og:image:alt', content: 'TryUtils Logo' },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:locale:alternate', content: 'en_US' },
        // Twitter Card 标签
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@TryUtils' },
        { name: 'twitter:creator', content: '@TryUtils' },
        { name: 'twitter:title', content: 'TryUtils - Free Online Tools for HEIC Conversion, Image Compression, and More' },
        { name: 'twitter:description', content: 'TryUtils provides free online tools for HEIC conversion, image compression, format conversion, and other browser-based utilities.' },
        { name: 'twitter:image', content: 'https://www.tryutils.com/android-chrome-512x512.png' },
        { name: 'twitter:image:alt', content: 'TryUtils Logo' },
        // 结构化数据
        { name: 'generator', content: 'Nuxt.js' }
      ]
    }
  },
  // CSS 配置
  css: [
    '~/assets/css/main.css',
    '~/assets/css/prose.css',
    '~/assets/css/performance.css'
  ],
  
  build: {
    transpile: [
      'browser-image-compression'
    ]
  },
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: [
        'browser-image-compression'
      ]
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router']
          }
        }
      }
    },
    // 处理 CommonJS 模块
    ssr: {
      noExternal: ['heic-convert']
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
  // 站点地图配置
  // @nuxtjs/sitemap v7+ 会自动从预渲染路由和 Nuxt Content 中发现页面
  // 无需手动列出所有 URL，也无需使用已废弃的 routes 回调
  sitemap: {
    autoLastmod: true,
    exclude: [
      '/admin/**',
      '/api/**',
      '/404',
      '/500'
    ]
  },
  // Robots.txt 配置（@nuxtjs/robots v5+ 格式）
  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/'],
        disallow: [
          '/admin',
          '/404',
          '/500',
          '/*?*utm_*',
          '/*?*ref=*',
          '/*?*fbclid=*'
        ]
      }
    ],
    sitemap: 'https://www.tryutils.com/sitemap.xml'
  },
  // Google Analytics 配置
  gtag: {
    id: process.env.GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX',
    config: {
      anonymize_ip: true,
      send_page_view: false
    }
  },
  // 运行时配置
  runtimeConfig: {
    // 私有配置（仅在服务器端可用）
    apiSecret: process.env.API_SECRET,
    // 公共配置（客户端和服务器端都可用）
    public: {
      apiBase: process.env.API_BASE_URL || '/api',
      siteUrl: 'https://www.tryutils.com',
      siteName: 'TryUtils',
      siteDescription: 'TryUtils provides free online tools for HEIC conversion, image compression, format conversion, and other browser-based utilities.'
    }
  },
  // 内容模块配置
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini', 'python', 'java', 'cpp', 'c', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'sql']
    },
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3
      },
      // 禁用标题的自动锚点链接，避免误导用户
      anchorLinks: false
    }
  },
  // Nitro 配置（合并后的唯一配置）
  nitro: {
    compressPublicAssets: true,
    minify: false,
    rollupConfig: {
      external: (id: string) => id.startsWith('file:///') && id.endsWith('/cache-driver.js')
    },
    prerender: {
      crawlLinks: false,
      routes: []
    }
  }
})

