<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <div class="fade-in">
          <h1 class="text-5xl md:text-6xl font-bold text-gradient mb-6">
            联系我们
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            感谢您使用 TryUtils！如果您有任何问题、反馈或合作意向，欢迎联系我们
          </p>
        </div>
      </div>
    </section>

    <!-- 主要内容 -->
    <main class="pb-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="slide-up">
          <!-- 联系方式 -->
          <div class="grid lg:grid-cols-2 gap-12 mb-16">
            <!-- 邮箱联系 -->
            <div class="card p-8 text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">邮箱联系</h2>
              <p class="text-gray-600 mb-6">我们会在 24 小时内回复您的邮件</p>
              <a href="mailto:contact@tryutils.com" class="btn-primary inline-flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                contact@tryutils.com
              </a>
            </div>

            <!-- 社交媒体 -->
            <div class="card p-8 text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">社交媒体</h2>
              <p class="text-gray-600 mb-6">关注我们获取最新动态和更新</p>
              <div class="text-gray-500">
                <p>即将开通：</p>
                <p class="text-sm mt-2">Telegram • Twitter • GitHub</p>
              </div>
            </div>
          </div>

          <!-- 联系类型 -->
          <div class="mb-16">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">我们能帮您做什么？</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">功能建议</h3>
                <p class="text-gray-600 text-sm">有新的工具需求或功能建议？我们很乐意听取您的想法。</p>
              </div>
              
              <div class="card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">问题反馈</h3>
                <p class="text-gray-600 text-sm">遇到使用问题或发现了 Bug？请详细描述问题情况。</p>
              </div>
              
              <div class="card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">商务合作</h3>
                <p class="text-gray-600 text-sm">有合作意向或商务咨询？欢迎与我们讨论更多可能性。</p>
              </div>
              
              <div class="card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">使用帮助</h3>
                <p class="text-gray-600 text-sm">不确定如何使用某个工具？我们提供详细的使用指导。</p>
              </div>
            </div>
          </div>

          <!-- 常见问题引导 -->
          <div class="card p-8 bg-gradient-to-r from-gray-50 to-blue-50 border-0 text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">在联系我们之前</h2>
            <p class="text-lg text-gray-700 mb-6">
              您可以先查看以下页面，可能会对您有所帮助：
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <NuxtLink to="/about" class="btn-secondary">
                关于我们
              </NuxtLink>
              <NuxtLink to="/privacy" class="btn-secondary">
                隐私政策
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 设置页面标题和描述
useHead({
  title: '联系我们',
  meta: [
    { name: 'description', content: '联系 TryUtils 团队 - 我们很乐意听取您的反馈、建议和合作意向' },
    { name: 'keywords', content: 'TryUtils,联系我们,反馈,建议,合作,客服' }
  ]
})
</script>