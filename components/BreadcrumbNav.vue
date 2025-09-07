<template>
  <nav aria-label="Breadcrumb" class="breadcrumb-nav" v-if="breadcrumbs.length > 1">
    <ol class="flex items-center space-x-2 text-sm text-gray-600" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li 
        v-for="(item, index) in breadcrumbs" 
        :key="item.url"
        class="flex items-center"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <!-- 分隔符 -->
        <Icon 
          v-if="index > 0" 
          name="heroicons:chevron-right" 
          class="w-4 h-4 text-gray-400 mx-2" 
          aria-hidden="true" 
        />
        
        <!-- 面包屑项目 -->
        <div class="flex items-center">
          <NuxtLink 
            v-if="!item.current"
            :to="localePath(item.url)"
            class="hover:text-blue-600 transition-colors duration-200"
            itemprop="item"
          >
            <span itemprop="name">{{ item.name }}</span>
          </NuxtLink>
          
          <span 
            v-else
            class="text-gray-900 font-medium"
            itemprop="name"
            aria-current="page"
          >
            {{ item.name }}
          </span>
          
          <!-- 隐藏的结构化数据 -->
          <meta itemprop="position" :content="index + 1">
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  name: string
  url: string
  current?: boolean
}

interface Props {
  items?: BreadcrumbItem[]
}

const props = defineProps<Props>()
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

// 自动生成面包屑导航
const breadcrumbs = computed(() => {
  if (props.items) {
    return props.items
  }
  
  const pathSegments = route.path.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  // 添加首页
  breadcrumbs.push({
    name: t('nav.home'),
    url: '/',
    current: route.path === '/' || route.path === '/zh'
  })
  
  // 处理路径段
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    // 跳过语言代码
    if (segment === 'zh' || segment === 'en') {
      return
    }
    
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    
    // 获取页面名称
    let name = segment
    switch (segment) {
      case 'blog':
        name = t('nav.blog')
        break
      case 'about':
        name = t('nav.about')
        break
      case 'contact':
        name = t('nav.contact')
        break
      case 'privacy':
        name = t('nav.privacy') || 'Privacy Policy'
        break
      default:
        // 对于博客文章等动态路由，使用段名称
        name = segment.charAt(0).toUpperCase() + segment.slice(1)
    }
    
    breadcrumbs.push({
      name,
      url: currentPath,
      current: isLast
    })
  })
  
  return breadcrumbs
})
</script>

<style scoped>
.breadcrumb-nav {
  @apply mb-6 px-6;
}

@media (max-width: 640px) {
  .breadcrumb-nav {
    @apply px-4;
  }
}
</style>