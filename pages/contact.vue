<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300" itemscope itemtype="https://schema.org/ContactPage">
    <!-- Hero Section -->
    <section class="py-12 px-6" aria-labelledby="contact-hero-title">
      <div class="max-w-4xl mx-auto text-center">
        <div class="fade-in">
          <h1 id="contact-hero-title" class="text-4xl md:text-5xl font-bold text-gradient mb-6" itemprop="headline">
            {{ $t('contact.hero.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed" itemprop="description">
            {{ $t('contact.hero.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- 主要内容 -->
    <main role="main" class="pb-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="slide-up">
          <!-- 联系方式 -->
          <section aria-labelledby="contact-methods-title">
            <h2 id="contact-methods-title" class="sr-only">{{ $t('accessibility.contactMethods') }}</h2>
            <div class="grid lg:grid-cols-2 gap-12 mb-16">
              <!-- 邮箱联系 -->
              <article class="card p-8 text-center" aria-labelledby="email-contact-title">
                <div 
                  class="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  aria-hidden="true"
                >
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 id="email-contact-title" class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('contact.email.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">{{ $t('contact.email.description') }}</p>
                <a 
                  href="mailto:support@tryutils.com" 
                  class="btn-primary inline-flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :aria-label="$t('accessibility.sendEmailTo', { email: 'support@tryutils.com' })"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>support@tryutils.com</span>
                </a>
              </article>

              <!-- 社交媒体 -->
              <article class="card p-8 text-center" aria-labelledby="social-contact-title">
                <div 
                  class="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  aria-hidden="true"
                >
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                  </svg>
                </div>
                <h3 id="social-contact-title" class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('contact.social.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">{{ $t('contact.social.description') }}</p>
                <div class="text-gray-500 dark:text-gray-400">
                  <p>{{ $t('contact.social.comingSoon') }}</p>
                  <p class="text-sm mt-2" :aria-label="$t('accessibility.upcomingSocialPlatforms')">Telegram • Twitter • GitHub</p>
                </div>
              </article>
            </div>
          </section>

          <!-- 联系类型 -->
          <section class="mb-16" aria-labelledby="contact-types-title">
            <h2 id="contact-types-title" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">{{ $t('contact.types.title') }}</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="list" :aria-label="$t('accessibility.contactTypesListAriaLabel')">
              <article 
                class="card p-6 text-center hover:scale-105 transition-transform duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900" 
                role="listitem"
                aria-labelledby="suggestion-type-title"
              >
                <div 
                  class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                  aria-hidden="true"
                >
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 id="suggestion-type-title" class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('contact.types.suggestion.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">{{ $t('contact.types.suggestion.description') }}</p>
              </article>
              
              <article 
                class="card p-6 text-center hover:scale-105 transition-transform duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900" 
                role="listitem"
                aria-labelledby="feedback-type-title"
              >
                <div 
                  class="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                  aria-hidden="true"
                >
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 id="feedback-type-title" class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('contact.types.feedback.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">{{ $t('contact.types.feedback.description') }}</p>
              </article>
              
              <article 
                class="card p-6 text-center hover:scale-105 transition-transform duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900" 
                role="listitem"
                aria-labelledby="business-type-title"
              >
                <div 
                  class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                  aria-hidden="true"
                >
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                </div>
                <h3 id="business-type-title" class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('contact.types.business.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">{{ $t('contact.types.business.description') }}</p>
              </article>
              
              <article 
                class="card p-6 text-center hover:scale-105 transition-transform duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900" 
                role="listitem"
                aria-labelledby="help-type-title"
              >
                <div 
                  class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                  aria-hidden="true"
                >
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 id="help-type-title" class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('contact.types.help.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">{{ $t('contact.types.help.description') }}</p>
              </article>
            </div>
          </section>

          <!-- 常见问题引导 -->
          <section class="card p-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-0 text-center" aria-labelledby="before-contact-title">
            <h2 id="before-contact-title" class="text-3xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('contact.beforeContact.title') }}</h2>
            <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {{ $t('contact.beforeContact.description') }}
            </p>
            <nav class="flex flex-wrap justify-center gap-4" aria-label="相关页面链接">
              <NuxtLink 
                :to="localePath('/about')" 
                class="btn-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :aria-label="`访问${$t('nav.about')}页面`"
              >
                {{ $t('nav.about') }}
              </NuxtLink>
              <NuxtLink 
                :to="localePath('/privacy')" 
                class="btn-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :aria-label="`访问${$t('contact.beforeContact.privacy')}页面`"
              >
                {{ $t('contact.beforeContact.privacy') }}
              </NuxtLink>
            </nav>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// SEO 配置
const seoConfig = computed(() => ({
  title: t('contact.meta.title'),
  description: t('contact.meta.description'),
  keywords: t('contact.meta.keywords'),
  ogTitle: t('contact.meta.title'),
  ogDescription: t('contact.meta.description'),
  ogType: 'website'
}))

// 使用 SEO composable
const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

// 结构化数据
const { useStructuredData } = await import('~/composables/useStructuredData')
const {
  getOrganizationSchema,
  getWebPageSchema,
  setStructuredData
} = useStructuredData()

// 设置联系页面结构化数据
const schemas = [
  getOrganizationSchema(),
  getWebPageSchema({
    name: t('contact.meta.title'),
    description: t('contact.meta.description')
  })
]

setStructuredData(schemas)
</script>