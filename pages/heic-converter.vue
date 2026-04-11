<script setup lang="ts">
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()

const toolId = 'heic-converter'

const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.imageTools'), path: '/image-tools' },
  { name: t('nav.heicConverter'), path: '/heic-converter' }
])

const heroBullets = computed(() => [
  { icon: 'heroicons:device-phone-mobile', label: t('heicConverter.features.onlineDescription') },
  { icon: 'heroicons:shield-check', label: t('home.features.privacy.description') },
  { icon: 'heroicons:queue-list', label: t('home.features.fast.description') }
])

const faqItems = computed(() => getToolFAQs(toolId, locale.value))

const howToSteps = computed<HowToStep[]>(() => [
  { name: t('heicConverter.howTo.step1.name'), text: t('heicConverter.howTo.step1.text') },
  { name: t('heicConverter.howTo.step2.name'), text: t('heicConverter.howTo.step2.text') },
  { name: t('heicConverter.howTo.step3.name'), text: t('heicConverter.howTo.step3.text') },
  { name: t('heicConverter.howTo.step4.name'), text: t('heicConverter.howTo.step4.text') }
])

const comparisons = computed(() => [
  { feature: t('heicConverter.comparison.privacy'), ourTool: true, competitor1: false, competitor2: false },
  { feature: t('heicConverter.comparison.batchProcessing'), ourTool: true, competitor1: true, competitor2: false },
  { feature: t('heicConverter.comparison.qualityControl'), ourTool: true, competitor1: false, competitor2: true },
  { feature: t('heicConverter.comparison.noRegistration'), ourTool: true, competitor1: false, competitor2: false },
  { feature: t('heicConverter.comparison.multiFormat'), ourTool: true, competitor1: true, competitor2: false }
])

const competitorNames = ['Convertio', 'CloudConvert']

const stats = {
  totalUsers: '80,000+',
  filesProcessed: '2,000,000+',
  avgRating: '4.9/5'
}

const { useToolPageMeta } = await import('~/composables/useToolPageMeta')
useToolPageMeta({
  toolName: t('heicConverter.hero.title'),
  toolDescription: t('heicConverter.hero.subtitle'),
  locale: locale.value as 'zh' | 'en'
})

const { useStructuredData } = await import('~/composables/useStructuredData')
const { useEnhancedStructuredData } = await import('~/composables/useEnhancedStructuredData')
const {
  getOrganizationSchema,
  getWebPageSchema,
  getSoftwareApplicationSchema,
  setStructuredData
} = useStructuredData()

const { getServiceSchema, setEnhancedStructuredData } = useEnhancedStructuredData()

setStructuredData([
  getOrganizationSchema(),
  getWebPageSchema({
    name: t('heicConverter.seo.title'),
    description: t('heicConverter.seo.description')
  }),
  getSoftwareApplicationSchema({
    name: t('heicConverter.seo.title'),
    description: t('heicConverter.seo.description'),
    category: 'Multimedia'
  })
])

setEnhancedStructuredData([
  getServiceSchema({
    name: t('heicConverter.seo.title'),
    description: t('heicConverter.seo.description'),
    rating: { value: '4.9', count: '1580' }
  })
])
</script>

<template>
  <ToolPageShell
    :breadcrumb-items="breadcrumbItems"
    :section-label="t('home.categories.imageTools.title')"
    :title="t('heicConverter.hero.title')"
    :description="t('heicConverter.hero.subtitle')"
    :bullets="heroBullets"
    :workspace-label="t('heicConverter.sections.toolTitle')"
  >
    <HeicConverter />

    <template #after-main>
      <ToolPageContent
        :tool-name="t('heicConverter.hero.title')"
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
