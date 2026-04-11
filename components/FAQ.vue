<template>
  <section class="bg-slate-50/80 py-16 transition-colors duration-300 dark:bg-slate-950/60" aria-labelledby="faq-title">
    <div class="mx-auto max-w-4xl px-6">
      <div class="mb-10 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
          {{ t('faq.sectionLabel') }}
        </p>
        <h2 id="faq-title" class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
          {{ t('faq.title') }}
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          {{ t('faq.subtitle') }}
        </p>
      </div>

      <div class="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
        <div class="divide-y divide-slate-200/80 dark:divide-slate-800" role="list">
          <div v-for="(faq, index) in displayFaqs" :key="index" class="px-6" role="listitem">
            <button
              :id="`faq-button-${index}`"
              :aria-expanded="openIndex === index ? 'true' : 'false'"
              :aria-controls="`faq-content-${index}`"
              class="flex w-full items-center justify-between gap-6 py-5 text-left"
              @click="toggleFAQ(index)"
            >
              <h3 class="text-base font-semibold leading-7 text-slate-950 dark:text-slate-50">
                {{ faq.question }}
              </h3>
              <Icon
                :name="openIndex === index ? 'heroicons:minus-small' : 'heroicons:plus-small'"
                class="h-6 w-6 flex-none text-slate-500 dark:text-slate-400"
                aria-hidden="true"
              />
            </button>

            <div
              :id="`faq-content-${index}`"
              :aria-labelledby="`faq-button-${index}`"
              :hidden="openIndex !== index"
              class="pb-5"
              role="region"
            >
              <div class="prose prose-slate max-w-none text-sm leading-7 dark:prose-invert" v-html="faq.answer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useFAQSchema, type FAQItem } from '~/composables/useFAQSchema'

interface Props {
  category?: 'general' | 'image-tools' | 'privacy'
  items?: FAQItem[]
  generateSchema?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  category: 'general',
  items: undefined,
  generateSchema: true
})

const { t } = useI18n()
const openIndex = ref<number | null>(0)

const categoryFaqs = computed(() => {
  const faqData = {
    general: [
      { question: t('faq.general.q1'), answer: t('faq.general.a1') },
      { question: t('faq.general.q2'), answer: t('faq.general.a2') },
      { question: t('faq.general.q3'), answer: t('faq.general.a3') },
      { question: t('faq.general.q4'), answer: t('faq.general.a4') }
    ],
    'image-tools': [
      { question: t('faq.imageTools.q1'), answer: t('faq.imageTools.a1') },
      { question: t('faq.imageTools.q2'), answer: t('faq.imageTools.a2') },
      { question: t('faq.imageTools.q3'), answer: t('faq.imageTools.a3') },
      { question: t('faq.imageTools.q4'), answer: t('faq.imageTools.a4') },
      { question: t('faq.imageTools.q5'), answer: t('faq.imageTools.a5') }
    ],
    privacy: [
      { question: t('faq.privacy.q1'), answer: t('faq.privacy.a1') },
      { question: t('faq.privacy.q2'), answer: t('faq.privacy.a2') },
      { question: t('faq.privacy.q3'), answer: t('faq.privacy.a3') }
    ]
  }

  return faqData[props.category] || faqData.general
})

const displayFaqs = computed<FAQItem[]>(() => props.items || categoryFaqs.value)

const toggleFAQ = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

if (props.generateSchema) {
  useFAQSchema(displayFaqs)
}
</script>
