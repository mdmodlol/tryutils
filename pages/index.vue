<script setup lang="ts">
const { t } = useI18n()

const seoConfig = computed(() => ({
  title: t('app.seo.ogTitle'),
  description: t('app.seo.description'),
  keywords: t('app.seo.keywords'),
  ogTitle: t('app.seo.ogTitle'),
  ogDescription: t('app.seo.ogDescription'),
  twitterTitle: t('app.seo.twitterTitle'),
  twitterDescription: t('app.seo.twitterDescription'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

const { useStructuredData } = await import('~/composables/useStructuredData')
const {
  getOrganizationSchema,
  getWebsiteSchema,
  getWebPageSchema,
  setStructuredData
} = useStructuredData()

setStructuredData([
  getOrganizationSchema(),
  getWebsiteSchema(),
  getWebPageSchema({
    name: t('app.seo.ogTitle'),
    description: t('app.seo.description')
  })
])

const toolCategories = computed(() => [
  {
    id: 'image-tools',
    title: t('home.categories.imageTools.title'),
    description: t('home.categories.imageTools.description'),
    link: '/image-tools',
    tools: [
      {
        name: t('nav.imageCompressor'),
        description: t('home.categories.imageTools.compressor.description'),
        path: '/image-compressor'
      },
      {
        name: t('nav.imageFormatConverter'),
        description: t('home.categories.imageTools.converter.description'),
        path: '/image-format-converter'
      },
      {
        name: t('nav.heicConverter'),
        description: t('home.categories.imageTools.heicConverter.description'),
        path: '/heic-converter'
      },
      {
        name: t('nav.qrCodeGenerator'),
        description: t('qrCodeGenerator.hero.subtitle'),
        path: '/qr-code-generator'
      }
    ]
  },
  {
    id: 'dev-tools',
    title: t('home.categories.devTools.title'),
    description: t('home.categories.devTools.description'),
    link: '/dev-tools',
    tools: [
      {
        name: t('nav.jsonFormatter'),
        description: t('home.categories.devTools.jsonFormatter.description'),
        path: '/json-formatter'
      },
      {
        name: t('nav.base64Codec'),
        description: t('home.categories.devTools.base64Codec.description'),
        path: '/base64-codec'
      },
      {
        name: t('nav.colorConverter'),
        description: t('home.categories.devTools.colorConverter.description'),
        path: '/color-converter'
      },
      {
        name: t('nav.textDiff'),
        description: t('home.categories.devTools.textDiff.description'),
        path: '/text-diff'
      },
      {
        name: t('nav.urlCodec'),
        description: t('home.categories.devTools.urlCodec.description'),
        path: '/url-codec'
      },
      {
        name: t('nav.markdownPreview'),
        description: t('home.categories.devTools.markdownPreview.description'),
        path: '/markdown-preview'
      }
    ]
  }
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300" itemscope itemtype="https://schema.org/WebPage">
    <main role="main">
      <HomepageRedesign :tool-categories="toolCategories" />
    </main>
  </div>
</template>
