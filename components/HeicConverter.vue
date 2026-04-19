<template>
  <div class="heic-converter fade-in-up" itemscope itemtype="https://schema.org/SoftwareApplication">
    <!-- Skip to main content link -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-slate-950 text-white px-4 py-2 rounded-full dark:bg-slate-100 dark:text-slate-950 z-50">
      {{ $t('accessibility.skipToMain') }}
    </a>

    <!-- 文件上传区域 -->
    <section id="main-content" class="core-feature-section" role="region" aria-labelledby="upload-title">
      <header class="text-center mb-8">
         <h1 id="upload-title" class="section-title flex items-center justify-center gap-3 text-center" itemprop="name">
           <Icon name="heroicons:cloud-arrow-up" class="text-3xl" aria-hidden="true" />
           {{ $t('heicConverter.title') }}
         </h1>
         <p class="section-subtitle text-center" itemprop="description">{{ $t('heicConverter.subtitle') }}</p>
         <!-- 隐藏的结构化数据 -->
         <meta itemprop="applicationCategory" content="ImageConverter">
         <meta itemprop="operatingSystem" content="Web Browser">
         <div itemprop="offers" itemscope itemtype="https://schema.org/Offer" style="display: none;">
           <meta itemprop="price" content="0">
           <meta itemprop="priceCurrency" content="USD">
         </div>
       </header>
      
      <!-- 使用 ClientOnly 包装交互组件 -->
      <ClientOnly>
        <!-- 拖拽上传区域 -->
        <div 
          class="enhanced-upload-zone"
          :class="{ 'drag-over': isDragging }"
          role="button"
          tabindex="0"
          :aria-label="$t('heicConverter.dragText')"
          aria-describedby="upload-instructions file-support-info"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver"
          @drop="handleDrop"
          @keydown.enter="fileInput?.click()"
          @keydown.space.prevent="fileInput?.click()"
        >
          <!-- 优化后的上传区域布局 - 减少高度 -->
          <div class="flex flex-col items-center justify-center space-y-4 py-6">
            <!-- 主图标区域 - 缩小尺寸 -->
            <div class="upload-icon-shell" role="img" :aria-label="$t('heicConverter.uploadIcon')">
              <div class="upload-icon-core">
                <Icon name="heroicons:photo" class="h-8 w-8 text-slate-700 dark:text-slate-200" aria-hidden="true" />
              </div>
            </div>
            
            <div id="upload-instructions" class="text-center space-y-3 max-w-md">
              <!-- 主要提示文字 -->
              <div class="space-y-1">
                <p class="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {{ $t('heicConverter.dragText') }}
                </p>
                <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {{ $t('heicConverter.batchUploadText') }}
                </p>
              </div>
              
              <!-- 选择文件按钮 -->
              <div class="flex justify-center pt-2">
                <label class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white focus-within:ring-2 focus-within:ring-slate-500 focus-within:ring-offset-2">
                  <div class="relative flex items-center gap-2 text-base">
                    <Icon name="heroicons:folder-open" class="w-5 h-5" aria-hidden="true" />
                    <span>{{ $t('heicConverter.selectFile') }}</span>
                  </div>
                  <input 
                    ref="fileInput"
                    type="file" 
                    multiple 
                    accept=".heic,.heif"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-describedby="file-support-info"
                    :aria-label="$t('heicConverter.selectFileAriaLabel')"
                    @change="handleFileSelect"
                  >
                </label>
              </div>
            </div>
            
            <!-- 支持信息 - 缩小尺寸 -->
            <div class="upload-support-pill">
              <Icon name="heroicons:shield-check" class="w-4 h-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />
              <p id="file-support-info" class="text-xs font-medium text-slate-600 dark:text-slate-300">
                {{ $t('heicConverter.supportInfo') }}
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
          <div class="upload-zone" role="status" aria-live="polite">
            <div class="space-y-4">
              <Icon name="heroicons:photo" class="mx-auto text-6xl text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <div>
                <p class="text-lg text-gray-600 dark:text-gray-400">
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
        <header class="flex items-center justify-between mb-6">
          <h2 id="file-list-title" class="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Icon name="heroicons:document-duplicate" class="text-slate-700 dark:text-slate-300" aria-hidden="true" />
            {{ $t('heicConverter.selectedFiles') }}
            <span class="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" :aria-label="`${files.length} ${$t('heicConverter.filesSelected')}`">{{ files.length }}</span>
          </h2>
          <button 
            class="btn-secondary text-sm"
            :aria-label="$t('common.clearAll') + ' (' + files.length + ' ' + $t('heicConverter.files') + ')'"
            @click="clearFiles"
          >
            <Icon name="heroicons:trash" class="mr-2" aria-hidden="true" />
            {{ $t('heicConverter.clearAll') }}
          </button>
        </header>
        
        <ul class="grid gap-4" role="list">
          <li 
            v-for="(file, index) in files" 
            :key="index"
            class="file-item group flex items-center justify-between"
            role="listitem"
          >
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div class="file-item-icon">
                <Icon name="heroicons:photo" class="text-2xl text-slate-700 dark:text-slate-200" aria-hidden="true" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" :title="file.name">{{ file.name }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <button 
              class="interactive-element p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="$t('common.removeFile') + ' ' + file.name"
              @click="removeFile(index)"
            >
              <Icon name="heroicons:x-mark" class="text-lg" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </section>
    </ClientOnly>

    <!-- 转换设置 -->
    <ClientOnly>
      <section v-if="hasFiles" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300" role="region" aria-labelledby="settings-title">
        <h3 id="settings-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="heroicons:cog-6-tooth" class="text-gray-700 dark:text-gray-300" aria-hidden="true" />
          {{ $t('heicConverter.convertSettings') }}
        </h3>
        
        <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 输出格式 -->
          <div>
            <label for="output-format" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('heicConverter.outputFormat') }}
            </label>
            <select 
              id="output-format"
              v-model="convertOptions.format"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label for="image-quality" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('heicConverter.imageQuality') }}: {{ convertOptions.quality }}%
            </label>
            <input 
              id="image-quality"
              v-model.number="convertOptions.quality"
              type="range" 
              min="10" 
              max="100" 
              step="5"
              class="w-full"
              :aria-label="$t('accessibility.imageQualityAriaLabel', { quality: convertOptions.quality })"
              aria-describedby="quality-help"
            >
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
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
          <p class="section-subtitle">{{ $t('heicConverter.convertDescription') }}</p>
        </div>
        
        <div class="space-y-6">
          <!-- 转换按钮 -->
          <button 
            :disabled="!canConvert"
            class="convert-button w-full flex items-center justify-center gap-3"
            :aria-label="isConverting ? $t('heicConverter.converting') : `${$t('heicConverter.startConvert')} ${files.length} ${$t('heicConverter.files')}`"
            :aria-describedby="isConverting ? 'conversion-progress' : undefined"
            @click="startConversion"
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
          <div v-if="isConverting" id="conversion-progress" class="progress-panel space-y-4 p-6" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :aria-label="$t('heicConverter.progressLabel', { progress })">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">{{ $t('heicConverter.convertProgress') }}</span>
              <span class="text-lg font-bold text-teal-700 dark:text-teal-300" aria-live="polite">{{ progress }}%</span>
            </div>
            <div class="enhanced-progress">
              <div 
                class="enhanced-progress-fill"
                :style="{ width: `${progress}%` }"
              />
            </div>
            <p class="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">{{ $t('heicConverter.progressComplete', { progress }) }}</p>
          </div>

          <!-- 转换错误 -->
          <div v-if="convertError" class="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-600 rounded-lg shadow-sm">
            <div class="flex items-start gap-3">
              <Icon name="heroicons:exclamation-triangle" class="text-red-500 dark:text-red-400 text-xl flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 class="text-red-800 dark:text-red-300 font-semibold mb-1">{{ $t('heicConverter.convertError') }}</h4>
                <p class="text-red-700 dark:text-red-400 text-sm">{{ convertError }}</p>
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
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
            <Icon name="heroicons:check-circle" class="text-3xl text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
          <h3 class="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
            {{ $t('heicConverter.convertComplete') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">{{ $t('heicConverter.convertCompleteDesc', { count: convertResults.length }) }}</p>
        </div>
        
        <div class="grid gap-4 mb-6">
          <div 
            v-for="(result, index) in convertResults" 
            :key="index"
            class="file-item group flex items-center justify-between border-slate-200 dark:border-slate-800"
          >
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div class="file-item-icon">
                <Icon name="heroicons:photo" class="text-2xl text-slate-700 dark:text-slate-200" aria-hidden="true" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" :title="result.filename">
                  {{ result.filename }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {{ formatFileSize(result.convertedBlob.size) }}
                </p>
              </div>
            </div>
            
            <button 
              class="download-button text-sm"
              @click="downloadFile(result)"
            >
              <Icon name="heroicons:arrow-down-tray" class="mr-2" aria-hidden="true" />
              {{ $t('heicConverter.download') }}
            </button>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            class="download-button text-lg"
            @click="downloadAll"
          >
            <Icon name="heroicons:arrow-down-tray" class="mr-2 text-xl" aria-hidden="true" />
            {{ $t('heicConverter.downloadAll') }}
          </button>
          <button 
            class="btn-secondary text-lg py-3 px-6"
            @click="resetConverter"
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
        <div class="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Icon name="heroicons:information-circle" class="text-2xl" aria-hidden="true" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">
          {{ $t('heicConverter.instructions.title') }}
        </h3>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="instruction-item">
          <Icon name="heroicons:check-circle" class="instruction-icon" aria-hidden="true" />
          <p class="font-medium text-slate-800 dark:text-slate-200">
            {{ $t('heicConverter.instructions.support') }}
          </p>
        </div>
        <div class="instruction-item">
           <Icon name="heroicons:shield-check" class="instruction-icon" aria-hidden="true" />
           <p class="font-medium text-slate-800 dark:text-slate-200">
             {{ $t('heicConverter.instructions.privacy') }}
           </p>
         </div>
         <div class="instruction-item">
           <Icon name="heroicons:squares-plus" class="instruction-icon" aria-hidden="true" />
           <p class="font-medium text-slate-800 dark:text-slate-200">
             {{ $t('heicConverter.instructions.batch') }}
           </p>
         </div>
         <div class="instruction-item">
           <Icon name="heroicons:photo" class="instruction-icon" aria-hidden="true" />
           <p class="font-medium text-slate-800 dark:text-slate-200">
             {{ $t('heicConverter.instructions.formats') }}
           </p>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入Vue组合式API
import { ref, onUnmounted, computed, watch } from 'vue'
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
  originalFile: File
  convertedBlob: Blob
  downloadUrl: string
  filename: string
  originalSize: number
  convertedSize: number
  compressionRatio: number
  originalDimensions: {
    width: number
    height: number
  }
  convertedDimensions: {
    width: number
    height: number
  }
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

// 移除前端对 heic-convert 的引用，所有转换逻辑在服务端处理

// 计算属性
const hasFiles = computed(() => files.value.length > 0)
const hasResults = computed(() => convertResults.value.length > 0)
const canConvert = computed(() => hasFiles.value && !isConverting.value)

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
        // 准备FormData，直接发送HEIC文件到服务端处理
        const formData = new FormData()
        formData.append('file', file)
        
        // 构建查询参数
        const queryParams = new URLSearchParams({
          format: convertOptions.value.format,
          quality: convertOptions.value.quality.toString()
        })
        
        if (convertOptions.value.width) {
          queryParams.append('width', convertOptions.value.width.toString())
        }
        if (convertOptions.value.height) {
          queryParams.append('height', convertOptions.value.height.toString())
        }
        
        // 直接调用服务端API进行转换
        const response = await fetch(`/api/convert-heic?${queryParams.toString()}`, {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`转换失败: ${response.status} ${errorText}`)
        }
        
        // 获取转换后的文件数据
        const convertedBlob = await response.blob()
        
        // 获取响应头中的文件信息
        const originalWidth = response.headers.get('X-Original-Width') || '0'
        const originalHeight = response.headers.get('X-Original-Height') || '0'
        const originalSize = response.headers.get('X-Original-Size') || '0'
        const processedWidth = response.headers.get('X-Processed-Width') || '0'
        const processedHeight = response.headers.get('X-Processed-Height') || '0'
        const processedFilename = response.headers.get('X-Processed-Filename') || `converted.${convertOptions.value.format}`
        
        // 创建下载URL
        const downloadUrl = URL.createObjectURL(convertedBlob)
        
        const result: ConvertResult = {
          originalFile: file,
          convertedBlob,
          downloadUrl,
          filename: processedFilename,
          originalSize: parseInt(originalSize),
          convertedSize: convertedBlob.size,
          compressionRatio: Math.round((1 - convertedBlob.size / parseInt(originalSize)) * 100),
          originalDimensions: {
            width: parseInt(originalWidth),
            height: parseInt(originalHeight)
          },
          convertedDimensions: {
            width: parseInt(processedWidth),
            height: parseInt(processedHeight)
          }
        }
        
        results.push(result)
        
      } catch (fileError) {
        console.error(`❌ 文件 ${file.name} 转换失败:`, fileError)
        convertError.value = `文件 ${file.name} 转换失败: ${fileError.message}`
        break
      }
    }
    
    convertResults.value = results
    progress.value = 100
    
  } catch (error) {
    console.error('❌ 转换过程出错:', error)
    convertError.value = error instanceof Error ? error.message : '转换过程中发生未知错误'
  } finally {
    isConverting.value = false
  }
}


// 下载文件
const downloadFile = (result: ConvertResult) => {
  const a = document.createElement('a')
  a.href = result.downloadUrl
  a.download = result.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
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

<!-- 非 scoped 样式 - 用于深色模式支持 -->
<!-- 使用 html.dark 提高特异性 (0,2,0) -->
<style>
html.dark .heic-converter .core-feature-section,
html.dark .heic-converter .file-list-section,
html.dark .heic-converter .convert-section,
html.dark .heic-converter .results-section,
html.dark .heic-converter .instructions-section,
html.dark .heic-converter .progress-panel {
  border-color: #1e293b !important;
  background: rgba(2, 6, 23, 0.82) !important;
}

html.dark .heic-converter .enhanced-upload-zone {
  background: rgba(15, 23, 42, 0.78) !important;
  border-color: #334155 !important;
}

html.dark .heic-converter .enhanced-upload-zone:hover,
html.dark .heic-converter .enhanced-upload-zone.drag-over {
  border-color: #2dd4bf !important;
  background: rgba(15, 23, 42, 0.92) !important;
}

html.dark .heic-converter .file-item,
html.dark .heic-converter .instruction-item,
html.dark .heic-converter .file-item-icon,
html.dark .heic-converter .upload-icon-core {
  background: rgba(15, 23, 42, 0.75) !important;
  border-color: #1e293b !important;
}

html.dark .heic-converter #image-quality,
html.dark .heic-converter #image-quality::-moz-range-track {
  background: #1e293b !important;
}

html.dark .heic-converter #image-quality::-webkit-slider-thumb,
html.dark .heic-converter #image-quality::-moz-range-thumb {
  background: #f8fafc !important;
}
</style>



<style scoped>
.heic-converter {
  @apply mx-auto max-w-6xl px-4 py-8;
}

#image-quality {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: #e2e8f0;
  border-radius: 9999px;
  outline: none;
  cursor: pointer;
}

#image-quality::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #0f172a;
  border-radius: 9999px;
  cursor: pointer;
}

#image-quality::-moz-range-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 9999px;
  border: none;
}

#image-quality::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #0f172a;
  border-radius: 9999px;
  cursor: pointer;
  border: none;
}

.core-feature-section,
.file-list-section,
.convert-section,
.results-section,
.instructions-section {
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
.file-item-icon {
  @apply flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800;
}

.upload-icon-core {
  @apply h-16 w-16 rounded-full;
}

.file-item-icon {
  @apply h-12 w-12;
}

.upload-support-pill {
  @apply flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900;
}

.file-item,
.instruction-item,
.progress-panel {
  @apply rounded-[22px] border border-slate-200 bg-slate-50 p-4 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/70;
}

.file-item:hover,
.instruction-item:hover {
  @apply border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900;
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

.instructions-section .instruction-item {
  @apply flex items-start space-x-4;
}

.instruction-icon {
  @apply mt-1 h-6 w-6 flex-shrink-0 text-teal-700 dark:text-teal-300;
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

.interactive-element {
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .heic-converter {
    @apply px-2 py-4;
  }

  .core-feature-section,
  .file-list-section,
  .convert-section,
  .results-section,
  .instructions-section {
    @apply mb-6 p-4;
  }

  .section-title {
    @apply text-2xl;
  }

  .convert-button {
    @apply px-6 py-3 text-base;
  }
}
</style>
