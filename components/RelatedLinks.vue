<template>
  <section 
    class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8 transition-colors duration-300"
    aria-labelledby="related-links-title"
  >
    <h2 
      id="related-links-title"
      class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center"
    >
      <Icon name="heroicons:link" class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
      {{ title || $t('common.relatedLinks') }}
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="link in links"
        :key="link.path"
        :to="localePath(link.path)"
        class="group block p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        :aria-label="`访问 ${link.title}`"
      >
        <div class="flex items-start space-x-3">
          <Icon 
            :name="link.icon || 'heroicons:document-text'" 
            class="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" 
          />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {{ $t(link.title) }}
            </h3>
            <p 
              v-if="link.description" 
              class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2"
            >
              {{ $t(link.description) }}
            </p>
            <div 
              v-if="link.tags && link.tags.length > 0"
              class="flex flex-wrap gap-1 mt-2"
            >
              <span
                v-for="tag in link.tags.slice(0, 3)"
                :key="tag"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
              >
                {{ $t(`common.tags.${tag}`) }}
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
interface RelatedLink {
  title: string
  path: string
  description?: string
  icon?: string
  tags?: string[]
}

interface Props {
  links?: RelatedLink[]
  title?: string
  category?: 'tools' | 'blog' | 'pages'
}

const props = withDefaults(defineProps<Props>(), {
  links: () => [],
  title: '',
  category: 'tools'
})

const localePath = useLocalePath()
const route = useRoute()

// 预定义的相关链接
const predefinedLinks = {
  tools: [
    {
      title: 'common.relatedLinksContent.imageCompressor',
      path: '/image-compressor',
      description: 'common.relatedLinksContent.compressImagesOnline',
      icon: 'heroicons:photo',
      tags: ['imageCompression', 'optimization', 'tools']
    },
    {
      title: 'common.relatedLinksContent.formatConverter',
      path: '/image-format-converter',
      description: 'common.relatedLinksContent.convertImageFormats',
      icon: 'heroicons:arrow-path',
      tags: ['formatConversion', 'images', 'tools']
    },
    {
      title: 'common.relatedLinksContent.heicConverter',
      path: '/heic-converter',
      description: 'common.relatedLinksContent.convertHeicToJpg',
      icon: 'heroicons:device-phone-mobile',
      tags: ['heic', 'conversion', 'ios']
    }
  ],
  blog: [
    {
      title: 'common.relatedLinksContent.imageCompressionGuide',
      path: '/blog/imagecompression/image-compression-fundamentals',
      description: 'common.relatedLinksContent.learnCompressionTechniques',
      icon: 'heroicons:light-bulb',
      tags: ['imageCompression', 'guide', 'tutorials']
    },
    {
      title: 'common.relatedLinksContent.heicFormatExplained',
      path: '/blog/heicconverter/what-is-heic-format',
      description: 'common.relatedLinksContent.understandHeicFormat',
      icon: 'heroicons:book-open',
      tags: ['heic', 'guide', 'format']
    }
  ],
  pages: [
    {
      title: 'common.relatedLinksContent.aboutUs',
      path: '/about',
      description: 'common.relatedLinksContent.learnAboutTeam',
      icon: 'heroicons:information-circle',
      tags: ['about', 'team']
    },
    {
      title: 'common.relatedLinksContent.contact',
      path: '/contact',
      description: 'common.relatedLinksContent.getInTouch',
      icon: 'heroicons:envelope',
      tags: ['contact', 'support']
    },
    {
      title: 'common.relatedLinksContent.blog',
      path: '/blog',
      description: 'common.relatedLinksContent.readLatestArticles',
      icon: 'heroicons:newspaper',
      tags: ['blog', 'tutorials']
    }
  ]
}

// 智能生成相关链接
const links = computed(() => {
  if (props.links.length > 0) {
    return props.links
  }

  const currentPath = route.path
  let relatedLinks: RelatedLink[] = []

  // 根据当前页面类型推荐相关链接
  if (currentPath.includes('image-compressor')) {
    relatedLinks = [
      predefinedLinks.tools[1], // 格式转换
      predefinedLinks.tools[2], // HEIC转换
      ...predefinedLinks.blog
    ]
  } else if (currentPath.includes('image-format-converter')) {
    relatedLinks = [
      predefinedLinks.tools[0], // 图片压缩
      predefinedLinks.tools[2], // HEIC转换
      ...predefinedLinks.blog
    ]
  } else if (currentPath.includes('heic-converter')) {
    relatedLinks = [
      predefinedLinks.tools[0], // 图片压缩
      predefinedLinks.tools[1], // 格式转换
      predefinedLinks.blog[1]   // HEIC指南
    ]
  } else if (currentPath.includes('blog')) {
    relatedLinks = [
      ...predefinedLinks.tools,
      predefinedLinks.pages[0], // 关于
      predefinedLinks.pages[1]  // 联系
    ]
  } else if (currentPath.includes('about') || currentPath.includes('contact')) {
    relatedLinks = [
      ...predefinedLinks.tools,
      predefinedLinks.pages[2]  // 博客
    ]
  } else {
    // 首页或其他页面，显示所有工具
    relatedLinks = predefinedLinks.tools
  }

  // 过滤掉当前页面
  return relatedLinks.filter(link => !currentPath.includes(link.path.replace('/', '')))
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
