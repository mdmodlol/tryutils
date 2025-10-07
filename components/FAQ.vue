<template>
  <section 
    class="py-16 px-6 bg-gray-50"
    aria-labelledby="faq-title"
  >
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 
          id="faq-title"
          class="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          {{ t('faq.title') }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ t('faq.subtitle') }}
        </p>
      </div>

      <div class="space-y-4" role="list">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          role="listitem"
        >
          <button
            :id="`faq-button-${index}`"
            :aria-expanded="openIndex === index"
            :aria-controls="`faq-content-${index}`"
            class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
            @click="toggleFAQ(index)"
          >
            <h3 class="text-lg font-semibold text-gray-900 pr-4">
              {{ faq.question }}
            </h3>
            <Icon 
              :name="openIndex === index ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
              class="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200"
              :class="{ 'transform rotate-180': openIndex === index }"
            />
          </button>
          
          <div
            :id="`faq-content-${index}`"
            :aria-labelledby="`faq-button-${index}`"
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
            role="region"
          >
            <div class="px-6 pb-4">
              <div 
                class="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                v-html="faq.answer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface FAQ {
  question: string
  answer: string
}

interface Props {
  category?: 'general' | 'image-tools' | 'privacy'
}

const props = withDefaults(defineProps<Props>(), {
  category: 'general'
})

const { t } = useI18n()
const openIndex = ref<number | null>(null)

// 根据分类获取FAQ数据
const faqs = computed(() => {
  const faqData = {
    general: [
      {
        question: t('faq.general.q1'),
        answer: t('faq.general.a1')
      },
      {
        question: t('faq.general.q2'),
        answer: t('faq.general.a2')
      },
      {
        question: t('faq.general.q3'),
        answer: t('faq.general.a3')
      },
      {
        question: t('faq.general.q4'),
        answer: t('faq.general.a4')
      }
    ],
    'image-tools': [
      {
        question: t('faq.imageTools.q1'),
        answer: t('faq.imageTools.a1')
      },
      {
        question: t('faq.imageTools.q2'),
        answer: t('faq.imageTools.a2')
      },
      {
        question: t('faq.imageTools.q3'),
        answer: t('faq.imageTools.a3')
      },
      {
        question: t('faq.imageTools.q4'),
        answer: t('faq.imageTools.a4')
      },
      {
        question: t('faq.imageTools.q5'),
        answer: t('faq.imageTools.a5')
      }
    ],
    privacy: [
      {
        question: t('faq.privacy.q1'),
        answer: t('faq.privacy.a1')
      },
      {
        question: t('faq.privacy.q2'),
        answer: t('faq.privacy.a2')
      },
      {
        question: t('faq.privacy.q3'),
        answer: t('faq.privacy.a3')
      }
    ]
  }
  
  return faqData[props.category] || faqData.general
})

const toggleFAQ = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

// 键盘导航支持
const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleFAQ(index)
  }
}

// 设置FAQ结构化数据
const { useEnhancedStructuredData } = await import('~/composables/useEnhancedStructuredData')
const { getFAQPageSchema, setEnhancedStructuredData } = useEnhancedStructuredData()

// 创建FAQ结构化数据
const faqSchema = getFAQPageSchema(faqs.value)
setEnhancedStructuredData([faqSchema])
</script>

<style scoped>
.prose h4 {
  @apply text-base font-semibold text-gray-900 mt-4 mb-2;
}

.prose p {
  @apply mb-3;
}

.prose ul {
  @apply list-disc list-inside space-y-1;
}

.prose li {
  @apply text-gray-700;
}

.prose strong {
  @apply font-semibold text-gray-900;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 underline;
}
</style>