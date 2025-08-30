<template>
  <div class="space-y-8">
    <!-- 文件上传区域 -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Icon name="heroicons:cloud-arrow-up" />
        选择或拖拽 HEIC 文件
      </h2>
      
      <!-- 使用 ClientOnly 包装交互组件 -->
      <ClientOnly>
        <!-- 拖拽上传区域 -->
        <div 
          class="upload-zone"
          :class="{ 'drag-over': isDragging }"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver"
          @drop="handleDrop"
        >
          <div class="space-y-4">
            <Icon name="heroicons:photo" class="mx-auto text-6xl text-gray-400" />
            
            <div>
              <p class="text-lg text-gray-600">
                拖拽 HEIC 文件到这里，或者
              </p>
              <label class="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <Icon name="heroicons:folder-open" class="mr-2" />
                选择文件
                <input 
                  type="file" 
                  multiple 
                  accept=".heic,.heif"
                  class="hidden"
                  @change="handleFileSelect"
                >
              </label>
            </div>
            
            <p class="text-sm text-gray-500">
              支持 .heic 和 .heif 格式，最大 50MB，最多 10 个文件
            </p>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="dragError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm flex items-center gap-2">
            <Icon name="heroicons:exclamation-triangle" />
            {{ dragError }}
          </p>
        </div>
        
        <template #fallback>
          <div class="upload-zone">
            <div class="space-y-4">
              <Icon name="heroicons:photo" class="mx-auto text-6xl text-gray-400" />
              <div>
                <p class="text-lg text-gray-600">
                  正在加载文件上传功能...
                </p>
              </div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- 文件列表 -->
    <ClientOnly>
      <div v-if="files.length > 0" class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="heroicons:document-duplicate" />
            已选择的文件 ({{ files.length }})
          </h3>
          <button 
            @click="clearFiles"
            class="text-gray-500 hover:text-red-600 transition-colors"
          >
            <Icon name="heroicons:trash" class="text-lg" />
          </button>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="(file, index) in files" 
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <Icon name="heroicons:photo" class="text-blue-600" />
              <div>
                <p class="font-medium text-gray-900">{{ file.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <button 
              @click="removeFile(index)"
              class="text-gray-400 hover:text-red-600 transition-colors"
            >
              <Icon name="heroicons:x-mark" />
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- 转换设置 -->
    <ClientOnly>
      <div v-if="files.length > 0" class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="heroicons:cog-6-tooth" />
          转换设置
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 输出格式 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              输出格式
            </label>
            <select 
              v-model="convertOptions.format"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="JPEG">JPEG (.jpg)</option>
              <option value="PNG">PNG (.png)</option>
              <option value="WEBP">WebP (.webp)</option>
            </select>
          </div>

          <!-- 图片质量 -->
          <div v-if="convertOptions.format !== 'PNG'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              图片质量: {{ Math.round(convertOptions.quality * 100) }}%
            </label>
            <input 
              v-model.number="convertOptions.quality"
              type="range" 
              min="0.1" 
              max="1" 
              step="0.1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>低质量</span>
              <span>高质量</span>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- 转换按钮和进度 -->
    <ClientOnly>
      <div v-if="files.length > 0" class="bg-white rounded-lg shadow-sm border p-6">
        <div class="space-y-4">
          <!-- 转换按钮 -->
          <button 
            @click="startConversion"
            :disabled="isConverting"
            class="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg font-medium"
          >
            <Icon 
              :name="isConverting ? 'heroicons:arrow-path' : 'heroicons:arrow-down-tray'" 
              :class="{ 'animate-spin': isConverting }"
            />
            {{ isConverting ? '转换中...' : `开始转换 (${files.length} 个文件)` }}
          </button>

          <!-- 进度条 -->
          <div v-if="isConverting" class="space-y-2">
            <div class="flex justify-between text-sm text-gray-600">
              <span>转换进度</span>
              <span>{{ progress }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>

          <!-- 转换错误 -->
          <div v-if="convertError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm flex items-center gap-2">
              <Icon name="heroicons:exclamation-triangle" />
              {{ convertError }}
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- 转换结果 -->
    <ClientOnly>
      <div v-if="convertResults.length > 0" class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="heroicons:check-circle" class="text-green-600" />
          转换完成
        </h3>
        
        <div class="space-y-3 mb-4">
          <div 
            v-for="(result, index) in convertResults" 
            :key="index"
            class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <div class="flex items-center gap-3">
              <Icon name="heroicons:document-check" class="text-green-600" />
              <div>
                <p class="font-medium text-gray-900">{{ result.filename }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(result.blob.size) }}</p>
              </div>
            </div>
            <button 
              @click="downloadFile(result)"
              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              下载
            </button>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button 
            @click="downloadAll"
            class="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="heroicons:arrow-down-tray" />
            下载全部
          </button>
          <button 
            @click="resetConverter"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            重新开始
          </button>
        </div>
      </div>
    </ClientOnly>

    <!-- 使用说明 -->
    <div class="bg-blue-50 rounded-lg border border-blue-200 p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <Icon name="heroicons:information-circle" />
        使用说明
      </h3>
      <div class="space-y-2 text-blue-800">
        <p class="flex items-start gap-2">
          <Icon name="heroicons:check" class="text-blue-600 mt-0.5 flex-shrink-0" />
          支持 iPhone/iPad 拍摄的 HEIC 和 HEIF 格式图片
        </p>
        <p class="flex items-start gap-2">
          <Icon name="heroicons:check" class="text-blue-600 mt-0.5 flex-shrink-0" />
          完全在浏览器中处理，不会上传到服务器
        </p>
        <p class="flex items-start gap-2">
          <Icon name="heroicons:check" class="text-blue-600 mt-0.5 flex-shrink-0" />
          支持批量转换，最多 10 个文件
        </p>
        <p class="flex items-start gap-2">
          <Icon name="heroicons:check" class="text-blue-600 mt-0.5 flex-shrink-0" />
          可选择输出为 JPEG、PNG 或 WebP 格式
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入Vue组合式API
import { ref, onUnmounted } from 'vue'
// 导入类型定义
// eslint-disable-next-line
import type { ConvertOptions } from '~/composables/useImageConverter'
// eslint-disable-next-line
import type { ConvertResult } from '~/composables/useImageConverter'

// 设置页面标题和描述
useHead({
  title: 'HEIC 转换工具 - 免费在线图片格式转换',
  meta: [
    { name: 'description', content: '免费在线 HEIC 转 JPG/PNG 工具，支持 iPhone iPad 图片格式转换，完全在浏览器中处理，保护隐私安全' },
    { name: 'keywords', content: 'HEIC转换,HEIC转JPG,HEIC转PNG,iPhone图片转换,图片格式转换' }
  ]
})

// 默认空函数和状态
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

const defaultImageConverter = {
  isConverting: ref(false),
  progress: ref(0),
  error: ref(null),
  convertMultiple: async () => [],
  downloadFile: () => {},
  downloadMultiple: () => {},
  cleanup: () => {}
}

// 引入组合式函数 - 加入客户端检查
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
} = process.client ? (useDragDrop({
  accept: ['.heic', '.heif'],
  maxFiles: 10,
  maxSize: 50 * 1024 * 1024 // 50MB
}) || defaultDragDrop) : defaultDragDrop

const {
  isConverting,
  progress,
  error: convertError,
  convertMultiple,
  downloadFile,
  downloadMultiple,
  cleanup
} = process.client ? (useImageConverter() || defaultImageConverter) : defaultImageConverter

// 转换设置
const convertOptions = ref<ConvertOptions>({
  format: 'JPEG',
  quality: 0.8
})

// 转换结果
const convertResults = ref<ConvertResult[]>([])

// 开始转换
const startConversion = async () => {
  if (files.value.length === 0) return
  
  try {
    convertResults.value = []
    const results = await convertMultiple([...files.value] as File[], convertOptions.value)
    convertResults.value = results
  } catch (error) {
    console.error('转换失败:', error)
  }
}

// 下载全部文件
const downloadAll = () => {
  if (convertResults.value.length > 0) {
    downloadMultiple(convertResults.value)
  }
}

// 重置转换器
const resetConverter = () => {
  // 清理资源
  if (convertResults.value.length > 0) {
    cleanup(convertResults.value)
  }
  
  // 重置状态
  convertResults.value = []
  clearFiles()
}

// 组件卸载时清理资源
onUnmounted(() => {
  if (convertResults.value.length > 0) {
    cleanup(convertResults.value)
  }
})
</script>

<style scoped>
/* 由于使用 CDN Tailwind CSS，在这里不需要额外的样式 */
</style>