<script setup lang="ts">
/**
 * BreadcrumbNav Component
 * Renders breadcrumb navigation with structured data support
 * 
 * @see Requirements 3.2 - HowTo structured data and navigation
 * **Feature: seo-optimization, Property 16: BreadcrumbList structured data format**
 */
import { useBreadcrumbSchema, type BreadcrumbItem } from '~/composables/useBreadcrumbSchema'

interface Props {
  items: BreadcrumbItem[]
  generateSchema?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  generateSchema: true
})

const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()

// Get base URL for schema generation
const baseUrl = computed(() => {
  return runtimeConfig.public?.siteUrl || ''
})

// Generate structured data if enabled
if (props.generateSchema && props.items.length > 0) {
  useBreadcrumbSchema(props.items, baseUrl.value)
}
</script>

<template>
  <nav 
    aria-label="Breadcrumb" 
    class="text-sm text-gray-500 dark:text-gray-400 mb-4"
  >
    <ol 
      class="flex flex-wrap items-center gap-1"
      role="list"
    >
      <li 
        v-for="(item, index) in items" 
        :key="item.path" 
        class="flex items-center"
      >
        <!-- Link for non-last items -->
        <NuxtLink 
          v-if="index < items.length - 1"
          :to="localePath(item.path)"
          class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {{ item.name }}
        </NuxtLink>
        
        <!-- Current page (last item) - not a link -->
        <span 
          v-else 
          class="text-gray-900 dark:text-gray-100 font-medium"
          aria-current="page"
        >
          {{ item.name }}
        </span>
        
        <!-- Separator (not for last item) -->
        <Icon 
          v-if="index < items.length - 1" 
          name="heroicons:chevron-right" 
          class="mx-2 w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" 
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>
