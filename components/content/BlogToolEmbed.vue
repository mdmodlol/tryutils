<template>
  <div 
    class="blog-tool-embed my-8 rounded-xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden"
    :class="{ 'compact-mode': compact }"
  >
    <!-- Tool Header -->
    <div class="tool-header bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon :name="toolIcon" class="text-2xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ toolTitle }}</h3>
      </div>
      <span class="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
        🎯 {{ $t('seo.tryOnline') }}
      </span>
    </div>

    <!-- Tool Container with Lazy Loading -->
    <div class="tool-container p-6">
      <!-- Placeholder/Skeleton UI before loading -->
      <div 
        v-if="!isVisible && !isLoaded" 
        ref="placeholderRef"
        class="tool-placeholder"
        data-testid="tool-placeholder"
      >
        <div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg flex flex-col items-center justify-center gap-4">
          <Icon :name="toolIcon" class="text-4xl text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <span class="text-gray-500 dark:text-gray-400">{{ $t('seo.clickToLoad') }}</span>
        </div>
        <div class="mt-4 text-center">
          <button 
            class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-95"
            data-testid="load-tool-button"
            @click="loadTool"
          >
            <Icon name="heroicons:play" class="w-5 h-5" aria-hidden="true" />
            {{ $t('seo.tryOnline') }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="tool-loading">
        <div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg flex items-center justify-center">
          <Icon name="heroicons:arrow-path" class="text-4xl text-blue-500 animate-spin" aria-hidden="true" />
        </div>
      </div>

      <!-- Actual Tool Component (Lazy Loaded) -->
      <ClientOnly v-else>
        <Suspense>
          <template #default>
            <component :is="toolComponent" :compact="compact" />
          </template>
          <template #fallback>
            <div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:arrow-path" class="text-4xl text-blue-500 animate-spin" aria-hidden="true" />
            </div>
          </template>
        </Suspense>
      </ClientOnly>
    </div>

    <!-- CTA Section -->
    <div 
      v-if="showCta && (isVisible || isLoaded)" 
      class="tool-cta bg-gray-50 dark:bg-gray-800/50 px-6 py-4 text-center border-t border-gray-200 dark:border-gray-700"
    >
      <NuxtLink 
        :to="localePath(toolPagePath)"
        class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
      >
        <slot>{{ $t('seo.viewFullFeatures') }}</slot>
        <Icon name="heroicons:arrow-right" class="w-4 h-4" aria-hidden="true" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
/**
 * BlogToolEmbed MDC Component
 * Embeds interactive tool components within blog articles with lazy loading
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { getToolById } from '~/data/toolConfig'

const props = defineProps({
  tool: {
    type: String,
    required: true
  },
  compact: {
    type: Boolean,
    default: true
  },
  showCta: {
    type: Boolean,
    default: true
  }
})

const { locale } = useI18n()
const localePath = useLocalePath()

// State for lazy loading
const isVisible = ref(false)
const isLoaded = ref(false)
const isLoading = ref(false)
const placeholderRef = ref(null)

// Intersection Observer for visibility detection
let observer = null

// Get tool configuration
const toolConfig = computed(() => getToolById(props.tool))

// Tool metadata
const toolTitle = computed(() => {
  if (!toolConfig.value) return props.tool
  return toolConfig.value.name[locale.value] || toolConfig.value.name.en || props.tool
})

const toolIcon = computed(() => {
  return toolConfig.value?.icon || 'heroicons:wrench'
})

const toolPagePath = computed(() => {
  return toolConfig.value?.path || `/${props.tool}`
})

// Dynamic component loading
const toolComponent = computed(() => {
  if (!isVisible.value && !isLoaded.value) return null
  
  switch (props.tool) {
    case 'image-compressor':
      return defineAsyncComponent(() => import('~/components/ImageCompressor.vue'))
    case 'heic-converter':
      return defineAsyncComponent(() => import('~/components/HeicConverter.vue'))
    case 'image-format-converter':
      return defineAsyncComponent(() => import('~/components/ImageFormatConverter.vue'))
    default:
      return null
  }
})

// Manual load trigger
const loadTool = () => {
  isLoading.value = true
  isLoaded.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

// Setup Intersection Observer for lazy loading
onMounted(() => {
  if (typeof window === 'undefined' || !placeholderRef.value) return
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          isLoading.value = true
          setTimeout(() => {
            isLoading.value = false
          }, 300)
          if (observer && placeholderRef.value) {
            observer.unobserve(placeholderRef.value)
          }
        }
      })
    },
    { threshold: 0.1 }
  )
  
  if (placeholderRef.value) {
    observer.observe(placeholderRef.value)
  }
})

// Cleanup observer on unmount
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<style scoped>
.blog-tool-embed {
  transition: all 0.3s ease;
}

.blog-tool-embed:hover {
  box-shadow: 0 10px 40px -10px rgba(59, 130, 246, 0.3);
}

.compact-mode .tool-container {
  max-height: 500px;
  overflow-y: auto;
}

.tool-placeholder {
  min-height: 200px;
}

:root.dark .blog-tool-embed {
  border-color: #1e40af;
}

:root.dark .blog-tool-embed:hover {
  box-shadow: 0 10px 40px -10px rgba(59, 130, 246, 0.2);
}
</style>
