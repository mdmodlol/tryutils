<template>
  <div class="image-format-converter fade-in-up" itemscope itemtype="https://schema.org/SoftwareApplication">
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
          class="enhanced-upload-zone group"
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
          <!-- 优化后的上传区域布局 -->
          <div class="flex flex-col items-center justify-center space-y-8 py-4">
            <!-- 主图标区域 -->
            <div class="relative flex items-center justify-center w-40 h-40">
              <!-- 背景光晕效果 -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
              <!-- 主图标 -->
              <div class="relative z-10 p-6 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 group-hover:from-purple-100 group-hover:to-pink-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Icon name="heroicons:arrow-path" class="w-16 h-16 text-purple-500 group-hover:text-purple-600 transition-all duration-300 group-hover:scale-110" aria-hidden="true" />
              </div>
              <!-- 装饰性圆环 -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-purple-200 rounded-full opacity-30 group-hover:opacity-60 group-hover:border-purple-300 transition-all duration-300 group-hover:scale-105"></div>
            </div>
            
            <!-- 文字内容区域 -->
            <div class="text-center space-y-6 max-w-md">
              <!-- 主要提示文字 -->
              <div class="space-y-2">
                <p class="text-2xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {{ $t('imageFormatConverter.dragText') }}
                </p>
                <p class="text-gray-500 text-base leading-relaxed">
                  {{ $t('imageFormatConverter.supportedFormats') }}
                </p>
              </div>
              
              <!-- 选择文件按钮 -->
              <div class="flex justify-center">
                <label class="group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-95">
                  <!-- 按钮光效 -->
                  <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  <!-- 按钮内容 -->
                  <div class="relative flex items-center gap-3 text-lg">
                    <Icon name="heroicons:folder-open" class="w-6 h-6" aria-hidden="true" />
                    <span>{{ $t('imageFormatConverter.selectFile') }}</span>
                  </div>
                  <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    @change="handleFileSelect"
                    aria-describedby="file-support-info"
                  >
                </label>
              </div>
            </div>
            
            <!-- 支持信息 -->
            <div class="flex items-center justify-center gap-3 px-6 py-3 bg-purple-50 rounded-full border border-purple-100">
              <Icon name="heroicons:shield-check" class="w-5 h-5 text-purple-600" aria-hidden="true" />
              <p id="file-support-info" class="text-sm font-medium text-purple-700">
                {{ $t('imageFormatConverter.supportInfo') }}
              </p>
            </div>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="dragError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="polite">
          <p class="text-red-600 text-sm flex items-center gap-2">
            <Icon name="heroicons:exclamation-triangle" aria-hidden="true" />
            {{ dragError }}
          </p>
        </div>

        <template #fallback>
          <div class="text-center py-8">
            <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin mx-auto text-purple-500" />
            <p class="mt-2 text-gray-600">{{ $t('common.loading') }}</p>
          </div>
        </template>
      </ClientOnly>
    </section>

    <!-- 文件信息和格式选择 -->
    <section v-if="selectedFile" class="format-selection-section" role="region" aria-labelledby="format-title">
      <h3 id="format-title" class="text-xl font-semibold mb-6 flex items-center gap-2">
        <Icon name="heroicons:cog-6-tooth" class="text-purple-600" />
        {{ $t('imageFormatConverter.formatSelection') }}
      </h3>

      <!-- 当前文件信息 -->
      <div class="file-info-card mb-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:photo" class="w-8 h-8 text-purple-600" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-gray-900">{{ selectedFile.name }}</h4>
            <p class="text-sm text-gray-500">
              {{ formatFileSize(selectedFile.size) }} • {{ getFileFormat(selectedFile.name) }}
            </p>
          </div>
        </div>
      </div>

      <!-- 目标格式选择 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          {{ $t('imageFormatConverter.targetFormat') }}
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div 
            v-for="format in supportedFormats" 
            :key="format.value"
            class="format-option"
            :class="{ 'selected': conversionOptions.targetFormat === format.value }"
            @click="conversionOptions.targetFormat = format.value"
          >
            <input 
              type="radio" 
              :id="format.value" 
              :value="format.value" 
              v-model="conversionOptions.targetFormat"
              class="sr-only"
            >
            <label :for="format.value" class="cursor-pointer block text-center p-3">
              <Icon :name="format.icon" class="w-6 h-6 mx-auto mb-2" />
              <span class="text-sm font-medium">{{ format.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 动态格式选项 -->
      <div v-if="showFormatOptions" class="format-options-section">
        <h4 class="text-lg font-medium mb-4 flex items-center gap-2">
          <Icon name="heroicons:adjustments-horizontal" class="text-purple-600" />
          {{ $t('imageFormatConverter.formatOptions') }}
        </h4>

        <!-- JPEG/WebP 质量选项 -->
        <div v-if="showQualityOption" class="option-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('imageFormatConverter.quality') }}: {{ conversionOptions.quality }}%
          </label>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">{{ $t('imageFormatConverter.low') }}</span>
            <input 
              type="range" 
              min="1" 
              max="100" 
              v-model="conversionOptions.quality"
              class="flex-1 quality-slider"
            >
            <span class="text-sm text-gray-500">{{ $t('imageFormatConverter.high') }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ $t('imageFormatConverter.qualityDescription') }}</p>
        </div>

        <!-- PNG 压缩级别选项 -->
        <div v-if="showCompressionLevelOption" class="option-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('imageFormatConverter.compressionLevel') }}: {{ conversionOptions.compressionLevel }}
          </label>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">{{ $t('imageFormatConverter.fast') }}</span>
            <input 
              type="range" 
              min="0" 
              max="9" 
              v-model="conversionOptions.compressionLevel"
              class="flex-1 compression-slider"
            >
            <span class="text-sm text-gray-500">{{ $t('imageFormatConverter.best') }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ $t('imageFormatConverter.compressionDescription') }}</p>
        </div>

        <!-- AVIF 速度选项 -->
        <div v-if="showSpeedOption" class="option-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('imageFormatConverter.speed') }}: {{ conversionOptions.speed }}
          </label>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">{{ $t('imageFormatConverter.slow') }}</span>
            <input 
              type="range" 
              min="0" 
              max="8" 
              v-model="conversionOptions.speed"
              class="flex-1 speed-slider"
            >
            <span class="text-sm text-gray-500">{{ $t('imageFormatConverter.fast') }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ $t('imageFormatConverter.speedDescription') }}</p>
        </div>
      </div>

      <!-- 转换按钮 -->
      <div class="text-center mt-8">
        <button 
          @click="convertFormat"
          :disabled="isConverting || !conversionOptions.targetFormat"
          class="convert-button"
        >
          <Icon 
            :name="isConverting ? 'heroicons:arrow-path' : 'heroicons:arrow-right'" 
            :class="{ 'animate-spin': isConverting }"
            class="w-5 h-5 mr-2" 
          />
          {{ isConverting ? $t('imageFormatConverter.converting') : $t('imageFormatConverter.convert') }}
        </button>
      </div>
    </section>

    <!-- 转换进度 -->
    <section v-if="isConverting" class="progress-section" role="region" aria-labelledby="progress-title">
      <h3 id="progress-title" class="text-lg font-medium mb-4">{{ $t('imageFormatConverter.progress') }}</h3>
      <div class="enhanced-progress">
        <div class="enhanced-progress-fill" :style="{ width: `${conversionProgress}%` }"></div>
      </div>
      <p class="text-sm text-gray-600 mt-2 text-center">{{ conversionProgress }}%</p>
    </section>

    <!-- 转换结果 -->
    <section v-if="conversionResult" class="results-section" role="region" aria-labelledby="results-title">
      <h3 id="results-title" class="text-xl font-semibold mb-6 flex items-center gap-2">
        <Icon name="heroicons:check-circle" class="text-green-600" />
        {{ $t('imageFormatConverter.conversionComplete') }}
      </h3>

      <div class="result-card">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:check" class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900">{{ conversionResult.filename }}</h4>
              <p class="text-sm text-gray-500">{{ conversionResult.details }}</p>
            </div>
          </div>
          <button @click="downloadResult" class="download-button">
            <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-2" />
            {{ $t('imageFormatConverter.download') }}
          </button>
        </div>

        <!-- 转换统计 -->
        <div class="conversion-stats">
          <div class="stat-item">
            <span class="stat-label">{{ $t('imageFormatConverter.originalFormat') }}</span>
            <span class="stat-value">{{ conversionResult.originalFormat?.toUpperCase() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('imageFormatConverter.newFormat') }}</span>
            <span class="stat-value">{{ conversionResult.processedFormat?.toUpperCase() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('imageFormatConverter.originalSize') }}</span>
            <span class="stat-value">{{ formatFileSize(conversionResult.originalSize) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('imageFormatConverter.newSize') }}</span>
            <span class="stat-value">{{ formatFileSize(conversionResult.processedSize) }}</span>
          </div>
          <div class="stat-item">
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

<style scoped>
/* 继承ImageCompressor的样式并调整颜色主题 */
.image-format-converter {
  @apply max-w-6xl mx-auto px-4 py-8;
}

.core-feature-section {
  @apply mb-12 p-8 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-2xl shadow-lg border border-gray-100/50;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.core-feature-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.3), transparent);
}

.section-title {
  @apply text-3xl font-bold mb-3;
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #9333ea 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-text 3s ease-in-out infinite;
}

.section-subtitle {
  @apply text-lg text-gray-600 mb-6 font-medium;
}

@keyframes gradient-text {
  0%, 100% { background-position: 200% 0; }
  50% { background-position: 0% 0; }
}

.enhanced-upload-zone {
  @apply relative overflow-hidden rounded-2xl;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  border: 2px dashed #cbd5e1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-upload-zone:hover {
  @apply border-purple-400 shadow-2xl;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%);
  transform: translateY(-4px) scale(1.01);
}

.enhanced-upload-zone.drag-over {
  @apply border-purple-500 shadow-2xl;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #d8b4fe 100%);
  transform: translateY(-6px) scale(1.02);
}

.format-selection-section {
  @apply bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-xl p-8 border border-purple-100 mb-8;
}

.file-info-card {
  @apply bg-white rounded-lg p-4 shadow-sm border border-gray-100;
}

.format-option {
  @apply bg-white border-2 border-gray-200 rounded-lg transition-all duration-300 cursor-pointer;
}

.format-option:hover {
  @apply border-purple-300 shadow-md;
  transform: translateY(-2px);
}

.format-option.selected {
  @apply border-purple-500 bg-purple-50 shadow-md;
}

.format-options-section {
  @apply bg-white rounded-lg p-6 border border-gray-100 mt-6;
}

.option-group {
  @apply mb-6 last:mb-0;
}

.quality-slider, .compression-slider, .speed-slider {
  @apply appearance-none bg-gray-200 rounded-lg h-2 outline-none;
}

.quality-slider::-webkit-slider-thumb, 
.compression-slider::-webkit-slider-thumb, 
.speed-slider::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-purple-500 rounded-full cursor-pointer shadow-lg;
}

.convert-button {
  @apply px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center;
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #8b5cf6 100%);
  background-size: 200% 100%;
  color: white;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.convert-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.convert-button:hover {
  @apply shadow-2xl;
  background-position: 100% 0;
  transform: translateY(-2px) scale(1.05);
}

.convert-button:hover::before {
  left: 100%;
}

.convert-button:disabled {
  @apply opacity-50 cursor-not-allowed;
  transform: none;
}

.progress-section {
  @apply bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 mb-8;
}

.enhanced-progress {
  @apply relative overflow-hidden rounded-full h-4 bg-gray-200 shadow-inner;
}

.enhanced-progress-fill {
  @apply h-full transition-all duration-500 ease-out rounded-full;
  background: linear-gradient(90deg, #9333ea 0%, #ec4899 30%, #8b5cf6 60%, #d946ef 100%);
  background-size: 300% 100%;
  animation: progress-shimmer 2s ease-in-out infinite;
  position: relative;
}

.enhanced-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progress-shine 1.5s ease-in-out infinite;
}

@keyframes progress-shimmer {
  0%, 100% { background-position: 300% 0; }
  50% { background-position: 0% 0; }
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.results-section {
  @apply bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-xl p-8 border border-green-200;
}

.result-card {
  @apply bg-white rounded-lg p-6 shadow-sm border border-gray-100;
}

.download-button {
  @apply px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center;
}

.download-button:hover {
  @apply shadow-lg;
  background: linear-gradient(to right, #059669, #047857);
  transform: translateY(-1px) scale(1.02);
}

.conversion-stats {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4;
}

.stat-item {
  @apply text-center p-3 bg-gray-50 rounded-lg;
}

.stat-label {
  @apply block text-xs text-gray-500 mb-1;
}

.stat-value {
  @apply block text-sm font-semibold text-gray-900;
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

/* 响应式优化 */
@media (max-width: 768px) {
  .image-format-converter {
    @apply px-2 py-4;
  }
  
  .core-feature-section, .format-selection-section {
    @apply p-4 mb-6;
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