<template>
  <div class="heic-converter fade-in-up" itemscope itemtype="https://schema.org/SoftwareApplication">
    <!-- 文件上传区域 -->
    <section class="core-feature-section" role="region" aria-labelledby="upload-title">
      <div class="text-center mb-8">
         <h2 id="upload-title" class="section-title flex items-center justify-center gap-3 text-center" itemprop="name">
           <Icon name="heroicons:cloud-arrow-up" class="text-3xl" aria-hidden="true" />
           {{ $t('heicConverter.title') }}
         </h2>
         <p class="section-subtitle text-center" itemprop="description">{{ $t('heicConverter.subtitle') || '快速、安全、免费的HEIC图片转换工具' }}</p>
         <!-- 隐藏的结构化数据 -->
         <meta itemprop="applicationCategory" content="ImageConverter">
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
          :aria-label="$t('heicConverter.dragText')"
          @keydown.enter="fileInput?.click()"
          @keydown.space.prevent="fileInput?.click()"
        >
          <!-- 优化后的上传区域布局 -->
          <div class="flex flex-col items-center justify-center space-y-8 py-4">
            <!-- 主图标区域 - 改进对齐和视觉效果 -->
            <div class="relative flex items-center justify-center w-40 h-40">
              <!-- 背景光晕效果 -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
              <!-- 主图标 -->
              <div class="relative z-10 p-6 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Icon name="heroicons:photo" class="w-16 h-16 text-blue-500 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110" aria-hidden="true" />
              </div>
              <!-- 装饰性圆环 -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-blue-200 rounded-full opacity-30 group-hover:opacity-60 group-hover:border-blue-300 transition-all duration-300 group-hover:scale-105"></div>
            </div>
            
            <!-- 文字内容区域 -->
            <div class="text-center space-y-6 max-w-md">
              <!-- 主要提示文字 -->
              <div class="space-y-2">
                <p class="text-2xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {{ $t('heicConverter.dragText') }}
                </p>
                <p class="text-gray-500 text-base leading-relaxed">
                  {{ $t('heicConverter.batchUploadText') }}
                </p>
              </div>
              
              <!-- 选择文件按钮 -->
              <div class="flex justify-center">
                <label class="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-95">
                  <!-- 按钮光效 -->
                  <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  <!-- 按钮内容 -->
                  <div class="relative flex items-center gap-3 text-lg">
                    <Icon name="heroicons:folder-open" class="w-6 h-6" aria-hidden="true" />
                    <span>{{ $t('heicConverter.selectFile') }}</span>
                  </div>
                  <input 
                    ref="fileInput"
                    type="file" 
                    multiple 
                    accept=".heic,.heif"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    @change="handleFileSelect"
                    aria-describedby="file-support-info"
                  >
                </label>
              </div>
            </div>
            
            <!-- 支持信息 -->
            <div class="flex items-center justify-center gap-3 px-6 py-3 bg-green-50 rounded-full border border-green-100">
              <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-600" aria-hidden="true" />
              <p id="file-support-info" class="text-sm font-medium text-green-700">
                {{ $t('heicConverter.supportInfo') }}
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
          <div class="upload-zone">
            <div class="space-y-4">
              <Icon name="heroicons:photo" class="mx-auto text-6xl text-gray-400" />
              <div>
                <p class="text-lg text-gray-600">
                  {{ $t('heicConverter.loading') }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </section>

    <!-- 文件列表 -->
    <ClientOnly>
      <section v-if="hasFiles" class="file-list-section slide-up" role="region" aria-labelledby="file-list-title">
        <div class="flex items-center justify-between mb-6">
          <h3 id="file-list-title" class="text-xl font-bold text-gray-900 flex items-center gap-3">
            <Icon name="heroicons:document-duplicate" class="text-blue-600" aria-hidden="true" />
            {{ $t('heicConverter.selectedFiles') }}
            <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{{ files.length }}</span>
          </h3>
          <button 
            @click="clearFiles"
            class="btn-secondary text-sm"
            :aria-label="`清除所有文件 (${files.length}个)`"
          >
            <Icon name="heroicons:trash" class="mr-2" aria-hidden="true" />
            {{ $t('heicConverter.clearAll') }}
          </button>
        </div>
        
        <div class="grid gap-4" role="list">
          <div 
            v-for="(file, index) in files" 
            :key="index"
            class="file-item group flex items-center justify-between"
          >
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div class="relative">
                <Icon name="heroicons:photo" class="text-2xl text-blue-600 group-hover:text-blue-700 transition-colors" aria-hidden="true" />
                <div class="absolute -inset-1 bg-blue-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-900 transition-colors" :title="file.name">{{ file.name }}</p>
                <p class="text-xs text-gray-600 font-medium">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <button 
              @click="removeFile(index)"
              class="interactive-element p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              :aria-label="`${$t('heicConverter.removeFile')} ${file.name}`"
            >
              <Icon name="heroicons:x-mark" class="text-lg" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </ClientOnly>

    <!-- 转换设置 -->
    <ClientOnly>
      <section v-if="hasFiles" class="bg-white rounded-lg shadow-sm border p-6" role="region" aria-labelledby="settings-title">
        <h3 id="settings-title" class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="heroicons:cog-6-tooth" aria-hidden="true" />
          {{ $t('heicConverter.convertSettings') }}
        </h3>
        
        <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 输出格式 -->
          <div>
            <label for="output-format" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('heicConverter.outputFormat') }}
            </label>
            <select 
              id="output-format"
              v-model="convertOptions.format"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-describedby="format-help"
            >
              <option value="jpeg">JPEG (.jpg)</option>
              <option value="png">PNG (.png)</option>
              <option value="webp">WebP (.webp)</option>
            </select>
            <p id="format-help" class="sr-only">{{ $t('heicConverter.formatHelp') }}</p>
          </div>

          <!-- 图片质量 -->
          <div v-if="convertOptions.format !== 'png'">
            <label for="image-quality" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('heicConverter.imageQuality') }}: {{ convertOptions.quality }}%
            </label>
            <input 
              id="image-quality"
              v-model.number="convertOptions.quality"
              type="range" 
              min="10" 
              max="100" 
              step="5"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              :aria-label="`图片质量: ${convertOptions.quality}%`"
              aria-describedby="quality-help"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>{{ $t('heicConverter.lowQuality') }}</span>
              <span>{{ $t('heicConverter.highQuality') }}</span>
            </div>
            <p id="quality-help" class="sr-only">{{ $t('heicConverter.qualityHelp') }}</p>
          </div>
        </form>
      </section>
    </ClientOnly>

    <!-- 转换按钮和进度 -->
    <ClientOnly>
      <section v-if="hasFiles" class="convert-section slide-up" role="region" aria-labelledby="convert-section">
        <div class="text-center mb-6">
          <h3 id="convert-section" class="section-title flex items-center justify-center gap-3">
            <Icon name="heroicons:arrow-path" class="text-2xl" aria-hidden="true" />
            {{ $t('heicConverter.convert') }}
          </h3>
          <p class="section-subtitle">{{ $t('heicConverter.convertDescription') || '一键转换所有HEIC文件为JPG格式' }}</p>
        </div>
        
        <div class="space-y-6">
          <!-- 转换按钮 -->
          <button 
            @click="startConversion"
            :disabled="!canConvert"
            class="convert-button w-full flex items-center justify-center gap-3"
            :aria-label="isConverting ? $t('heicConverter.converting') : `${$t('heicConverter.startConvert')} ${files.length} ${$t('heicConverter.files')}`"
            :aria-describedby="isConverting ? 'conversion-progress' : undefined"
          >
            <Icon 
              :name="isConverting ? 'heroicons:arrow-path' : 'heroicons:arrow-down-tray'" 
              :class="{ 'animate-spin': isConverting }"
              class="text-2xl"
              aria-hidden="true"
            />
            {{ isConverting ? $t('heicConverter.converting') : `${$t('heicConverter.startConvert')} (${files.length} ${$t('heicConverter.files', files.length)})` }}
          </button>

          <!-- 进度条 -->
          <div v-if="isConverting" id="conversion-progress" class="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :aria-label="$t('heicConverter.progressLabel', { progress })">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-700">{{ $t('heicConverter.convertProgress') }}</span>
              <span class="text-lg font-bold text-blue-600" aria-live="polite">{{ progress }}%</span>
            </div>
            <div class="enhanced-progress">
              <div 
                class="enhanced-progress-fill"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <p class="text-center text-sm text-gray-600 font-medium">{{ $t('heicConverter.progressComplete', { progress }) }}</p>
          </div>

          <!-- 转换错误 -->
          <div v-if="convertError" class="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
            <div class="flex items-start gap-3">
              <Icon name="heroicons:exclamation-triangle" class="text-red-500 text-xl flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 class="text-red-800 font-semibold mb-1">{{ $t('heicConverter.convertError') }}</h4>
                <p class="text-red-700 text-sm">{{ convertError }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>

    <!-- 转换结果 -->
    <ClientOnly>
      <div v-if="hasResults" class="results-section slide-up">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Icon name="heroicons:check-circle" class="text-3xl text-green-600" aria-hidden="true" />
          </div>
          <h3 class="text-2xl font-bold text-green-800 mb-2">
            {{ $t('heicConverter.convertComplete') }}
          </h3>
          <p class="text-gray-600">{{ $t('heicConverter.convertCompleteDesc', { count: convertResults.length }) }}</p>
        </div>
        
        <div class="grid gap-4 mb-6">
          <div 
            v-for="(result, index) in convertResults" 
            :key="index"
            class="file-item group flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300"
          >
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div class="relative">
                <Icon name="heroicons:photo" class="text-2xl text-green-600 group-hover:text-green-700 transition-colors" aria-hidden="true" />
                <div class="absolute -inset-1 bg-green-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-gray-900 truncate group-hover:text-green-900 transition-colors" :title="result.filename">
                  {{ result.filename }}
                </p>
                <p class="text-xs text-gray-600 font-medium">
                  {{ formatFileSize(result.blob.size) }}
                </p>
              </div>
            </div>
            
            <button 
              @click="downloadFile(result)"
              class="download-button text-sm"
            >
              <Icon name="heroicons:arrow-down-tray" class="mr-2" aria-hidden="true" />
              {{ $t('heicConverter.download') }}
            </button>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="downloadAll"
            class="download-button text-lg"
          >
            <Icon name="heroicons:arrow-down-tray" class="mr-2 text-xl" aria-hidden="true" />
            {{ $t('heicConverter.downloadAll') }}
          </button>
          <button 
            @click="resetConverter"
            class="btn-secondary text-lg py-3 px-6"
          >
            <Icon name="heroicons:trash" class="mr-2 text-xl" aria-hidden="true" />
            {{ $t('heicConverter.restart') }}
          </button>
        </div>
      </div>
    </ClientOnly>

    <!-- 使用说明 -->
    <div class="instructions-section slide-up">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <Icon name="heroicons:information-circle" class="text-2xl text-blue-600" aria-hidden="true" />
        </div>
        <h3 class="text-xl font-bold text-blue-900">
          {{ $t('heicConverter.instructions.title') }}
        </h3>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="instruction-item bg-white/60 rounded-lg border border-blue-100">
          <Icon name="heroicons:check-circle" class="instruction-icon text-green-500" aria-hidden="true" />
          <p class="text-blue-800 font-medium">
            {{ $t('heicConverter.instructions.support') }}
          </p>
        </div>
        <div class="instruction-item bg-white/60 rounded-lg border border-blue-100">
           <Icon name="heroicons:shield-check" class="instruction-icon text-green-500" aria-hidden="true" />
           <p class="text-blue-800 font-medium">
             {{ $t('heicConverter.instructions.privacy') }}
           </p>
         </div>
         <div class="instruction-item bg-white/60 rounded-lg border border-blue-100">
           <Icon name="heroicons:squares-plus" class="instruction-icon text-green-500" aria-hidden="true" />
           <p class="text-blue-800 font-medium">
             {{ $t('heicConverter.instructions.batch') }}
           </p>
         </div>
         <div class="instruction-item bg-white/60 rounded-lg border border-blue-100">
           <Icon name="heroicons:photo" class="instruction-icon text-green-500" aria-hidden="true" />
           <p class="text-blue-800 font-medium">
             {{ $t('heicConverter.instructions.formats') }}
           </p>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入Vue组合式API
import { ref, onUnmounted, computed, watch, onMounted } from 'vue'
// heic-convert will be dynamically imported when needed

// 导入i18n相关函数
const { t } = useI18n()

// 模板引用
const fileInput = ref<HTMLInputElement>()

// 页面SEO设置通过国际化配置处理
useHead({
  title: () => t('heicConverter.meta.title'),
  meta: [
    { name: 'description', content: () => t('heicConverter.meta.description') },
    { name: 'keywords', content: () => t('heicConverter.meta.keywords') }
  ]
})

// 类型定义
interface ConvertOptions {
  format: 'jpeg' | 'png' | 'webp'
  quality: number
  width?: number
  height?: number
}

interface ConvertResult {
  filename: string
  blob: Blob
  originalSize: number
  processedSize: number
}

// 状态管理
const isDragging = ref(false)
const files = ref<File[]>([])
const dragError = ref<string | null>(null)
const convertError = ref<string | null>(null)
const isConverting = ref(false)
const progress = ref(0)
const convertResults = ref<ConvertResult[]>([])

// 转换设置
const convertOptions = ref<ConvertOptions>({
  format: 'jpeg',
  quality: 80,
  width: undefined,
  height: undefined
})

// heic-convert 库引用
let heicConvert: any = null

// 在组件挂载时动态导入 heic-convert
onMounted(async () => {
  try {
    // 使用浏览器版本的heic-convert，处理CommonJS导入
    const heicConvertModule = await import('heic-convert/browser')
    // 处理CommonJS模块的导入
    heicConvert = heicConvertModule.default || heicConvertModule
    console.log('✅ heic-convert加载成功:', typeof heicConvert)
  } catch (error) {
    console.error('❌ heic-convert导入失败:', error)
    // 尝试备用导入方式
    try {
      const { default: heicConvertFallback } = await import('heic-convert')
      heicConvert = heicConvertFallback
      console.log('✅ heic-convert备用加载成功:', typeof heicConvert)
    } catch (fallbackError) {
      console.error('❌ heic-convert备用导入也失败:', fallbackError)
    }
  }
})

// 计算属性
const hasFiles = computed(() => files.value.length > 0)
const hasResults = computed(() => convertResults.value.length > 0)
const canConvert = computed(() => hasFiles.value && !isConverting.value && heicConvert)
const totalFileSize = computed(() => {
  return files.value.reduce((total, file) => total + file.size, 0)
})
const formattedTotalSize = computed(() => formatFileSize(totalFileSize.value))

// 工具函数
const formatFileSize = (size: number) => {
  if (size === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 拖拽处理
const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  if (e.relatedTarget === null) {
    isDragging.value = false
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  const droppedFiles = Array.from(e.dataTransfer?.files || [])
  processFiles(droppedFiles)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const selectedFiles = Array.from(target.files || [])
  processFiles(selectedFiles)
}

const processFiles = (newFiles: File[]) => {
  const heicFiles = newFiles.filter(file => 
    file.type === 'image/heic' || file.type === 'image/heif' || 
    file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
  )
  
  if (heicFiles.length === 0) {
    dragError.value = t('heicConverter.invalidFileType')
    return
  }
  
  if (heicFiles.length > 10) {
    dragError.value = t('heicConverter.tooManyFiles')
    return
  }
  
  const oversizedFiles = heicFiles.filter(file => file.size > 50 * 1024 * 1024)
  if (oversizedFiles.length > 0) {
    dragError.value = t('heicConverter.fileTooLarge')
    return
  }
  
  files.value = [...files.value, ...heicFiles]
  dragError.value = null
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const clearFiles = () => {
  files.value = []
  convertResults.value = []
  dragError.value = null
  convertError.value = null
}

// 高效两步转换流程
const startConversion = async () => {
  if (files.value.length === 0) return
  if (isConverting.value) return
  if (!heicConvert) {
    convertError.value = 'heic-convert库尚未加载完成，请稍后再试'
    return
  }
  
  isConverting.value = true
  progress.value = 0
  convertError.value = null
  convertResults.value = []
  
  try {
    const results: ConvertResult[] = []
    
    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i]
      progress.value = Math.round((i / files.value.length) * 100)
      
      try {
        // 将文件读取为ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        
        // 将ArrayBuffer转换为Uint8Array，这是heic-convert期望的格式
        const uint8Array = new Uint8Array(arrayBuffer)
        
        // 使用heic-convert进行转换
        const jpegBuffer = await heicConvert({
          buffer: uint8Array, // 使用Uint8Array而不是ArrayBuffer
          format: 'JPEG',
          quality: 0.95 // 高质量中间格式
        })
        
        // 创建Blob用于上传
        let jpegBlob: Blob
        
        try {
          if (jpegBuffer instanceof ArrayBuffer) {
            jpegBlob = new Blob([jpegBuffer], { type: 'image/jpeg' })
          } else if (jpegBuffer instanceof Uint8Array) {
            jpegBlob = new Blob([jpegBuffer], { type: 'image/jpeg' })
          } else if (jpegBuffer && jpegBuffer.buffer instanceof ArrayBuffer) {
            jpegBlob = new Blob([jpegBuffer.buffer], { type: 'image/jpeg' })
          } else {
            // 尝试将数据转换为Buffer
            const bufferData = Buffer.from(jpegBuffer)
            jpegBlob = new Blob([bufferData], { type: 'image/jpeg' })
          }
        } catch (blobError) {
          console.error('❌ Blob创建失败:', blobError)
          throw new Error(`无法创建Blob: ${blobError.message}`)
        }
        
        // 准备FormData，包含中间JPEG和所有输出选项
        const formData = new FormData()
        formData.append('image', jpegBlob, file.name.replace(/\.(heic|heif)$/i, '.jpg'))
        formData.append('format', convertOptions.value.format)
        formData.append('quality', convertOptions.value.quality.toString())
        formData.append('originalFilename', file.name)
        
        if (convertOptions.value.width) {
          formData.append('width', convertOptions.value.width.toString())
        }
        if (convertOptions.value.height) {
          formData.append('height', convertOptions.value.height.toString())
        }
        
        // 服务端处理
        const response = await $fetch('/api/process-image', {
          method: 'POST',
          body: formData
        })
        
        // 处理响应
        const processedBlob = new Blob([response], { 
          type: `image/${convertOptions.value.format}` 
        })
        
        const baseName = file.name.replace(/\.(heic|heif)$/i, '')
        const extension = convertOptions.value.format === 'jpeg' ? 'jpg' : convertOptions.value.format
        const filename = `${baseName}.${extension}`
        
        results.push({
          filename,
          blob: processedBlob,
          originalSize: file.size,
          processedSize: processedBlob.size
        })
        
      } catch (error) {
        console.error(`❌ 转换文件 ${file.name} 失败:`, error)
        // 继续处理其他文件，不中断整个流程
      }
    }
    
    convertResults.value = results
    progress.value = 100
    
    if (results.length === 0) {
      convertError.value = t('heicConverter.conversionFailed')
    }
    
  } catch (error) {
    console.error('批量转换失败:', error)
    convertError.value = error instanceof Error ? error.message : t('heicConverter.unknownError')
  } finally {
    isConverting.value = false
  }
}

// 下载文件
const downloadFile = (result: ConvertResult) => {
  const url = URL.createObjectURL(result.blob)
  const a = document.createElement('a')
  a.href = url
  a.download = result.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 下载全部文件
const downloadAll = () => {
  if (!hasResults.value) return
  
  try {
    convertResults.value.forEach(result => {
      downloadFile(result)
    })
  } catch (error) {
    console.error(t('heicConverter.downloadError'), error)
  }
}

// 重置转换器
const resetConverter = () => {
  try {
    // 重置状态
    convertResults.value = []
    clearFiles()
    
    // 清理错误状态
    convertError.value = null
    dragError.value = null
    progress.value = 0
  } catch (error) {
    console.error(t('heicConverter.resetError'), error)
  }
}

// 监听文件变化，自动清理错误状态
watch(files, (newFiles) => {
  if (newFiles.length === 0) {
    convertResults.value = []
  }
  // 清理错误状态
  if (dragError.value) {
    dragError.value = null
  }
}, { deep: true })

// 监听转换选项变化，清理之前的结果
watch(convertOptions, () => {
  if (convertResults.value.length > 0) {
    convertResults.value = []
  }
}, { deep: true })

// 组件卸载时清理资源
onUnmounted(() => {
  try {
    // 清理blob URLs
    convertResults.value.forEach(result => {
      if (result.blob) {
        URL.revokeObjectURL(URL.createObjectURL(result.blob))
      }
    })
  } catch (error) {
    console.error(t('heicConverter.cleanupError'), error)
  }
})
</script>

<style scoped>
/* 组件特定样式 */
.heic-converter {
  @apply max-w-6xl mx-auto px-4 py-8;
}

/* 核心功能区域样式 */
.core-feature-section {
  @apply mb-12 p-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-lg border border-gray-100/50;
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
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
}

.core-feature-section::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}

/* 标题样式增强 */
.section-title {
  @apply text-3xl font-bold mb-3;
  background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #1e40af 100%);
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

/* 上传区域增强 */
.enhanced-upload-zone {
  @apply relative overflow-hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  border: 2px dashed #cbd5e1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-upload-zone:hover {
  @apply border-blue-400 shadow-2xl;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%);
  transform: translateY(-4px) scale(1.01);
}

.enhanced-upload-zone.drag-over {
  @apply border-blue-500 shadow-2xl;
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #60a5fa 100%);
  transform: translateY(-6px) scale(1.02);
}

/* 文件列表增强 */
.file-list-section {
  @apply bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-6 border border-gray-200/50;
  backdrop-filter: blur(5px);
}

.file-item {
  @apply bg-white rounded-lg p-4 shadow-sm border border-gray-100 transition-all duration-300;
}

.file-item:hover {
  @apply shadow-md border-blue-200 bg-blue-50/30;
  transform: translateX(4px);
}

/* 转换按钮增强 */
.convert-section {
  @apply bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl p-8 border border-blue-100;
  position: relative;
}

.convert-button {
  @apply px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
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

/* 进度条增强 */
.enhanced-progress {
  @apply relative overflow-hidden rounded-full h-4 bg-gray-200 shadow-inner;
}

.enhanced-progress-fill {
  @apply h-full transition-all duration-500 ease-out rounded-full;
  background: linear-gradient(90deg, #3b82f6 0%, #6366f1 30%, #8b5cf6 60%, #ec4899 100%);
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

/* 结果区域增强 */
.results-section {
  @apply bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-xl p-6 border border-green-200;
}

.download-button {
  @apply px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-md transition-all duration-300;
}

.download-button:hover {
  @apply shadow-lg;
  background: linear-gradient(to right, #059669, #047857);
  transform: translateY(-1px) scale(1.02);
}

/* 使用说明增强 */
.instructions-section {
  @apply bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl p-8 border border-indigo-100;
}

.instruction-item {
  @apply flex items-start space-x-4 p-4 rounded-lg transition-all duration-300;
}

.instruction-item:hover {
  @apply bg-white/70 shadow-sm;
  transform: translateX(8px);
}

.instruction-icon {
  @apply w-6 h-6 text-blue-600 flex-shrink-0 mt-1;
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2));
}

/* 响应式优化 */
@media (max-width: 768px) {
  .heic-converter {
    @apply px-2 py-4;
  }
  
  .core-feature-section {
    @apply p-4 mb-6;
  }
  
  .section-title {
    @apply text-2xl;
  }
  
  .convert-button {
    @apply px-6 py-3 text-base;
  }
}

/* 动画入场效果 */
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

/* 微交互效果 */
.interactive-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-2px);
}
</style>