<script setup lang="ts">
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()

const toolId = 'qr-code-generator'

const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.imageTools'), path: '/image-tools' },
  { name: t('qrCodeGenerator.title'), path: '/qr-code-generator' }
])

const heroBullets = computed(() => [
  { icon: 'heroicons:paint-brush', label: t('qrCodeGenerator.features.customizable') },
  { icon: 'heroicons:shield-check', label: t('qrCodeGenerator.features.privacy') },
  { icon: 'heroicons:queue-list', label: t('qrCodeGenerator.comparison.batchProcessing') }
])

const faqItems = computed(() => getToolFAQs(toolId, locale.value))

const howToSteps = computed<HowToStep[]>(() => [
  { name: t('qrCodeGenerator.howTo.step1.name'), text: t('qrCodeGenerator.howTo.step1.text') },
  { name: t('qrCodeGenerator.howTo.step2.name'), text: t('qrCodeGenerator.howTo.step2.text') },
  { name: t('qrCodeGenerator.howTo.step3.name'), text: t('qrCodeGenerator.howTo.step3.text') },
  { name: t('qrCodeGenerator.howTo.step4.name'), text: t('qrCodeGenerator.howTo.step4.text') }
])

const { useToolPageMeta } = await import('~/composables/useToolPageMeta')
useToolPageMeta({
  toolName: t('qrCodeGenerator.hero.title'),
  toolDescription: t('qrCodeGenerator.hero.subtitle'),
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
    name: t('qrCodeGenerator.meta.title'),
    description: t('qrCodeGenerator.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('qrCodeGenerator.meta.title'),
    description: t('qrCodeGenerator.meta.description'),
    category: 'Multimedia'
  })
])

setEnhancedStructuredData([
  getServiceSchema({
    name: t('qrCodeGenerator.meta.title'),
    description: t('qrCodeGenerator.meta.description')
  })
])
</script>

<template>
  <ToolPageShell
    :breadcrumb-items="breadcrumbItems"
    :section-label="t('home.categories.imageTools.title')"
    :title="t('qrCodeGenerator.hero.title')"
    :description="t('qrCodeGenerator.hero.subtitle')"
    :bullets="heroBullets"
    :workspace-label="t('qrCodeGenerator.sections.toolTitle')"
  >
    <QRCodeGenerator />

    <template #after-main>
      <ToolPageContent
        :tool-name="t('qrCodeGenerator.hero.title')"
        :steps="howToSteps"
      />

      <FAQ :items="faqItems" />

      <div class="mx-auto max-w-6xl px-6 py-10 lg:py-12">
        <RelatedContent type="tools" :tool-id="toolId" :limit="3" />
        <RelatedContent type="articles" :tool-id="toolId" :limit="5" />
      </div>
    </template>
  </ToolPageShell>
</template>
