<template>
  <div class="image-compressor fade-in-up" itemscope itemtype="https://schema.org/SoftwareApplication">
    <!-- 文件上传区域 -->
    <section class="core-feature-section" role="region" aria-labelledby="upload-title">
      <div class="text-center mb-8">
         <h2 id="upload-title" class="section-title flex items-center justify-center gap-3 text-center" itemprop="name">
           <Icon name="heroicons:photo" class="text-3xl" aria-hidden="true" />
           {{ $t('imageCompressor.title') }}
         </h2>
         <p class="section-subtitle text-center" itemprop="description">{{ $t('imageCompressor.subtitle') }}</p>
         <!-- 隐藏的结构化数据 -->
         <meta itemprop="applicationCategory" content="ImageCompressor">
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
          :aria-label="$t('imageCompressor.dragText')"
          @keydown.enter="fileInput?.click()"
          @keydown.space.prevent="fileInput?.click()"
        >
          <!-- 优化后的上传区域布局 -->
          <div class="flex flex-col items-center justify-center space-y-8 py-4">
            <!-- 主图标区域 -->
            <div class="relative flex items-center justify-center w-40 h-40">
              <!-- 背景光晕效果 -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
              <!-- 主图标 -->
              <div class="relative z-10 p-6 rounded-full bg-gradient-to-br from-green-50 to-blue-50 group-hover:from-green-100 group-hover:to-blue-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Icon name="heroicons:arrow-down-tray" class="w-16 h-16 text-green-500 group-hover:text-green-600 transition-all duration-300 group-hover:scale-110" aria-hidden="true" />
              </div>
              <!-- 装饰性圆环 -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-green-200 rounded-full opacity-30 group-hover:opacity-60 group-hover:border-green-300 transition-all duration-300 group-hover:scale-105"></div>
            </div>
            
            <!-- 文字内容区域 -->
            <div class="text-center space-y-6 max-w-md">
              <!-- 主要提示文字 -->
              <div class="space-y-2">
                <p class="text-2xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {{ $t('imageCompressor.dragText') }}
                </p>
                <p class="text-gray-500 text-base leading-relaxed">
                  {{ $t('imageCompressor.batchUploadText') }}
                </p>
              </div>
              
              <!-- 选择文件按钮 -->
              <div class="flex justify-center">
                <label class="group/btn relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-95">
                  <!-- 按钮光效 -->
                  <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  <!-- 按钮内容 -->
                  <div class="relative flex items-center gap-3 text-lg">
                    <Icon name="heroicons:folder-open" class="w-6 h-6" aria-hidden="true" />
                    <span>{{ $t('imageCompressor.selectFile') }}</span>
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
            
            <!-- 支持信息 -->
            <div class="flex items-center justify-center gap-3 px-6 py-3 bg-green-50 rounded-full border border-green-100">
              <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-600" aria-hidden="true" />
              <p id="file-support-info" class="text-sm font-medium text-green-700">
                {{ $t('imageCompressor.supportInfo') }}
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
                  {{ $t('imageCompressor.loading') }}
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
            <Icon name="heroicons:document-duplicate" class="text-green-600" aria-hidden="true" />
            {{ $t('imageCompressor.selectedFiles') }}
            <span class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{{ files.length }}</span>
          </h3>
          <button 
            @click="clearFiles"
            class="btn-secondary text-sm"
            :aria-label="$t('common.clearAll') + ' (' + files.length + $t('imageCompressor.files') + ')'"
          >
            <Icon name="heroicons:trash" class="mr-2" aria-hidden="true" />
            {{ $t('imageCompressor.clearAll') }}
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
                <Icon name="heroicons:photo" class="text-2xl text-green-600 group-hover:text-green-700 transition-colors" aria-hidden="true" />
                <div class="absolute -inset-1 bg-green-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-gray-900 truncate group-hover:text-green-900 transition-colors" :title="file.name">{{ file.name }}</p>
                <p class="text-xs text-gray-600 font-medium">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <button 
              @click="removeFile(index)"
              class="interactive-element p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              :aria-label="$t('common.removeFile') + ' ' + file.name"
            >
              <Icon name="heroicons:x-mark" class="text-lg" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </ClientOnly>

    <!-- 压缩设置 -->
    <ClientOnly>
      <section v-if="hasFiles" class="bg-white rounded-lg shadow-sm border p-6" role="region" aria-labelledby="settings-title">
        <div class="flex items-center justify-between mb-4">
          <h3 id="settings-title" class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="heroicons:cog-6-tooth" aria-hidden="true" />
            {{ $t('imageCompressor.compressionSettings') }}
          </h3>
          <div class="text-sm text-gray-600">
            {{ $t('imageCompressor.totalSize') }}: 
            <span class="font-semibold text-gray-900">{{ formatFileSize(files.reduce((sum, file) => sum + file.size, 0)) }}</span>
          </div>
        </div>
        
        <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 文件大小限制 -->
          <div>
            <label for="max-size" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('imageCompressor.maxFileSize') }}: {{ compressionOptions.maxSizeMB || $t('imageCompressor.noLimit') }}
              <span v-if="hasFiles" class="text-xs text-gray-500 ml-2">
                ({{ $t('imageCompressor.basedOnFileSize') }})
              </span>
            </label>
          </div>

          <!-- 图片质量 -->
          <div>
            <label for="image-quality" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('imageCompressor.imageQuality') }}: {{ compressionOptions.quality }}%
            </label>
            <input 
              id="image-quality"
              v-model.number="compressionOptions.quality"
              type="range" 
              min="10" 
              max="100" 
              step="5"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              :aria-label="$t('imageCompressor.qualityAriaLabel', { quality: compressionOptions.quality })"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>{{ $t('imageCompressor.lowQuality') }}</span>
              <span>{{ $t('imageCompressor.highQuality') }}</span>
            </div>
          </div>

          <!-- 输出格式 -->
          <div>
            <label for="output-format" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('imageCompressor.outputFormat') }}
            </label>
            <select 
              id="output-format"
              v-model="compressionOptions.format"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="jpeg">JPEG (.jpg)</option>
              <option value="png">PNG (.png)</option>
              <option value="webp">WebP (.webp)</option>
              <option value="avif">AVIF (.avif)</option>
            </select>
          </div>

          <!-- 最大宽度 -->
          <div>
            <label for="max-width" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('imageCompressor.maxWidth') }}
            </label>
            <input 
              id="max-width"
              v-model.number="compressionOptions.maxWidth"
              type="number"
              min="100"
              max="4096"
              :placeholder="$t('imageCompressor.noLimit')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
          </div>

          <!-- 最大高度 -->
          <div>
            <label for="max-height" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('imageCompressor.maxHeight') }}
            </label>
            <input 
              id="max-height"
              v-model.number="compressionOptions.maxHeight"
              type="number"
              min="100"
              max="4096"
              :placeholder="$t('imageCompressor.noLimit')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
          </div>

          <!-- 最大文件大小 -->
          <div>
            <label for="max-size-mb" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('imageCompressor.maxSizeMB') }}
            </label>
            <input 
              id="max-size-mb"
              v-model.number="compressionOptions.maxSizeMB"
              type="number"
              min="0.1"
              max="50"
              step="0.1"
              :placeholder="$t('imageCompressor.noLimit')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
          </div>
          </form>
          
          <!-- 压缩预估 -->
          <div v-if="hasFiles" class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <h4 class="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Icon name="heroicons:calculator" class="text-blue-600" aria-hidden="true" />
              {{ $t('imageCompressor.compressionEstimate') }}
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">{{ $t('imageCompressor.estimatedSize') }}:</span>
                <span class="font-semibold text-blue-700 ml-1">{{ formatFileSize(compressionEstimate.estimatedSize) }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ $t('imageCompressor.estimatedSavings') }}:</span>
                <span class="font-semibold text-green-700 ml-1">{{ Math.round(compressionEstimate.estimatedSavings) }}%</span>
              </div>
            </div>
          </div>
      </section>
    </ClientOnly>

    <!-- 压缩按钮和进度 -->
    <ClientOnly>
      <section v-if="hasFiles" class="compress-section slide-up" role="region" aria-labelledby="compress-section">
        <div class="text-center mb-6">
          <h3 id="compress-section" class="section-title flex items-center justify-center gap-3">
            <Icon name="heroicons:arrow-down-tray" class="text-2xl" aria-hidden="true" />
            {{ $t('imageCompressor.compress') }}
          </h3>
          <p class="section-subtitle">{{ $t('imageCompressor.compressDescription') }}</p>
        </div>
        
        <div class="space-y-6">
          <!-- 压缩按钮 -->
          <button 
            @click="startCompression"
            :disabled="!canCompress"
            class="compress-button w-full flex items-center justify-center gap-3"
            :aria-label="isCompressing ? $t('imageCompressor.compressing') : $t('imageCompressor.startCompress') + ' ' + files.length + ' ' + $t('imageCompressor.files')"
          >
            <Icon 
              :name="isCompressing ? 'heroicons:arrow-path' : 'heroicons:arrow-down-tray'" 
              :class="{ 'animate-spin': isCompressing }"
              class="text-2xl"
              aria-hidden="true"
            />
            {{ isCompressing ? $t('imageCompressor.compressing') : `${$t('imageCompressor.startCompress')} (${files.length} ${$t('imageCompressor.files', files.length)})` }}
          </button>

          <!-- 进度条 -->
          <div v-if="isCompressing" class="space-y-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200" role="progressbar" :aria-valuenow="progress.percentage" aria-valuemin="0" aria-valuemax="100">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-700">{{ $t('imageCompressor.compressProgress') }}</span>
              <span class="text-lg font-bold text-green-600" aria-live="polite">{{ progress.percentage }}%</span>
            </div>
            <div class="enhanced-progress">
              <div 
                class="enhanced-progress-fill"
                :style="{ width: `${progress.percentage}%` }"
              ></div>
            </div>
            <p class="text-center text-sm text-gray-600 font-medium">
              {{ $t('imageCompressor.processingFile') }}: {{ progress.currentFileName }}
            </p>
          </div>

          <!-- 压缩错误 -->
          <div v-if="compressionError" class="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
            <div class="flex items-start gap-3">
              <Icon name="heroicons:exclamation-triangle" class="text-red-500 text-xl flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 class="text-red-800 font-semibold mb-1">{{ $t('imageCompressor.compressionError') }}</h4>
                <p class="text-red-700 text-sm">{{ compressionError }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>

    <!-- 压缩结果 -->
    <ClientOnly>
      <div v-if="hasResults" class="results-section slide-up">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Icon name="heroicons:check-circle" class="text-3xl text-green-600" aria-hidden="true" />
          </div>
          <h3 class="text-2xl font-bold text-green-800 mb-2">
            {{ $t('imageCompressor.compressionComplete') }}
          </h3>
          <p class="text-gray-600">{{ $t('imageCompressor.compressionCompleteDesc', { count: compressionResults.length }) }}</p>
          
          <!-- 压缩统计 -->
          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div class="bg-blue-50 rounded-lg p-4">
              <p class="text-sm text-blue-600 font-medium">{{ $t('imageCompressor.originalSize') }}</p>
              <p class="text-lg font-bold text-blue-800">{{ formatFileSize(compressionStats.originalTotalSize) }}</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <p class="text-sm text-green-600 font-medium">{{ $t('imageCompressor.compressedSize') }}</p>
              <p class="text-lg font-bold text-green-800">{{ formatFileSize(compressionStats.compressedTotalSize) }}</p>
            </div>
            <div class="bg-purple-50 rounded-lg p-4">
              <p class="text-sm text-purple-600 font-medium">{{ $t('imageCompressor.spaceSaved') }}</p>
              <p class="text-lg font-bold text-purple-800">{{ Math.round(compressionStats.averageCompressionRatio) }}%</p>
            </div>
          </div>
        </div>
        
        <!-- 结果预览 -->
        <div class="grid gap-6 mb-6">
          <div 
            v-for="(result, index) in compressionResults" 
            :key="index"
            class="result-item bg-white rounded-lg border border-green-200 p-4"
          >
            <div class="flex flex-col lg:flex-row gap-6">
              <!-- 图片对比 -->
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 原始图片 -->
                <div class="space-y-2">
                  <h4 class="text-sm font-medium text-gray-700">{{ $t('imageCompressor.original') }}</h4>
                  <div class="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                    <img 
                      :src="result.originalUrl" 
                      :alt="result.originalFile.name"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    >
                  </div>
                  <p class="text-xs text-gray-500">{{ formatFileSize(result.originalSize) }}</p>
                </div>
                
                <!-- 压缩后图片 -->
                <div class="space-y-2">
                  <h4 class="text-sm font-medium text-gray-700">{{ $t('imageCompressor.compressed') }}</h4>
                  <div class="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                    <img 
                      :src="result.compressedUrl" 
                      :alt="result.filename"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    >
                  </div>
                  <p class="text-xs text-gray-500">{{ formatFileSize(result.compressedSize) }}</p>
                </div>
              </div>
              
              <!-- 文件信息和下载 -->
              <div class="lg:w-64 space-y-4">
                <div>
                  <h4 class="font-semibold text-gray-900 truncate" :title="result.filename">{{ result.filename }}</h4>
                  <p class="text-sm text-green-600 font-medium">
                    {{ $t('imageCompressor.compressionRatio') }}: {{ Math.round(result.compressionRatio) }}%
                  </p>
                </div>
                
                <button 
                  @click="downloadCompressedFile(result)"
                  class="download-button w-full text-sm"
                >
                  <Icon name="heroicons:arrow-down-tray" class="mr-2" aria-hidden="true" />
                  {{ $t('imageCompressor.download') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="downloadAll"
            class="download-button text-lg"
          >
            <Icon name="heroicons:arrow-down-tray" class="mr-2 text-xl" aria-hidden="true" />
            {{ $t('imageCompressor.downloadAll') }}
          </button>
          <button 
            @click="resetCompressor"
            class="btn-secondary text-lg py-3 px-6"
          >
            <Icon name="heroicons:trash" class="mr-2 text-xl" aria-hidden="true" />
            {{ $t('imageCompressor.restart') }}
          </button>
        </div>
      </div>
    </ClientOnly>

    <!-- 使用说明 -->
    <div class="instructions-section slide-up">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
          <Icon name="heroicons:information-circle" class="text-2xl text-green-600" aria-hidden="true" />
        </div>
        <h3 class="text-xl font-bold text-green-900">
          {{ $t('imageCompressor.instructions.title') }}
        </h3>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="instruction-item bg-white/60 rounded-lg border border-green-100">
          <Icon name="heroicons:check-circle" class="instruction-icon text-green-500" aria-hidden="true" />
          <p class="text-green-800 font-medium">
            {{ $t('imageCompressor.instructions.support') }}
          </p>
        </div>
        <div class="instruction-item bg-white/60 rounded-lg border border-green-100">
           <Icon name="heroicons:shield-check" class="instruction-icon text-green-500" aria-hidden="true" />
           <p class="text-green-800 font-medium">
             {{ $t('imageCompressor.instructions.privacy') }}
           </p>
         </div>
         <div class="instruction-item bg-white/60 rounded-lg border border-green-100">
           <Icon name="heroicons:squares-plus" class="instruction-icon text-green-500" aria-hidden="true" />
           <p class="text-green-800 font-medium">
             {{ $t('imageCompressor.instructions.batch') }}
           </p>
         </div>
         <div class="instruction-item bg-white/60 rounded-lg border border-green-100">
           <Icon name="heroicons:arrow-down-tray" class="instruction-icon text-green-500" aria-hidden="true" />
           <p class="text-green-800 font-medium">
             {{ $t('imageCompressor.instructions.compression') }}
           </p>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed, watch } from 'vue'

const { t } = useI18n()

// 模板引用
const fileInput = ref<HTMLInputElement>()

// 页面SEO设置
useHead({
  title: () => t('imageCompressor.meta.title'),
  meta: [
    { name: 'description', content: () => t('imageCompressor.meta.description') },
    { name: 'keywords', content: () => t('imageCompressor.meta.keywords') }
  ]
})

// 压缩选项接口
interface CompressionOptions {
  quality: number
  format: 'jpeg' | 'png' | 'webp' | 'avif'
  maxWidth?: number
  maxHeight?: number
  maxSizeMB?: number
}

// 压缩结果接口
interface CompressionResult {
  originalFile: File
  originalUrl: string
  compressedBlob: Blob
  compressedUrl: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
  filename: string
  originalWidth: number
  originalHeight: number
  compressedWidth: number
  compressedHeight: number
}

// 进度接口
interface CompressionProgress {
  current: number
  total: number
  percentage: number
  currentFileName: string
}

// 默认状态
const defaultDragDrop = {
  isDragging: ref(false),
  files: ref([]),
  error: ref(null),
  handleDragEnter: () => {},
  handleDragLeave: () => {},
  handleDragOver: () => {},
  handleDrop: () => {},
  handleFileSelect: () => {},
  removeFile: () => {},
  clearFiles: () => {},
  formatFileSize: (size: number) => {
    if (size === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(size) / Math.log(k))
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// 引入拖拽组合式函数
const dragDropComposable = process.client ? useDragDrop({
  accept: ['image/*'],
  maxFiles: 20,
  maxSize: 100 * 1024 * 1024 // 100MB
}) : null

// 解构拖拽组合函数返回值
const { 
  isDragging, 
  files, 
  error: dragError,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  handleFileSelect,
  removeFile,
  clearFiles,
  formatFileSize
} = dragDropComposable || defaultDragDrop

// 压缩状态
const isCompressing = ref(false)
const progress = ref<CompressionProgress>({
  current: 0,
  total: 0,
  percentage: 0,
  currentFileName: ''
})
const compressionError = ref<string | null>(null)

// 压缩设置
const compressionOptions = ref<CompressionOptions>({
  quality: 75,
  format: 'jpeg',
  maxWidth: undefined,
  maxHeight: undefined,
  maxSizeMB: undefined
})

// 压缩结果
const compressionResults = ref<CompressionResult[]>([])

// 计算属性
const hasFiles = computed(() => files.value.length > 0)
const hasResults = computed(() => compressionResults.value.length > 0)
const canCompress = computed(() => hasFiles.value && !isCompressing.value)

// 高精度压缩预估算法
const compressionEstimate = computed(() => {
  if (!hasFiles.value) {
    return { estimatedSize: 0, estimatedSavings: 0 }
  }
  
  let totalEstimatedSize = 0
  const totalOriginalSize = files.value.reduce((sum, file) => sum + file.size, 0)
  
  // 为每个文件单独计算预估大小
  for (const file of files.value) {
    const estimatedFileSize = calculateAdvancedCompression(file)
    totalEstimatedSize += estimatedFileSize
  }
  
  const estimatedSavings = ((totalOriginalSize - totalEstimatedSize) / totalOriginalSize) * 100
  
  return {
    estimatedSize: Math.max(totalEstimatedSize, 0),
    estimatedSavings: Math.max(estimatedSavings, 0)
  }
})

// 高级压缩预估算法
const calculateAdvancedCompression = (file: File): number => {
  const targetFormat = compressionOptions.value.format
  const quality = compressionOptions.value.quality
  const originalFormat = file.type.split('/')[1]?.toLowerCase()
  const fileSize = file.size
  
  // 1. 图像复杂度分析（基于文件大小和格式推断）
  const complexity = analyzeImageComplexity(file, originalFormat)
  
  // 2. 格式转换效率矩阵
  const formatEfficiency = getFormatConversionEfficiency(originalFormat, targetFormat)
  
  // 3. 质量-压缩率非线性映射
  const qualityCompressionCurve = getQualityCompressionCurve(targetFormat, quality, complexity)
  
  // 4. 文件大小影响因子（大文件通常压缩率更高）
  const sizeInfluenceFactor = getSizeInfluenceFactor(fileSize)
  
  // 5. 动态校正因子（基于历史数据学习）
  const dynamicCorrection = getDynamicCorrectionFactor(targetFormat, quality, complexity)
  
  // 6. 综合计算压缩率
  let compressionRatio = formatEfficiency * qualityCompressionCurve * sizeInfluenceFactor * dynamicCorrection
  
  // 7. 尺寸调整影响
  const { maxWidth, maxHeight } = compressionOptions.value
  if (maxWidth || maxHeight) {
    const dimensionReduction = estimateDimensionReduction(fileSize, maxWidth, maxHeight)
    compressionRatio *= dimensionReduction
  }
  
  // 8. 最大文件大小限制
  let estimatedSize = fileSize * compressionRatio
  if (compressionOptions.value.maxSizeMB) {
    const maxSizeBytes = compressionOptions.value.maxSizeMB * 1024 * 1024
    estimatedSize = Math.min(estimatedSize, maxSizeBytes)
  }
  
  return Math.max(estimatedSize, fileSize * 0.01) // 最小压缩到1%
}

// 图像复杂度分析
const analyzeImageComplexity = (file: File, format: string): number => {
  // 基于文件大小和格式推断复杂度
  const sizePerPixelEstimate = {
    'jpeg': 0.5,   // JPEG已压缩
    'png': 3.0,    // PNG无损，大小反映复杂度
    'webp': 0.7,   // WebP中等压缩
    'bmp': 4.0,    // BMP无压缩
    'tiff': 3.5,   // TIFF通常无损
    'heic': 0.3,   // HEIC高度压缩
    'avif': 0.4    // AVIF高度压缩
  }
  
  const bytesPerPixelBase = sizePerPixelEstimate[format] || 1.0
  const estimatedPixels = file.size / bytesPerPixelBase
  
  // 复杂度评分 (0.1-2.0)
  if (estimatedPixels > 8000000) return 1.8      // 高分辨率，高复杂度
  if (estimatedPixels > 2000000) return 1.4      // 中高分辨率
  if (estimatedPixels > 500000) return 1.0       // 标准分辨率
  if (estimatedPixels > 100000) return 0.7       // 低分辨率
  return 0.4                                      // 很低分辨率
}

// 格式转换效率矩阵
const getFormatConversionEfficiency = (from: string, to: string): number => {
  const conversionMatrix = {
    // 从JPEG转换
    'jpeg': {
      'jpeg': 0.85,   // JPEG重压缩，效果有限
      'webp': 0.75,   // JPEG到WebP有一定优势
      'avif': 0.65,   // JPEG到AVIF优势明显
      'png': 1.3      // JPEG到PNG会增大
    },
    // 从PNG转换
    'png': {
      'jpeg': 0.25,   // PNG到JPEG压缩效果显著
      'webp': 0.35,   // PNG到WebP效果很好
      'avif': 0.28,   // PNG到AVIF效果最好
      'png': 0.95     // PNG优化
    },
    // 从WebP转换
    'webp': {
      'jpeg': 1.1,    // WebP到JPEG可能略增大
      'webp': 0.9,    // WebP重压缩
      'avif': 0.8,    // WebP到AVIF有优势
      'png': 1.5      // WebP到PNG增大
    },
    // 从HEIC转换
    'heic': {
      'jpeg': 1.2,    // HEIC已高度压缩
      'webp': 1.0,    // HEIC到WebP
      'avif': 0.9,    // HEIC到AVIF
      'png': 2.0      // HEIC到PNG大幅增大
    }
  }
  
  return conversionMatrix[from]?.[to] || 0.7
}

// 质量-压缩率非线性曲线
const getQualityCompressionCurve = (format: string, quality: number, complexity: number): number => {
  const q = quality / 100
  
  // 复杂度影响因子
  const complexityFactor = 0.7 + (complexity - 1.0) * 0.3
  
  let baseRatio
  if (format === 'jpeg') {
    // JPEG非线性压缩曲线
    baseRatio = 0.1 + 0.6 * Math.pow(q, 2.2)
  } else if (format === 'webp') {
    // WebP更高效的压缩曲线
    baseRatio = 0.08 + 0.5 * Math.pow(q, 2.5)
  } else if (format === 'avif') {
    // AVIF最高效的压缩曲线
    baseRatio = 0.06 + 0.4 * Math.pow(q, 2.8)
  } else if (format === 'png') {
    // PNG无损，质量影响很小
    baseRatio = 0.8 + 0.15 * q
  } else {
    baseRatio = 0.15 + 0.7 * Math.pow(q, 2.0)
  }
  
  return baseRatio * complexityFactor
}

// 文件大小影响因子
const getSizeInfluenceFactor = (fileSize: number): number => {
  // 大文件通常有更好的压缩率
  const sizeMB = fileSize / (1024 * 1024)
  
  if (sizeMB > 10) return 0.85      // 大文件压缩率更好
  if (sizeMB > 5) return 0.9        // 中大文件
  if (sizeMB > 1) return 0.95       // 中等文件
  if (sizeMB > 0.5) return 1.0      // 标准文件
  return 1.1                        // 小文件压缩率相对较差
}

// 尺寸缩放影响估算
const estimateDimensionReduction = (fileSize: number, maxWidth?: number, maxHeight?: number): number => {
  if (!maxWidth && !maxHeight) return 1.0
  
  // 基于文件大小估算原始尺寸
  const estimatedPixels = fileSize / 2 // 粗略估算
  const estimatedDimension = Math.sqrt(estimatedPixels)
  
  const targetDimension = Math.min(maxWidth || 4000, maxHeight || 4000)
  
  if (estimatedDimension <= targetDimension) return 1.0
  
  // 尺寸缩放比例的平方（面积缩放）
  const scaleFactor = targetDimension / estimatedDimension
  return Math.pow(scaleFactor, 1.8) // 略小于平方，考虑压缩效率
}

// 动态学习和反馈机制
const compressionHistory = ref<Array<{
  originalSize: number
  estimatedSize: number
  actualSize: number
  format: string
  quality: number
  complexity: number
  timestamp: number
}>>([])

// 从localStorage加载历史数据
const loadCompressionHistory = () => {
  try {
    const saved = localStorage.getItem('compression-history')
    if (saved) {
      compressionHistory.value = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Failed to load compression history:', error)
  }
}

// 保存历史数据到localStorage
const saveCompressionHistory = () => {
  try {
    // 只保留最近100条记录
    const recentHistory = compressionHistory.value.slice(-100)
    localStorage.setItem('compression-history', JSON.stringify(recentHistory))
  } catch (error) {
    console.warn('Failed to save compression history:', error)
  }
}

// 添加压缩结果到历史记录
const addCompressionResult = (originalFile: File, estimatedSize: number, actualSize: number) => {
  const originalFormat = originalFile.type.split('/')[1]?.toLowerCase()
  const complexity = analyzeImageComplexity(originalFile, originalFormat)
  
  compressionHistory.value.push({
    originalSize: originalFile.size,
    estimatedSize,
    actualSize,
    format: compressionOptions.value.format,
    quality: compressionOptions.value.quality,
    complexity,
    timestamp: Date.now()
  })
  
  saveCompressionHistory()
}

// 基于历史数据的动态校正因子
const getDynamicCorrectionFactor = (format: string, quality: number, complexity: number): number => {
  if (compressionHistory.value.length < 5) return 1.0 // 数据不足时不校正
  
  // 筛选相似的历史记录
  const similarRecords = compressionHistory.value.filter(record => {
    return Math.abs(record.quality - quality) <= 10 &&
           record.format === format &&
           Math.abs(record.complexity - complexity) <= 0.3
  })
  
  if (similarRecords.length < 3) return 1.0 // 相似记录不足
  
  // 计算预估准确性
  let totalError = 0
  let validRecords = 0
  
  similarRecords.forEach(record => {
    if (record.actualSize > 0 && record.estimatedSize > 0) {
      const error = (record.estimatedSize - record.actualSize) / record.actualSize
      totalError += error
      validRecords++
    }
  })
  
  if (validRecords === 0) return 1.0
  
  const avgError = totalError / validRecords
  
  // 计算校正因子（限制在0.5-2.0之间）
  const correctionFactor = 1 - avgError * 0.8 // 80%的校正强度
  return Math.max(0.5, Math.min(2.0, correctionFactor))
}

// 获取预估准确性统计
const getAccuracyStats = () => {
  if (compressionHistory.value.length === 0) return null
  
  const recentRecords = compressionHistory.value.slice(-20) // 最近20条记录
  let totalError = 0
  let validRecords = 0
  
  recentRecords.forEach(record => {
    if (record.actualSize > 0 && record.estimatedSize > 0) {
      const error = Math.abs(record.estimatedSize - record.actualSize) / record.actualSize
      totalError += error
      validRecords++
    }
  })
  
  if (validRecords === 0) return null
  
  const avgError = (totalError / validRecords) * 100
  return {
    averageError: avgError,
    recordCount: validRecords,
    accuracy: Math.max(0, 100 - avgError)
  }
}

// 压缩统计
const compressionStats = computed(() => {
  if (!hasResults.value) {
    return { originalTotalSize: 0, compressedTotalSize: 0, totalSavings: 0, averageCompressionRatio: 0 }
  }
  
  const originalTotalSize = compressionResults.value.reduce((sum, result) => sum + result.originalSize, 0)
  const compressedTotalSize = compressionResults.value.reduce((sum, result) => sum + result.compressedSize, 0)
  const totalSavings = ((originalTotalSize - compressedTotalSize) / originalTotalSize) * 100
  const averageCompressionRatio = compressionResults.value.reduce((sum, result) => sum + result.compressionRatio, 0) / compressionResults.value.length
  
  return {
    originalTotalSize,
    compressedTotalSize,
    totalSavings,
    averageCompressionRatio
  }
})

// HEIC文件处理函数
const processHeicFile = async (file: File): Promise<File> => {
  try {
    // 动态导入heic-convert，处理CommonJS模块
    const heicConvertModule = await import('heic-convert/browser')
    const heicConvert = heicConvertModule.default || heicConvertModule
    
    if (typeof heicConvert !== 'function') {
      throw new Error('heic-convert library not loaded correctly')
    }
    
    // 读取文件为ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // 使用heic-convert转换HEIC为JPEG
    const jpegBuffer = await heicConvert({
      buffer: uint8Array,
      format: 'JPEG',
      quality: 0.9
    })
    
    // 创建新的File对象
    const jpegBlob = new Blob([jpegBuffer], { type: 'image/jpeg' })
    const jpegFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
      type: 'image/jpeg',
      lastModified: file.lastModified
    })
    
    return jpegFile
  } catch (error) {
    console.error('HEIC转换失败:', error)
    
    // 尝试备用导入方式
    try {
      const fallbackModule = await import('heic-convert')
      const heicConvert = fallbackModule.default || fallbackModule
      
      if (typeof heicConvert === 'function') {
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        
        const jpegBuffer = await heicConvert({
          buffer: uint8Array,
          format: 'JPEG',
          quality: 0.9
        })
        
        const jpegBlob = new Blob([jpegBuffer], { type: 'image/jpeg' })
        const jpegFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg',
          lastModified: file.lastModified
        })
        
        return jpegFile
      }
    } catch (fallbackError) {
      console.error('HEIC备用转换也失败:', fallbackError)
    }
    
    throw new Error(`HEIC文件转换失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

// 检查是否为HEIC文件
const isHeicFile = (file: File): boolean => {
  return /\.(heic|heif)$/i.test(file.name) || 
         file.type === 'image/heic' || 
         file.type === 'image/heif'
}

// 使用新的服务端API处理单个图片
const compressImageWithAPI = async (file: File): Promise<CompressionResult> => {
  try {
    // 如果是HEIC文件，先在客户端转换
    let processedFile = file
    if (isHeicFile(file)) {
      processedFile = await processHeicFile(file)
    }
    
    // 创建FormData
    const formData = new FormData()
    formData.append('image', processedFile)
    formData.append('quality', compressionOptions.value.quality.toString())
    formData.append('format', compressionOptions.value.format)
    
    if (compressionOptions.value.maxWidth) {
      formData.append('maxWidth', compressionOptions.value.maxWidth.toString())
    }
    if (compressionOptions.value.maxHeight) {
      formData.append('maxHeight', compressionOptions.value.maxHeight.toString())
    }
    if (compressionOptions.value.maxSizeMB) {
      formData.append('maxSizeMB', compressionOptions.value.maxSizeMB.toString())
    }
    
    // 调用新的压缩API
    const response = await fetch('/api/compress-image', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`${$t('imageCompressor.apiRequestFailed')}: ${response.status} ${response.statusText}`)
    }
    
    // 获取响应头信息
    const originalSize = parseInt(response.headers.get('X-Original-Size') || '0')
    const compressedSize = parseInt(response.headers.get('X-Processed-Size') || '0')
    const compressionRatio = parseFloat(response.headers.get('X-Compression-Ratio') || '0')
    const originalWidth = parseInt(response.headers.get('X-Original-Width') || '0')
    const originalHeight = parseInt(response.headers.get('X-Original-Height') || '0')
    const compressedWidth = parseInt(response.headers.get('X-Processed-Width') || '0')
    const compressedHeight = parseInt(response.headers.get('X-Processed-Height') || '0')
    
    // 获取压缩后的图片数据
    const compressedBlob = await response.blob()
    
    // 创建URL用于预览和下载
    const compressedUrl = URL.createObjectURL(compressedBlob)
    
    // 生成新的文件名
    const extension = compressionOptions.value.format === 'jpeg' ? 'jpg' : compressionOptions.value.format
    const filename = file.name.replace(/\.[^/.]+$/, '') + `_compressed.${extension}`
    
    // 创建原始图片URL用于预览
    const originalUrl = URL.createObjectURL(file)
    
    // 获取预估大小用于反馈学习
    const estimatedSize = calculateAdvancedCompression(file)
    
    // 添加到历史记录用于学习
    addCompressionResult(file, estimatedSize, compressedSize || compressedBlob.size)
    
    return {
      originalFile: file,
      originalUrl,
      compressedBlob,
      compressedUrl,
      originalSize: originalSize || file.size,
      compressedSize: compressedSize || compressedBlob.size,
      compressionRatio: compressionRatio || ((file.size - compressedBlob.size) / file.size) * 100,
      filename,
      originalWidth,
      originalHeight,
      compressedWidth,
      compressedHeight
    }
  } catch (error) {
    console.error($t('imageCompressor.imageCompressionFailed'), error)
    throw new Error(`${$t('imageCompressor.imageCompressionFailed')} ${file.name}: ${error.message}`)
  }
}

// 开始压缩
const startCompression = async () => {
  if (files.value.length === 0) return
  if (isCompressing.value) return
  
  try {
    isCompressing.value = true
    compressionError.value = null
    
    // 清理之前的结果
    cleanupResults()
    compressionResults.value = []
    
    // 初始化进度
    progress.value = {
      current: 0,
      total: files.value.length,
      percentage: 0,
      currentFileName: ''
    }
    
    const results: CompressionResult[] = []
    
    // 逐个处理文件
    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i]
      
      // 更新进度
      progress.value.current = i + 1
      progress.value.currentFileName = file.name
      progress.value.percentage = Math.round(((i + 1) / files.value.length) * 100)
      
      try {
        const result = await compressImageWithAPI(file)
        results.push(result)
      } catch (error) {
        console.error(`${$t('imageCompressor.fileProcessingFailed')} ${file.name}:`, error)
        // 继续处理其他文件，但记录错误
        if (!compressionError.value) {
          compressionError.value = $t('imageCompressor.partialProcessingFailed', { error: error.message })
        }
      }
    }
    
    compressionResults.value = results
    
    if (results.length === 0) {
      compressionError.value = $t('imageCompressor.allFilesFailed')
    } else if (results.length < files.value.length) {
      compressionError.value = $t('imageCompressor.processedFiles', { processed: results.length, total: files.value.length })
    }
    
  } catch (error) {
    console.error($t('imageCompressor.compressionProcessFailed'), error)
    compressionError.value = $t('imageCompressor.compressionFailed', { error: error.message })
  } finally {
    isCompressing.value = false
  }
}

// 下载单个文件
const downloadCompressedFile = (result: CompressionResult) => {
  try {
    const link = document.createElement('a')
    link.href = result.compressedUrl
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error($t('imageCompressor.downloadFailed'), error)
  }
}

// 下载全部文件
const downloadAll = async () => {
  if (!hasResults.value) return
  
  try {
    // 如果只有一个文件，直接下载
    if (compressionResults.value.length === 1) {
      downloadCompressedFile(compressionResults.value[0])
      return
    }
    
    // 多个文件时，逐个下载（浏览器会处理）
    for (const result of compressionResults.value) {
      downloadCompressedFile(result)
      // 添加小延迟避免浏览器阻止多个下载
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  } catch (error) {
    console.error($t('imageCompressor.batchDownloadFailed'), error)
  }
}

// 清理结果资源
const cleanupResults = () => {
  compressionResults.value.forEach(result => {
    if (result.compressedUrl) {
      URL.revokeObjectURL(result.compressedUrl)
    }
    if (result.originalUrl) {
      URL.revokeObjectURL(result.originalUrl)
    }
  })
}

// 重置压缩器
const resetCompressor = () => {
  try {
    // 清理资源
    cleanupResults()
    
    // 重置状态
    compressionResults.value = []
    clearFiles()
    
    // 清理错误状态
    compressionError.value = null
    
    // 重置进度
    progress.value = {
      current: 0,
      total: 0,
      percentage: 0,
      currentFileName: ''
    }
  } catch (error) {
    console.error($t('imageCompressor.resetFailed'), error)
  }
}

// 监听文件变化
watch(files, (newFiles) => {
  if (newFiles.length === 0) {
    cleanupResults()
    compressionResults.value = []
  }
  if (dragError.value) {
    dragError.value = null
  }
}, { deep: true })

// 监听压缩选项变化
watch(compressionOptions, () => {
  if (compressionResults.value.length > 0) {
    cleanupResults()
    compressionResults.value = []
  }
}, { deep: true })

// 组件卸载时清理资源
onUnmounted(() => {
  try {
    cleanupResults()
  } catch (error) {
    console.error($t('imageCompressor.cleanupFailed'), error)
  }
})

// 组件挂载时加载历史数据
onMounted(() => {
  loadCompressionHistory()
})
</script>

<style scoped>
/* 继承HEIC转换工具的样式 */
.image-compressor {
  @apply max-w-6xl mx-auto px-4 py-8;
}

.core-feature-section {
  @apply mb-12 p-8 bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 rounded-2xl shadow-lg border border-gray-100/50;
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
  background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent);
}

.section-title {
  @apply text-3xl font-bold mb-3;
  background: linear-gradient(135deg, #059669 0%, #3b82f6 50%, #059669 100%);
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
  @apply relative overflow-hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  border: 2px dashed #cbd5e1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-upload-zone:hover {
  @apply border-green-400 shadow-2xl;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%);
  transform: translateY(-4px) scale(1.01);
}

.enhanced-upload-zone.drag-over {
  @apply border-green-500 shadow-2xl;
  background: linear-gradient(135deg, #bbf7d0 0%, #86efac 50%, #4ade80 100%);
  transform: translateY(-6px) scale(1.02);
}

.file-list-section {
  @apply bg-gradient-to-r from-gray-50 to-green-50/50 rounded-xl p-6 border border-gray-200/50;
  backdrop-filter: blur(5px);
}

.file-item {
  @apply bg-white rounded-lg p-4 shadow-sm border border-gray-100 transition-all duration-300;
}

.file-item:hover {
  @apply shadow-md border-green-200 bg-green-50/30;
  transform: translateX(4px);
}

.compress-section {
  @apply bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-xl p-8 border border-green-100;
  position: relative;
}

.compress-button {
  @apply px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300;
  background: linear-gradient(135deg, #059669 0%, #3b82f6 50%, #8b5cf6 100%);
  background-size: 200% 100%;
  color: white;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.compress-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.compress-button:hover {
  @apply shadow-2xl;
  background-position: 100% 0;
  transform: translateY(-2px) scale(1.05);
}

.compress-button:hover::before {
  left: 100%;
}

.compress-button:disabled {
  @apply opacity-50 cursor-not-allowed;
  transform: none;
}

.enhanced-progress {
  @apply relative overflow-hidden rounded-full h-4 bg-gray-200 shadow-inner;
}

.enhanced-progress-fill {
  @apply h-full transition-all duration-500 ease-out rounded-full;
  background: linear-gradient(90deg, #059669 0%, #3b82f6 30%, #8b5cf6 60%, #ec4899 100%);
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
  @apply bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-xl p-6 border border-green-200;
}

.result-item {
  @apply transition-all duration-300;
}

.result-item:hover {
  @apply shadow-md;
  transform: translateY(-2px);
}

.download-button {
  @apply px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-md transition-all duration-300;
}

.download-button:hover {
  @apply shadow-lg;
  background: linear-gradient(to right, #059669, #047857);
  transform: translateY(-1px) scale(1.02);
}

.instructions-section {
  @apply bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-xl p-8 border border-green-100;
}

.instruction-item {
  @apply flex items-start space-x-4 p-4 rounded-lg transition-all duration-300;
}

.instruction-item:hover {
  @apply bg-white/70 shadow-sm;
  transform: translateX(8px);
}

.instruction-icon {
  @apply w-6 h-6 text-green-600 flex-shrink-0 mt-1;
  filter: drop-shadow(0 2px 4px rgba(34, 197, 94, 0.2));
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-2px);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .image-compressor {
    @apply px-2 py-4;
  }
  
  .core-feature-section {
    @apply p-4 mb-6;
  }
  
  .section-title {
    @apply text-2xl;
  }
  
  .compress-button {
    @apply px-6 py-3 text-base;
  }
}
</style>