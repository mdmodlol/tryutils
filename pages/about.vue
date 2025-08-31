<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <div class="fade-in">
          <h1 class="text-5xl md:text-6xl font-bold text-gradient mb-6">
            关于我们
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            专注于提供简单、实用的在线工具，让每个人都能轻松解决日常文件处理问题
          </p>
        </div>
      </div>
    </section>

    <!-- 主要内容 -->
    <main class="pb-16">
      <div class="max-w-4xl mx-auto px-6">
        <div class="space-y-16 slide-up">
          <!-- 我们的使命 -->
          <section class="card p-8">
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">我们的使命</h2>
                <p class="text-lg text-gray-700 leading-relaxed">
                  让每个人都能无需安装复杂软件，就能快速完成日常的小需求 —— 比如格式转换、压缩、提取等操作。
                </p>
              </div>
            </div>
          </section>

          <!-- 我们的故事 -->
          <section class="card p-8">
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">我们的故事</h2>
                <p class="text-lg text-gray-700 leading-relaxed mb-4">
                  作为一名开发者，我经常遇到各种小问题：例如 iPhone 照片格式不兼容、PDF 文件太大无法发送、需要临时处理图片……
                </p>
                <p class="text-lg text-gray-700 leading-relaxed">
                  于是我决定搭建 TryUtils，把这些常见的小工具集中在一起，让它们免费、简单、无广告干扰。
                </p>
              </div>
            </div>
          </section>

          <!-- 未来愿景 -->
          <section class="card p-8">
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">未来愿景</h2>
                <p class="text-lg text-gray-700 leading-relaxed">
                  TryUtils 目前还在早期阶段，我们会逐步上线更多工具，涵盖文件、图片、视频、音频、文本处理等场景，打造一个真正的「万能小工具箱」。
                </p>
              </div>
            </div>
          </section>

          <!-- 联系我们 -->
          <section class="card p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <div class="text-center">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">联系我们</h2>
              <p class="text-lg text-gray-700 mb-6">
                如果您有任何建议或合作意向，欢迎通过邮箱联系：
              </p>
              <a href="mailto:contact@tryutils.com" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                contact@tryutils.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 设置页面标题和描述
useHead({
  title: '关于我们',
  meta: [
    { name: 'description', content: 'TryUtils 是一个专注于提供简单、实用的在线工具的网站，致力于帮助用户轻松解决日常文件处理和格式转换问题。' },
    { name: 'keywords', content: 'TryUtils,在线工具,文件转换,图片处理,关于我们' }
  ]
})
</script>