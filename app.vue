<template>
  <div id="app">
    <NuxtLayout>
      <div class="min-h-screen bg-gray-50">
        <!-- 顶部标题栏 -->
        <header class="bg-white shadow-sm border-b">
          <div class="max-w-4xl mx-auto px-4 py-6">
            <h1 class="text-3xl font-bold text-gray-900 text-center">
              HEIC 转换工具
            </h1>
            <p class="text-gray-600 text-center mt-2">
              免费在线转换 iPhone/iPad 拍摄的 HEIC 图片格式
            </p>
          </div>
        </header>

        <!-- 主要内容 -->
        <main class="max-w-4xl mx-auto px-4 py-8">
          <HeicConverter />
        </main>

        <!-- 页脚 -->
        <footer class="bg-white border-t mt-16">
          <div class="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500">
            <p>&copy; 2024 HEIC 转换工具 - 完全在浏览器中处理，保护您的隐私</p>
          </div>
        </footer>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// 设置页面标题和描述
useHead({
  title: 'HEIC 转换工具 - 免费在线图片格式转换',
  meta: [
    { name: 'description', content: '免费在线 HEIC 转 JPG/PNG 工具，支持 iPhone iPad 图片格式转换，完全在浏览器中处理，保护隐私安全' },
    { name: 'keywords', content: 'HEIC转换,HEIC转JPG,HEIC转PNG,iPhone图片转换,图片格式转换' }
  ]
})
</script>

<style>
/* 自定义样式 */
.upload-zone {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50;
}

.upload-zone.drag-over {
  @apply border-blue-500 bg-blue-100;
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2 overflow-hidden;
}

.progress-fill {
  @apply h-full bg-blue-600 transition-all duration-300 ease-out;
}

.slider {
  @apply appearance-none bg-transparent cursor-pointer;
}

.slider::-webkit-slider-track {
  @apply w-full h-2 bg-gray-200 rounded-lg;
}

.slider::-webkit-slider-thumb {
  @apply appearance-none h-4 w-4 bg-blue-600 rounded-full cursor-pointer;
}

.slider::-moz-range-track {
  @apply w-full h-2 bg-gray-200 rounded-lg border-none;
}

.slider::-moz-range-thumb {
  @apply h-4 w-4 bg-blue-600 rounded-full cursor-pointer border-none;
}
</style>