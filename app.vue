<template>
  <div id="app">
    <NuxtLayout>
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <!-- 顶部导航栏 -->
        <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
          <div class="max-w-6xl mx-auto px-6 py-4">
            <div class="flex items-center justify-center">
              <div class="text-center">
                <NuxtLink to="/" class="group">
                  <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                    TryUtils
                  </h1>
                  <p class="text-gray-600 text-sm mt-1 group-hover:text-gray-800 transition-colors">
                    简单实用的在线工具集合
                  </p>
                </NuxtLink>
              </div>
            </div>
          </div>
        </header>

        <!-- 页面内容 -->
        <main class="flex-1">
          <NuxtPage />
        </main>

        <!-- 页脚 -->
        <footer class="bg-gray-900 text-white mt-20">
          <div class="max-w-6xl mx-auto px-6 py-12">
            <div class="grid md:grid-cols-4 gap-8">
              <!-- 品牌信息 -->
              <div class="md:col-span-2">
                <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TryUtils
                </h3>
                <p class="text-gray-300 mt-2 text-sm leading-relaxed">
                  专注于提供简单、实用的在线工具，让您无需安装复杂软件就能快速完成日常需求。
                  完全在浏览器中处理，保护您的隐私安全。
                </p>
              </div>
              
              <!-- 工具链接 -->
              <div>
                <h4 class="font-semibold text-white mb-4">工具</h4>
                <ul class="space-y-2 text-sm">
                  <li>
                    <NuxtLink to="/" class="text-gray-300 hover:text-blue-400 transition-colors">
                      HEIC 图片转换
                    </NuxtLink>
                  </li>
                  <li class="text-gray-500">更多工具即将推出...</li>
                </ul>
              </div>
              
              <!-- 内容链接 -->
              <div>
                <h4 class="font-semibold text-white mb-4">内容</h4>
                <ul class="space-y-2 text-sm">
                  <li>
                    <NuxtLink to="/blog" class="text-gray-300 hover:text-blue-400 transition-colors">
                      博客文章
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/about" class="text-gray-300 hover:text-blue-400 transition-colors">
                      关于我们
                    </NuxtLink>
                  </li>
                </ul>
              </div>
              
              <!-- 信息链接 -->
              <div>
                <h4 class="font-semibold text-white mb-4">信息</h4>
                <ul class="space-y-2 text-sm">
                  <li>
                    <NuxtLink to="/contact" class="text-gray-300 hover:text-blue-400 transition-colors">
                      联系我们
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/privacy" class="text-gray-300 hover:text-blue-400 transition-colors">
                      隐私政策
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- 底部版权 -->
            <div class="border-t border-gray-800 mt-8 pt-8 text-center">
              <p class="text-gray-400 text-sm">
                &copy; 2024 TryUtils. 保留所有权利。
              </p>
            </div>
          </div>
        </footer>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// 设置全局页面配置
useHead({
  titleTemplate: '%s - TryUtils',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' },
    // SEO 相关
    { name: 'description', content: 'TryUtils - 简单实用的在线工具集合，支持 HEIC 图片转换等功能' },
    { name: 'keywords', content: 'TryUtils,在线工具,HEIC转换,图片处理,文件转换' },
    { name: 'author', content: 'TryUtils Team' },
    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.tryutils.com/' },
    { property: 'og:title', content: 'TryUtils - 简单实用的在线工具集合' },
    { property: 'og:description', content: '免费在线 HEIC 转 JPG/PNG 工具，支持 iPhone iPad 图片格式转换，完全在浏览器中处理' },
    { property: 'og:image', content: 'https://www.tryutils.com/android-chrome-512x512.png' },
    // Twitter
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:url', content: 'https://www.tryutils.com/' },
    { property: 'twitter:title', content: 'TryUtils - 简单实用的在线工具集合' },
    { property: 'twitter:description', content: '免费在线 HEIC 转 JPG/PNG 工具，支持 iPhone iPad 图片格式转换，完全在浏览器中处理' },
    { property: 'twitter:image', content: 'https://www.tryutils.com/android-chrome-512x512.png' }
  ]
})
</script>

<style>
/* 全局样式 */
* {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 自定义组件样式 */
.upload-zone {
  @apply border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.upload-zone.drag-over {
  @apply border-blue-500 bg-blue-100 shadow-xl;
  transform: scale(1.02);
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner;
}

.progress-fill {
  @apply h-full transition-all duration-500 ease-out;
  background: linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
  background-size: 200% 100%;
  animation: gradient-shift 2s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 200% 0; }
  50% { background-position: 0% 0; }
}

.slider {
  @apply appearance-none bg-transparent cursor-pointer;
}

.slider::-webkit-slider-track {
  @apply w-full h-2 bg-gray-200 rounded-lg;
}

.slider::-webkit-slider-thumb {
  @apply appearance-none h-5 w-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200;
  transform: scale(1);
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider::-moz-range-track {
  @apply w-full h-2 bg-gray-200 rounded-lg border-none;
}

.slider::-moz-range-thumb {
  @apply h-5 w-5 rounded-full cursor-pointer border-none shadow-lg;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
}

/* 卡片样式 */
.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-gray-200;
}

.card:hover {
  transform: translateY(-2px);
}

/* 按钮样式 */
.btn-primary {
  @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700;
}

.btn-primary:hover {
  transform: translateY(-1px);
}

.btn-secondary {
  @apply px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50;
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-up {
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 文本渐变效果 */
.text-gradient {
  @apply bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent;
}

.text-gradient-hover:hover {
  @apply bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent;
}

/* 响应式改进 */
@media (max-width: 768px) {
  .upload-zone {
    @apply p-6;
  }
  
  .card {
    @apply mx-4;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}
</style>