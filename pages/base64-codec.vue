<script setup lang="ts">
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()

const toolId = 'base64-codec'

const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.devTools'), path: '/dev-tools' },
  { name: t('base64Codec.title'), path: '/base64-codec' }
])

const heroBullets = computed(() => [
  { icon: 'heroicons:shield-check', label: t('home.features.privacy.description') },
  { icon: 'heroicons:bolt', label: t('home.features.fast.description') },
  { icon: 'heroicons:document-text', label: t('devTools.description') }
])

const faqItems = computed(() => getToolFAQs(toolId, locale.value))

const howToSteps = computed<HowToStep[]>(() => [
  { name: t('base64Codec.howTo.step1.name'), text: t('base64Codec.howTo.step1.text') },
  { name: t('base64Codec.howTo.step2.name'), text: t('base64Codec.howTo.step2.text') },
  { name: t('base64Codec.howTo.step3.name'), text: t('base64Codec.howTo.step3.text') },
  { name: t('base64Codec.howTo.step4.name'), text: t('base64Codec.howTo.step4.text') }
])

const comparisons = computed(() => [
  { feature: t('base64Codec.comparison.textAndImages'), ourTool: true, competitor1: false, competitor2: false },
  { feature: t('base64Codec.comparison.localProcessing'), ourTool: true, competitor1: false, competitor2: false },
  { feature: t('base64Codec.comparison.fileUpload'), ourTool: true, competitor1: false, competitor2: true },
  { feature: t('base64Codec.comparison.utf8Support'), ourTool: true, competitor1: true, competitor2: false },
  { feature: t('base64Codec.comparison.noRegistration'), ourTool: true, competitor1: true, competitor2: true }
])

const competitorNames = ['Base64 Guru', 'RapidTables']

const stats = {
  totalUsers: '18,000+',
  filesProcessed: '250,000+',
  avgRating: '4.8/5'
}

const seoConfig = computed(() => ({
  title: t('base64Codec.meta.title'),
  description: t('base64Codec.meta.description'),
  keywords: t('base64Codec.meta.keywords'),
  ogTitle: t('base64Codec.meta.title'),
  ogDescription: t('base64Codec.meta.description'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

const { useStructuredData } = await import('~/composables/useStructuredData')
const {
  getOrganizationSchema,
  getWebPageSchema,
  getSoftwareApplicationSchema,
  setStructuredData
} = useStructuredData()

setStructuredData([
  getOrganizationSchema(),
  getWebPageSchema({
    name: t('base64Codec.meta.title'),
    description: t('base64Codec.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('base64Codec.meta.title'),
    description: t('base64Codec.meta.description'),
    category: 'DeveloperApplication'
  })
])
</script>

<template>
  <ToolPageShell
    :breadcrumb-items="breadcrumbItems"
    :section-label="t('home.categories.devTools.title')"
    :title="t('base64Codec.title')"
    :description="t('base64Codec.subtitle')"
    :bullets="heroBullets"
    :workspace-label="t('base64Codec.title')"
    workspace-width="wide"
  >
    <ClientOnly>
      <Base64Codec />
      <template #fallback>
        <div class="flex min-h-[280px] items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600" role="status" aria-label="Loading"></div>
            <p class="text-slate-600 dark:text-slate-300">{{ t('common.loading') || 'Loading...' }}</p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <template #after-main>
      <ToolPageContent
        :tool-name="t('base64Codec.title')"
        :steps="howToSteps"
        :comparisons="comparisons"
        :competitor-names="competitorNames"
        :stats="stats"
      />

      <FAQ :items="faqItems" />

      <div class="mx-auto max-w-6xl px-6 py-10 lg:py-12">
        <RelatedContent type="tools" :tool-id="toolId" :limit="3" />
        <RelatedContent type="articles" :tool-id="toolId" :limit="5" />
      </div>
    </template>
  </ToolPageShell>
</template>
