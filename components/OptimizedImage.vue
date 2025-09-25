<template>
  <figure v-if="showFigure" :class="figureClass">
    <img
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :sizes="sizes"
      :srcset="srcset"
      :class="[
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        imageClass
      ]"
      :aria-describedby="caption ? `${imageId}-caption` : undefined"
      :role="decorative ? 'presentation' : undefined"
      @load="handleLoad"
      @error="handleError"
    />
    <figcaption 
      v-if="caption" 
      :id="`${imageId}-caption`"
      class="mt-2 text-sm text-gray-600 text-center"
    >
      {{ caption }}
    </figcaption>
  </figure>
  <img
    v-else
    ref="imageRef"
    :src="currentSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :sizes="sizes"
    :srcset="srcset"
    :class="[
      'transition-opacity duration-300',
      isLoaded ? 'opacity-100' : 'opacity-0',
      imageClass
    ]"
    :role="decorative ? 'presentation' : undefined"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  placeholder?: string
  loading?: 'lazy' | 'eager'
  sizes?: string
  srcset?: string
  class?: string
  caption?: string
  figureClass?: string
  decorative?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  decorative: false
})

const imageRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const hasError = ref(false)

// 生成唯一ID用于无障碍性关联
const imageId = computed(() => `image-${Math.random().toString(36).substr(2, 9)}`)

// 是否显示figure元素
const showFigure = computed(() => !!props.caption)

// 当前显示的图片源
const currentSrc = computed(() => {
  if (hasError.value) {
    return props.placeholder
  }
  return props.src
})

// 图片类名
const imageClass = computed(() => {
  return props.class || ''
})

// 处理图片加载完成
const handleLoad = () => {
  isLoaded.value = true
  hasError.value = false
}

// 处理图片加载错误
const handleError = () => {
  hasError.value = true
  isLoaded.value = true
}

// 预加载图片（用于关键图片）
const preloadImage = () => {
  if (props.loading === 'eager') {
    const img = new Image()
    img.onload = handleLoad
    img.onerror = handleError
    img.src = props.src
  }
}

onMounted(() => {
  preloadImage()
})
</script>