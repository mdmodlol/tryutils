<template>
  <img
    ref="imageRef"
    :src="currentSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :class="[
      'transition-opacity duration-300',
      isLoaded ? 'opacity-100' : 'opacity-0',
      imageClass
    ]"
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
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
})

const imageRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const hasError = ref(false)

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