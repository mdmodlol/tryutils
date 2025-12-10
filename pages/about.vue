<script setup lang="ts">
// SEO 配置
const { t } = useI18n()
const seoConfig = computed(() => ({
  title: t('about.seo.title'),
  description: t('about.seo.description'),
  keywords: t('about.seo.keywords'),
  ogTitle: t('about.seo.title'),
  ogDescription: t('about.seo.description'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

// 结构化数据
const { useStructuredData } = await import('~/composables/useStructuredData')
const {
  getOrganizationSchema,
  getWebPageSchema,
  setStructuredData
} = useStructuredData()

// 设置关于页面结构化数据
const schemas = [
  getOrganizationSchema(),
  getWebPageSchema({
    name: t('about.seo.title'),
    description: t('about.seo.description')
  })
]

setStructuredData(schemas)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300" itemscope itemtype="https://schema.org/AboutPage">
    <!-- Hero Section -->
    <section class="py-12 px-6" aria-labelledby="about-hero-title">
      <div class="max-w-4xl mx-auto text-center">
        <div class="fade-in">
          <h1 id="about-hero-title" class="text-4xl md:text-5xl font-bold text-gradient mb-6" itemprop="headline">
            {{ $t('about.hero.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed" itemprop="description">
            {{ $t('about.hero.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- 主要内容 -->
    <main role="main" class="pb-16">
      <div class="max-w-4xl mx-auto px-6">
        <div class="space-y-16 slide-up">
          <!-- 我们的使命 -->
          <section class="card p-8" aria-labelledby="mission-title">
            <article class="flex items-start space-x-6">
              <div 
                class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h2 id="mission-title" class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('about.mission.title') }}</h2>
                <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ $t('about.mission.description') }}
                </p>
              </div>
            </article>
          </section>

          <!-- 我们的故事 -->
          <section class="card p-8" aria-labelledby="story-title">
            <article class="flex items-start space-x-6">
              <div 
                class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div>
                <h2 id="story-title" class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('about.story.title') }}</h2>
                <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {{ $t('about.story.paragraph1') }}
                </p>
                <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ $t('about.story.paragraph2') }}
                </p>
              </div>
            </article>
          </section>

          <!-- 未来愿景 -->
          <section class="card p-8" aria-labelledby="vision-title">
            <article class="flex items-start space-x-6">
              <div 
                class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <div>
                <h2 id="vision-title" class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('about.vision.title') }}</h2>
                <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ $t('about.vision.description') }}
                </p>
              </div>
            </article>
          </section>

          <!-- 联系我们 -->
          <section class="card p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-0" aria-labelledby="contact-title">
            <div class="text-center">
              <h2 id="contact-title" class="text-3xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('about.contact.title') }}</h2>
              <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {{ $t('about.contact.description') }}
              </p>
              <a 
                href="mailto:support@tryutils.com" 
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="发送邮件至 support@tryutils.com"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>support@tryutils.com</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>