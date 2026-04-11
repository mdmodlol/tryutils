<template>
  <!-- 跳转到主要内容的链接 -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-slate-950 text-white px-4 py-2 rounded-full dark:bg-slate-100 dark:text-slate-950 z-50">
    {{ $t('accessibility.skipToMain') }}
  </a>

  <div id="main-content" class="image-format-converter fade-in-up" itemscope itemtype="https://schema.org/SoftwareApplication" role="main">
    <!-- 文件上传区域 -->
    <section class="core-feature-section" role="region" aria-labelledby="upload-title">
      <div class="text-center mb-8">
         <h2 id="upload-title" class="section-title flex items-center justify-center gap-3 text-center" itemprop="name">
           <Icon name="heroicons:arrow-path" class="text-3xl" aria-hidden="true" />
           {{ $t('imageFormatConverter.title') }}
         </h2>
         <p class="section-subtitle text-center" itemprop="description">{{ $t('imageFormatConverter.subtitle') }}</p>
         <!-- 隐藏的结构化数据 -->
         <meta itemprop="applicationCategory" content="ImageFormatConverter">
         <meta itemprop="operatingSystem" content="Web Browser">
         <div itemprop="offers" itemscope itemtype="https://schema.org/Offer" style="display: none;">
           <meta itemprop="price" content="0">
           <meta itemprop="priceCurrency" content="USD">
         </div>
       </div>
      
      <!-- 使用 ClientOnly 包装交互组件 -->
      <ClientOnly>
        <!-- 拖拽上传区域 -->
        <div 
          class="enhanced-upload-zone"
          :class="{ 'drag-over': isDragging }"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver"
          @drop="handleDrop"
          role="button"
          tabindex="0"
          :aria-label="$t('imageFormatConverter.dragText')"
          @keydown.enter="fileInput?.click()"
          @keydown.space.prevent="fileInput?.click()"
        >
          <!-- 优化后的上传区域布局 - 减少高度 -->
          <div class="flex flex-col items-center justify-center space-y-4 py-6">
            <!-- 主图标区域 - 缩小尺寸 -->
            <div class="upload-icon-shell">
              <div class="upload-icon-core">
                <Icon name="heroicons:arrow-path" class="h-8 w-8 text-slate-700 dark:text-slate-200" aria-hidden="true" />
              </div>
            </div>
            
            <div class="text-center space-y-3 max-w-md">
              <!-- 主要提示文字 -->
              <div class="space-y-1">
                <p class="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {{ $t('imageFormatConverter.dragText') }}
                </p>
                <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {{ $t('imageFormatConverter.batchUploadText') }}
                </p>
              </div>
              
              <!-- 选择文件按钮 -->
              <div class="flex justify-center pt-2">
                <label class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white">
                  <div class="relative flex items-center gap-2 text-base">
                    <Icon name="heroicons:folder-open" class="w-5 h-5" aria-hidden="true" />
                    <span>{{ $t('imageFormatConverter.selectFile') }}</span>
                  </div>
                  <input 
                    ref="fileInput"
                    type="file" 
                    multiple 
                    accept="image/*"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    @change="handleFileSelect"
                    aria-describedby="file-support-info"
                  >
                </label>
              </div>
            </div>
            
            <!-- 支持信息 - 缩小尺寸 -->
            <div class="upload-support-pill">
              <Icon name="heroicons:shield-check" class="w-4 h-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />
              <p id="file-support-info" class="text-xs font-medium text-slate-600 dark:text-slate-300">
                {{ $t('imageFormatConverter.supportInfo') }}
              </p>
            </div>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="dragError" class="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg" role="alert" aria-live="polite" aria-atomic="true">
          <p class="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <Icon name="heroicons:exclamation-triangle" aria-hidden="true" />
            {{ dragError }}
          </p>
        </div>

        <template #fallback>
          <div class="text-center py-8" role="status" aria-live="polite">
            <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin mx-auto text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
          </div>
        </template>
      </ClientOnly>
    </section>

    <!-- 文件信息和格式选择 -->
    <section v-if="selectedFile" class="format-selection-section" role="region" aria-labelledby="format-title">
      <h3 id="format-title" class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <Icon name="heroicons:cog-6-tooth" class="text-slate-700 dark:text-slate-300" aria-hidden="true" />
        {{ $t('imageFormatConverter.formatSelection') }}
      </h3>

      <!-- 当前文件信息 -->
      <div class="file-info-card mb-6" role="region" aria-labelledby="file-info-title">
        <h4 id="file-info-title" class="sr-only">当前文件信息</h4>
        <div class="flex items-center gap-4">
          <div class="file-info-icon">
            <Icon name="heroicons:photo" class="w-8 h-8 text-slate-700 dark:text-slate-200" aria-hidden="true" />
          </div>
          <div class="flex-1">
            <h5 class="font-medium text-gray-900 dark:text-gray-100">{{ selectedFile.name }}</h5>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatFileSize(selectedFile.size) }} • {{ getFileFormat(selectedFile.name) }}
            </p>
          </div>
        </div>
      </div>

      <!-- 目标格式选择 -->
      <div class="mb-6" role="form" aria-labelledby="target-format-label">
        <label id="target-format-label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('imageFormatConverter.targetFormat') }}
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" role="radiogroup" aria-labelledby="target-format-label">
          <div 
            v-for="format in supportedFormats" 
            :key="format.value"
            class="format-option"
            :class="{ 'selected': conversionOptions.targetFormat === format.value }"
            @click="conversionOptions.targetFormat = format.value"
            role="radio"
            :aria-checked="conversionOptions.targetFormat === format.value"
            tabindex="0"
            @keydown.enter="conversionOptions.targetFormat = format.value"
            @keydown.space.prevent="conversionOptions.targetFormat = format.value"
          >
            <input 
              type="radio" 
              :id="format.value" 
              :value="format.value" 
              v-model="conversionOptions.targetFormat"
              class="sr-only"
            >
            <label :for="format.value" class="cursor-pointer block text-center p-3">
              <Icon :name="format.icon" class="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
              <span class="text-sm font-medium">{{ format.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 动态格式选项 -->
      <div v-if="showFormatOptions" class="format-options-section" role="region" aria-labelledby="format-options-title">
        <h4 id="format-options-title" class="text-lg font-medium mb-4 flex items-center gap-2">
          <Icon name="heroicons:adjustments-horizontal" class="text-slate-700 dark:text-slate-300" aria-hidden="true" />
          {{ $t('imageFormatConverter.formatOptions') }}
        </h4>

        <!-- JPEG/WebP 质量选项 -->
        <div v-if="showQualityOption" class="option-group" role="group" aria-labelledby="quality-label">
          <label id="quality-label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('imageFormatConverter.quality') }}: {{ conversionOptions.quality }}%
          </label>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('imageFormatConverter.low') }}</span>
            <input 
              type="range" 
              min="1" 
              max="100" 
              v-model="conversionOptions.quality"
              class="flex-1 quality-slider"
              :aria-label="$t('imageFormatConverter.quality')"
              aria-describedby="quality-description"
            >
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('imageFormatConverter.high') }}</span>
          </div>
          <p id="quality-description" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('imageFormatConverter.qualityDescription') }}</p>
        </div>

        <!-- PNG 压缩级别选项 -->
        <div v-if="showCompressionLevelOption" class="option-group" role="group" aria-labelledby="compression-label">
          <label id="compression-label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('imageFormatConverter.compressionLevel') }}: {{ conversionOptions.compressionLevel }}
          </label>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('imageFormatConverter.fast') }}</span>
            <input 
              type="range" 
              min="0" 
              max="9" 
              v-model="conversionOptions.compressionLevel"
              class="flex-1 compression-slider"
              :aria-label="$t('imageFormatConverter.compressionLevel')"
              aria-describedby="compression-description"
            >
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('imageFormatConverter.best') }}</span>
          </div>
          <p id="compression-description" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('imageFormatConverter.compressionDescription') }}</p>
        </div>

        <!-- AVIF 速度选项 -->
        <div v-if="showSpeedOption" class="option-group" role="group" aria-labelledby="speed-label">
          <label id="speed-label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('imageFormatConverter.speed') }}: {{ conversionOptions.speed }}
          </label>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('imageFormatConverter.slow') }}</span>
            <input 
              type="range" 
              min="0" 
              max="8" 
              v-model="conversionOptions.speed"
              class="flex-1 speed-slider"
              :aria-label="$t('imageFormatConverter.speed')"
              aria-describedby="speed-description"
            >
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('imageFormatConverter.fast') }}</span>
          </div>
          <p id="speed-description" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('imageFormatConverter.speedDescription') }}</p>
        </div>
      </div>

      <!-- 转换按钮 -->
      <div class="text-center mt-8">
        <button 
          @click="convertFormat"
          :disabled="isConverting || !conversionOptions.targetFormat"
          class="convert-button"
          :aria-label="isConverting ? $t('imageFormatConverter.converting') : $t('imageFormatConverter.convert')"
        >
          <Icon 
            :name="isConverting ? 'heroicons:arrow-path' : 'heroicons:arrow-right'" 
            :class="{ 'animate-spin': isConverting }"
            class="w-5 h-5 mr-2" 
            aria-hidden="true"
          />
          {{ isConverting ? $t('imageFormatConverter.converting') : $t('imageFormatConverter.convert') }}
        </button>
      </div>
    </section>

    <!-- 转换进度 -->
    <section v-if="isConverting" class="progress-section" role="region" aria-labelledby="progress-title">
      <h3 id="progress-title" class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('imageFormatConverter.progress') }}</h3>
      <div class="enhanced-progress" role="progressbar" :aria-valuenow="conversionProgress" aria-valuemin="0" aria-valuemax="100" :aria-label="$t('accessibility.conversionProgressAriaLabel', { progress: conversionProgress })">
        <div class="enhanced-progress-fill" :style="{ width: `${conversionProgress}%` }"></div>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center" role="status" aria-live="polite">{{ conversionProgress }}%</p>
    </section>

    <!-- 转换结果 -->
    <section v-if="conversionResult" class="results-section" role="region" aria-labelledby="results-title">
      <h3 id="results-title" class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <Icon name="heroicons:check-circle" class="text-green-600 dark:text-green-400" aria-hidden="true" />
        {{ $t('imageFormatConverter.conversionComplete') }}
      </h3>

      <div class="result-card">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="result-icon-shell">
              <Icon name="heroicons:check" class="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ conversionResult.filename }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ conversionResult.details }}</p>
            </div>
          </div>
          <button @click="downloadResult" class="download-button" :aria-label="$t('accessibility.downloadFileAriaLabel', { filename: conversionResult.filename })">
            <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-2" aria-hidden="true" />
            {{ $t('imageFormatConverter.download') }}
          </button>
        </div>

        <!-- 转换统计 -->
        <div class="conversion-stats" role="list" :aria-label="$t('accessibility.conversionStats')">
          <div class="stat-item" role="listitem">
            <span class="stat-label">{{ $t('imageFormatConverter.originalFormat') }}</span>
            <span class="stat-value">{{ conversionResult.originalFormat?.toUpperCase() }}</span>
          </div>
          <div class="stat-item" role="listitem">
            <span class="stat-label">{{ $t('imageFormatConverter.newFormat') }}</span>
            <span class="stat-value">{{ conversionResult.processedFormat?.toUpperCase() }}</span>
          </div>
          <div class="stat-item" role="listitem">
            <span class="stat-label">{{ $t('imageFormatConverter.originalSize') }}</span>
            <span class="stat-value">{{ formatFileSize(conversionResult.originalSize) }}</span>
          </div>
          <div class="stat-item" role="listitem">
            <span class="stat-label">{{ $t('imageFormatConverter.newSize') }}</span>
            <span class="stat-value">{{ formatFileSize(conversionResult.processedSize) }}</span>
          </div>
          <div class="stat-item" role="listitem">
            <span class="stat-label">{{ $t('imageFormatConverter.sizeChange') }}</span>
            <span class="stat-value" :class="getSizeChangeClass()">
              {{ getSizeChangeText() }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface ConversionOptions {
  targetFormat: string
  quality: number
  compressionLevel: number
  speed: number
}

interface ConversionResult {
  filename: string
  details: string
  originalFormat: string
  processedFormat: string
  originalSize: number
  processedSize: number
  sizeReduction: string
  sizeIncrease: string
  blob: Blob
}

// 响应式数据
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const dragError = ref<string | null>(null)
const isConverting = ref(false)
const conversionProgress = ref(0)
const conversionResult = ref<ConversionResult | null>(null)
const fileInput = ref<HTMLInputElement>()

// 转换选项
const conversionOptions = ref<ConversionOptions>({
  targetFormat: 'jpeg',
  quality: 80,
  compressionLevel: 6,
  speed: 4
})

// 支持的格式
const supportedFormats = [
  { value: 'jpeg', label: 'JPEG', icon: 'heroicons:photo' },
  { value: 'png', label: 'PNG', icon: 'heroicons:photo' },
  { value: 'webp', label: 'WebP', icon: 'heroicons:photo' },
  { value: 'gif', label: 'GIF', icon: 'heroicons:gif' },
  { value: 'avif', label: 'AVIF', icon: 'heroicons:photo' },
  { value: 'tiff', label: 'TIFF', icon: 'heroicons:photo' }
]

// 计算属性
const showFormatOptions = computed(() => {
  return conversionOptions.value.targetFormat && selectedFile.value
})

const showQualityOption = computed(() => {
  return ['jpeg', 'webp', 'avif', 'tiff'].includes(conversionOptions.value.targetFormat)
})

const showCompressionLevelOption = computed(() => {
  return conversionOptions.value.targetFormat === 'png'
})

const showSpeedOption = computed(() => {
  return conversionOptions.value.targetFormat === 'avif'
})

// 拖拽处理
const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
  dragError.value = null
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  if (!e.relatedTarget || !e.currentTarget?.contains(e.relatedTarget as Node)) {
    isDragging.value = false
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length === 0) {
    dragError.value = $t('imageFormatConverter.errors.selectImageFile')
    return
  }
  
  if (files.length > 1) {
    dragError.value = $t('imageFormatConverter.errors.singleFileOnly')
    return
  }
  
  const file = files[0]
  if (!file.type.startsWith('image/')) {
    dragError.value = $t('imageFormatConverter.errors.validImageFile')
    return
  }
  
  selectedFile.value = file
  dragError.value = null
  conversionResult.value = null
}

// 文件选择处理
const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return
  
  const file = files[0]
  if (!file.type.startsWith('image/')) {
    dragError.value = $t('imageFormatConverter.errors.validImageFile')
    return
  }
  
  selectedFile.value = file
  dragError.value = null
  conversionResult.value = null
}

// 工具函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileFormat = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? ext.toUpperCase() : 'Unknown'
}

const getSizeChangeClass = () => {
  if (!conversionResult.value) return ''
  const originalSize = conversionResult.value.originalSize
  const processedSize = conversionResult.value.processedSize
  
  if (processedSize < originalSize) {
    return 'text-green-600'
  } else if (processedSize > originalSize) {
    return 'text-orange-600'
  }
  return 'text-gray-600'
}

const getSizeChangeText = () => {
  if (!conversionResult.value) return ''
  const originalSize = conversionResult.value.originalSize
  const processedSize = conversionResult.value.processedSize
  
  if (processedSize < originalSize) {
    const reduction = ((originalSize - processedSize) / originalSize * 100).toFixed(1)
    return `-${reduction}%`
  } else if (processedSize > originalSize) {
    const increase = ((processedSize - originalSize) / originalSize * 100).toFixed(1)
    return `+${increase}%`
  }
  return '0%'
}

// 格式转换
const convertFormat = async () => {
  if (!selectedFile.value || !conversionOptions.value.targetFormat) return
  
  isConverting.value = true
  conversionProgress.value = 0
  conversionResult.value = null
  
  try {
    // 创建FormData
    const formData = new FormData()
    formData.append('image', selectedFile.value)
    formData.append('targetFormat', conversionOptions.value.targetFormat)
    formData.append('quality', conversionOptions.value.quality.toString())
    formData.append('compressionLevel', conversionOptions.value.compressionLevel.toString())
    formData.append('speed', conversionOptions.value.speed.toString())
    formData.append('originalFilename', selectedFile.value.name.split('.')[0])
    
    // 模拟进度
    const progressInterval = setInterval(() => {
      if (conversionProgress.value < 90) {
        conversionProgress.value += Math.random() * 20
      }
    }, 200)
    
    // 调用API - 使用fetch而不是$fetch来获取响应头
    const response = await fetch('/api/convert-format', {
      method: 'POST',
      body: formData
    })
    
    clearInterval(progressInterval)
    conversionProgress.value = 100
    
    if (!response.ok) {
      throw new Error($t('imageFormatConverter.errors.apiRequestFailed', { status: response.status, statusText: response.statusText }))
    }
    
    // 获取响应头信息
    const originalFormat = response.headers.get('x-original-format') || 'unknown'
    const processedFormat = response.headers.get('x-processed-format') || conversionOptions.value.targetFormat
    const originalSize = parseInt(response.headers.get('x-original-size') || '0')
    const processedSize = parseInt(response.headers.get('x-processed-size') || '0')
    const sizeReduction = response.headers.get('x-size-reduction') || '0'
    const sizeIncrease = response.headers.get('x-size-increase') || '0'
    
    // 获取响应数据
    const responseData = await response.arrayBuffer()
    
    // 创建结果对象
    const blob = new Blob([responseData], { type: `image/${processedFormat}` })
    const filename = `${selectedFile.value.name.split('.')[0]}_converted.${processedFormat}`
    
    conversionResult.value = {
      filename,
      details: $t('imageFormatConverter.conversionSuccess', { 
        originalFormat: originalFormat.toUpperCase(), 
        originalSize: formatFileSize(originalSize),
        processedFormat: processedFormat.toUpperCase(),
        processedSize: formatFileSize(processedSize)
      }),
      originalFormat,
      processedFormat,
      originalSize,
      processedSize,
      sizeReduction,
      sizeIncrease,
      blob
    }
    
  } catch (error: any) {
    console.error('Format conversion error:', error)
    dragError.value = error.message || $t('imageFormatConverter.errors.conversionFailed')
  } finally {
    isConverting.value = false
  }
}

// 下载结果
const downloadResult = () => {
  if (!conversionResult.value) return
  
  const url = URL.createObjectURL(conversionResult.value.blob)
  const a = document.createElement('a')
  a.href = url
  a.download = conversionResult.value.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 监听文件变化，重置结果
watch(selectedFile, () => {
  conversionResult.value = null
  dragError.value = null
})

// 监听格式变化，重置结果
watch(() => conversionOptions.value.targetFormat, () => {
  conversionResult.value = null
})
</script>

<!-- 非 scoped 样式 - 用于深色模式支持 -->
<style>
:root.dark .image-format-converter .core-feature-section,
:root.dark .image-format-converter .format-selection-section,
:root.dark .image-format-converter .format-options-section,
:root.dark .image-format-converter .progress-section,
:root.dark .image-format-converter .results-section {
  border-color: #1e293b;
  background: rgba(2, 6, 23, 0.82);
}

:root.dark .image-format-converter .enhanced-upload-zone {
  background: rgba(15, 23, 42, 0.78);
  border-color: #334155;
}

:root.dark .image-format-converter .enhanced-upload-zone:hover,
:root.dark .image-format-converter .enhanced-upload-zone.drag-over,
:root.dark .image-format-converter .format-option.selected {
  border-color: #2dd4bf;
  background: rgba(15, 23, 42, 0.92);
}

:root.dark .image-format-converter .file-info-card,
:root.dark .image-format-converter .result-card,
:root.dark .image-format-converter .stat-item,
:root.dark .image-format-converter .format-option,
:root.dark .image-format-converter .file-info-icon,
:root.dark .image-format-converter .result-icon-shell,
:root.dark .image-format-converter .upload-icon-core {
  background: rgba(15, 23, 42, 0.75);
  border-color: #1e293b;
}
</style>

<style scoped>
.image-format-converter {
  @apply mx-auto max-w-6xl px-4 py-8;
}

.core-feature-section,
.format-selection-section,
.progress-section,
.results-section {
  @apply mb-10 rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none;
}

.section-title {
  @apply mb-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50;
}

.section-subtitle {
  @apply mb-6 text-lg font-medium text-slate-600 dark:text-slate-300;
}

.enhanced-upload-zone {
  @apply rounded-[28px] border-2 border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 transition-all duration-200 dark:border-slate-700 dark:bg-slate-950/60;
}

.enhanced-upload-zone:hover,
.enhanced-upload-zone.drag-over {
  @apply border-teal-400 bg-white dark:border-teal-400 dark:bg-slate-950;
}

.upload-icon-shell {
  @apply flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900;
}

.upload-icon-core,
.file-info-icon,
.result-icon-shell {
  @apply flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800;
}

.upload-icon-core {
  @apply h-16 w-16 rounded-full;
}

.file-info-icon {
  @apply h-16 w-16;
}

.result-icon-shell {
  @apply h-12 w-12;
}

.upload-support-pill,
.file-info-card,
.format-options-section,
.result-card,
.stat-item {
  @apply rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70;
}

.format-option {
  @apply rounded-[18px] border border-slate-200 bg-white transition-all duration-200 cursor-pointer dark:border-slate-800 dark:bg-slate-950/70;
}

.format-option:hover,
.format-option.selected {
  @apply border-teal-400 bg-slate-50 dark:bg-slate-900;
}

.quality-slider,
.compression-slider,
.speed-slider {
  @apply appearance-none h-2 rounded-lg bg-slate-200 outline-none dark:bg-slate-800;
}

.quality-slider::-webkit-slider-thumb,
.compression-slider::-webkit-slider-thumb,
.speed-slider::-webkit-slider-thumb {
  @apply appearance-none h-5 w-5 cursor-pointer rounded-full bg-slate-950 dark:bg-slate-100;
}

.convert-button,
.download-button {
  @apply inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white;
}

.convert-button {
  @apply px-8 py-4 text-base;
}

.convert-button:disabled,
.download-button:disabled {
  @apply cursor-not-allowed opacity-50;
}

.enhanced-progress {
  @apply h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800;
}

.enhanced-progress-fill {
  @apply h-full rounded-full bg-teal-600 transition-all duration-500 dark:bg-teal-400;
}

.conversion-stats {
  @apply mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5;
}

.stat-label {
  @apply block text-xs text-slate-500 dark:text-slate-400;
}

.stat-value {
  @apply block text-sm font-semibold text-slate-900 dark:text-slate-100;
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .image-format-converter {
    @apply px-2 py-4;
  }

  .core-feature-section,
  .format-selection-section,
  .progress-section,
  .results-section {
    @apply mb-6 p-4;
  }

  .section-title {
    @apply text-2xl;
  }

  .convert-button {
    @apply px-6 py-3 text-base;
  }

  .conversion-stats {
    @apply grid-cols-1;
  }
}
</style>