<template>
  <div class="heic-converter fade-in-up" itemscope itemtype="https://schema.org/SoftwareApplication">
    <!-- Skip to main content link -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
      {{ $t('common.skipToMainContent') }}
    </a>

    <!-- 文件上传区域 -->
    <section id="main-content" class="core-feature-section" role="region" aria-labelledby="upload-title">
      <header class="text-center mb-8">
         <h1 id="upload-title" class="section-title flex items-center justify-center gap-3 text-center" itemprop="name">
           <Icon name="heroicons:cloud-arrow-up" class="text-3xl" aria-hidden="true" />
           {{ $t('heicConverter.title') }}
         </h1>
         <p class="section-subtitle text-center" itemprop="description">{{ $t('heicConverter.subtitle') || '快速、安全、免费的HEIC图片转换工具' }}</p>
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
          class="enhanced-upload-zone group"
          :class="{ 'drag-over': isDragging }"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver"
          @drop="handleDrop"
          role="button"
          tabindex="0"
          :aria-label="$t('heicConverter.dragText')"
          aria-describedby="upload-instructions file-support-info"
          @keydown.enter="fileInput?.click()"
          @keydown.space.prevent="fileInput?.click()"
        >
          <!-- 优化后的上传区域布局 - 减少高度 -->
          <div class="flex flex-col items-center justify-center space-y-4 py-6">
            <!-- 主图标区域 - 缩小尺寸 -->
            <div class="relative flex items-center justify-center w-24 h-24" role="img" aria-label="{{ $t('heicConverter.uploadIcon') }}">
              <!-- 背景光晕效果 -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" aria-hidden="true"></div>
              <!-- 主图标 -->
              <div class="relative z-10 p-4 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Icon name="heroicons:photo" class="w-8 h-8 text-blue-500 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110" aria-hidden="true" />
              </div>
              <!-- 装饰性圆环 -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-dashed border-blue-200 rounded-full opacity-30 group-hover:opacity-60 group-hover:border-blue-300 transition-all duration-300 group-hover:scale-105" aria-hidden="true"></div>
            </div>
            
            <!-- 文字内容区域 - 减少间距 -->
            <div id="upload-instructions" class="text-center space-y-3 max-w-md">
              <!-- 主要提示文字 -->
              <div class="space-y-1">
                <p class="text-xl font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                  {{ $t('heicConverter.dragText') }}
                </p>
                <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {{ $t('heicConverter.batchUploadText') }}
                </p>
              </div>
              
              <!-- 选择文件按钮 -->
              <div class="flex justify-center pt-2">
                <label class="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-95 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                  <!-- 按钮光效 -->
                  <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" aria-hidden="true"></div>
                  <!-- 按钮内容 -->
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
                    @change="handleFileSelect"
                    aria-describedby="file-support-info"
                    :aria-label="$t('heicConverter.selectFileAriaLabel')"
                  >
                </label>
              </div>
            </div>
            
            <!-- 支持信息 - 缩小尺寸 -->
            <div class="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-full border border-green-100 dark:border-green-800">
              <Icon name="heroicons:shield-check" class="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
              <p id="file-support-info" class="text-xs font-medium text-green-700 dark:text-green-300">
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
            <Icon name="heroicons:document-duplicate" class="text-blue-600 dark:text-blue-400" aria-hidden="true" />
            {{ $t('heicConverter.selectedFiles') }}
            <span class="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-medium px-2.5 py-0.5 rounded-full" aria-label="{{ files.length }} {{ $t('heicConverter.filesSelected') }}">{{ files.length }}</span>
          </h2>
          <button 
            @click="clearFiles"
            class="btn-secondary text-sm"
            :aria-label="$t('common.clearAll') + ' (' + files.length + ' ' + $t('heicConverter.files') + ')'"
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
              <div class="relative">
                <Icon name="heroicons:photo" class="text-2xl text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" aria-hidden="true" />
                <div class="absolute -inset-1 bg-blue-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors" :title="file.name">{{ file.name }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <button 
              @click="removeFile(index)"
              class="interactive-element p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="$t('common.removeFile') + ' ' + file.name"
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
              :aria-label="`图片质量: ${convertOptions.quality}%`"
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
          <div v-if="isConverting" id="conversion-progress" class="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200 dark:border-blue-800" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :aria-label="$t('heicConverter.progressLabel', { progress })">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">{{ $t('heicConverter.convertProgress') }}</span>
              <span class="text-lg font-bold text-blue-600 dark:text-blue-400" aria-live="polite">{{ progress }}%</span>
            </div>
            <div class="enhanced-progress">
              <div 
                class="enhanced-progress-fill"
                :style="{ width: `${progress}%` }"
              ></div>
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
            class="file-item group flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700"
          >
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div class="relative">
                <Icon name="heroicons:photo" class="text-2xl text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" aria-hidden="true" />
                <div class="absolute -inset-1 bg-green-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-green-900 dark:group-hover:text-green-300 transition-colors" :title="result.filename">
                  {{ result.filename }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {{ formatFileSize(result.convertedBlob.size) }}
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
        <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-3">
          <Icon name="heroicons:information-circle" class="text-2xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
        </div>
        <h3 class="text-xl font-bold text-blue-900 dark:text-blue-300">
          {{ $t('heicConverter.instructions.title') }}
        </h3>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="instruction-item bg-white/60 dark:bg-gray-800/60 rounded-lg border border-blue-100 dark:border-blue-900">
          <Icon name="heroicons:check-circle" class="instruction-icon text-green-500 dark:text-green-400" aria-hidden="true" />
          <p class="text-blue-800 dark:text-blue-300 font-medium">
            {{ $t('heicConverter.instructions.support') }}
          </p>
        </div>
        <div class="instruction-item bg-white/60 dark:bg-gray-800/60 rounded-lg border border-blue-100 dark:border-blue-900">
           <Icon name="heroicons:shield-check" class="instruction-icon text-green-500 dark:text-green-400" aria-hidden="true" />
           <p class="text-blue-800 dark:text-blue-300 font-medium">
             {{ $t('heicConverter.instructions.privacy') }}
           </p>
         </div>
         <div class="instruction-item bg-white/60 dark:bg-gray-800/60 rounded-lg border border-blue-100 dark:border-blue-900">
           <Icon name="heroicons:squares-plus" class="instruction-icon text-green-500 dark:text-green-400" aria-hidden="true" />
           <p class="text-blue-800 dark:text-blue-300 font-medium">
             {{ $t('heicConverter.instructions.batch') }}
           </p>
         </div>
         <div class="instruction-item bg-white/60 dark:bg-gray-800/60 rounded-lg border border-blue-100 dark:border-blue-900">
           <Icon name="heroicons:photo" class="instruction-icon text-green-500 dark:text-green-400" aria-hidden="true" />
           <p class="text-blue-800 dark:text-blue-300 font-medium">
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
        const processedSize = response.headers.get('X-Processed-Size') || '0'
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
<style>
/* 深色模式支持 - 必须在非 scoped 样式中才能正常工作 */
:root.dark .heic-converter .core-feature-section {
  background: linear-gradient(to bottom right, #1f2937, rgba(30, 58, 138, 0.3), rgba(88, 28, 135, 0.3));
  border-color: #374151;
}

:root.dark .heic-converter .section-subtitle {
  color: #9ca3af;
}

:root.dark .heic-converter .enhanced-upload-zone {
  background: linear-gradient(135deg, #1f2937 0%, #111827 50%, #1e293b 100%);
  border-color: #374151;
}

:root.dark .heic-converter .enhanced-upload-zone:hover {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #1e3a5f 0%, #1e3a8a 50%, #312e81 100%);
}

:root.dark .heic-converter .enhanced-upload-zone.drag-over {
  border-color: #60a5fa;
  background: linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%);
}

:root.dark .heic-converter .file-list-section {
  background: linear-gradient(to right, #1f2937, rgba(30, 58, 138, 0.3));
  border-color: #374151;
}

:root.dark .heic-converter .file-item {
  background-color: #1f2937;
  border-color: #374151;
}

:root.dark .heic-converter .file-item:hover {
  border-color: #2563eb;
  background-color: rgba(30, 58, 138, 0.3);
}

:root.dark .heic-converter .convert-section {
  background: linear-gradient(to bottom right, rgba(30, 58, 138, 0.3), #1f2937, rgba(88, 28, 135, 0.3));
  border-color: #1e40af;
}

:root.dark .heic-converter .results-section {
  background: linear-gradient(to bottom right, rgba(20, 83, 45, 0.3), #1f2937, rgba(30, 58, 138, 0.3));
  border-color: #166534;
}

:root.dark .heic-converter .instructions-section {
  background: linear-gradient(to bottom right, rgba(49, 46, 129, 0.3), #1f2937, rgba(88, 28, 135, 0.3));
  border-color: #3730a3;
}

:root.dark .heic-converter .instruction-item:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

:root.dark .heic-converter .instruction-icon {
  color: #60a5fa;
}

:root.dark .heic-converter .enhanced-progress {
  background-color: #374151;
}

:root.dark .heic-converter #image-quality {
  background: #374151;
}

:root.dark .heic-converter #image-quality::-moz-range-track {
  background: #374151;
}
</style>

<style scoped>
/* HEIC转换器专用样式 */
.heic-converter {
  @apply max-w-6xl mx-auto px-4 py-8;
}

/* 质量拖动条专用样式 */
#image-quality {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}

#image-quality::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

#image-quality::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

#image-quality::-moz-range-track {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  border: none;
}

#image-quality::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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