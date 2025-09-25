<template>
  <div class="relative inline-block text-left">
    <!-- 触发按钮 -->
    <button
      @click="toggleDropdown"
      @keydown="handleKeyDown"
      class="language-switcher-btn group"
      :aria-label="$t('common.language')"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-describedby="isOpen ? 'language-menu' : undefined"
      ref="triggerButton"
      type="button"
    >
      <Icon name="heroicons:language" class="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
      <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
        {{ currentLanguageLabel }}
      </span>
      <Icon 
        name="heroicons:chevron-down" 
        :class="[
          'w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-all duration-300',
          isOpen ? 'rotate-180' : 'rotate-0'
        ]" 
        aria-hidden="true"
      />
    </button>

    <!-- 下拉菜单 -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2"
    >
      <div
        v-show="isOpen"
        class="language-dropdown"
        @mousedown.prevent
        ref="dropdownMenu"
        role="listbox"
        :aria-labelledby="triggerButton?.id || 'language-switcher'"
        id="language-menu"
      >
        <div class="py-1" role="none">
          <button
            v-for="(lang, index) in languages"
            :key="lang.code"
            @mousedown.prevent="selectLanguage(lang.code)"
            @keydown="handleOptionKeyDown($event, index)"
            :class="[
              'language-option',
              currentLocale === lang.code ? 'language-option-active' : 'language-option-inactive'
            ]"
            role="option"
            :aria-selected="currentLocale === lang.code"
            :aria-label="`切换到${lang.name}`"
            :tabindex="isOpen ? 0 : -1"
            :ref="el => { if (el) optionRefs[index] = el as HTMLButtonElement }"
            type="button"
          >
            <span class="language-flag" aria-hidden="true">{{ lang.flag }}</span>
            <span class="language-name">{{ lang.name }}</span>
            <Icon 
              v-if="currentLocale === lang.code"
              name="heroicons:check" 
              class="w-4 h-4 text-blue-600" 
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const currentLocale = ref(locale.value)
const isOpen = ref(false)
const triggerButton = ref<HTMLButtonElement>()
const dropdownMenu = ref<HTMLDivElement>()
const optionRefs = ref<HTMLButtonElement[]>([])
const focusedIndex = ref(-1)

// 语言配置
const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

// 当前语言标签
const currentLanguageLabel = computed(() => {
  const lang = languages.find(l => l.code === currentLocale.value)
  return lang ? lang.name : t('common.chinese')
})

// 监听locale变化，同步更新currentLocale
watch(locale, (newLocale) => {
  currentLocale.value = newLocale
})

// 切换下拉菜单
const toggleDropdown = (event: Event) => {
  event.stopPropagation()
  isOpen.value = !isOpen.value
  
  if (isOpen.value) {
    nextTick(() => {
      // 聚焦到当前选中的选项
      const currentIndex = languages.findIndex(lang => lang.code === currentLocale.value)
      focusedIndex.value = currentIndex >= 0 ? currentIndex : 0
      optionRefs.value[focusedIndex.value]?.focus()
    })
  } else {
    focusedIndex.value = -1
  }
}

// 键盘导航处理
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        toggleDropdown(event)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (!isOpen.value) {
        toggleDropdown(event)
      }
      break
    case 'Escape':
      if (isOpen.value) {
        event.preventDefault()
        isOpen.value = false
        triggerButton.value?.focus()
      }
      break
  }
}

// 选项键盘导航处理
const handleOptionKeyDown = (event: KeyboardEvent, index: number) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      selectLanguage(languages[index].code)
      break
    case 'ArrowDown':
      event.preventDefault()
      focusedIndex.value = (index + 1) % languages.length
      optionRefs.value[focusedIndex.value]?.focus()
      break
    case 'ArrowUp':
      event.preventDefault()
      focusedIndex.value = index === 0 ? languages.length - 1 : index - 1
      optionRefs.value[focusedIndex.value]?.focus()
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      triggerButton.value?.focus()
      break
    case 'Tab':
      isOpen.value = false
      break
  }
}

// 选择语言
const selectLanguage = (langCode: string) => {
  if (langCode !== currentLocale.value) {
    currentLocale.value = langCode
    setLocale(langCode)
    
    // 使用 switchLocalePath 进行正确的语言路由切换
    const newPath = switchLocalePath(langCode)
    if (newPath) {
      navigateTo(newPath)
    }
  }
  isOpen.value = false
  triggerButton.value?.focus()
}

// 点击外部关闭下拉菜单
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    const triggerEl = triggerButton.value
    const dropdownEl = dropdownMenu.value
    
    // 如果点击的不是触发按钮和下拉菜单内的元素，则关闭下拉菜单
    if (triggerEl && dropdownEl && 
        !triggerEl.contains(target) && 
        !dropdownEl.contains(target)) {
      isOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* 语言切换器按钮 */
.language-switcher-btn {
  @apply flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm;
  @apply hover:shadow-md hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  @apply transition-all duration-300 cursor-pointer;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.language-switcher-btn:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transform: translateY(-1px);
}

.language-switcher-btn:active {
  transform: translateY(0);
}

/* 下拉菜单容器 */
.language-dropdown {
  @apply absolute left-0 mt-3 bg-white rounded-2xl border border-gray-200;
  @apply z-50 overflow-hidden;
  background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 10px 25px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  transform-origin: top center;
  min-width: 100%;
  width: max-content;
}

/* 语言选项 */
.language-option {
  @apply flex items-center justify-between w-full px-4 py-3.5 text-left text-sm;
  @apply transition-all duration-300 cursor-pointer relative;
  border-radius: 0;
}

.language-option-inactive {
  @apply text-gray-700;
  background: transparent;
}

.language-option-inactive:hover {
  @apply text-blue-700;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%);
  transform: translateX(4px);
}

.language-option-active {
  @apply text-white;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  box-shadow: 
    0 4px 12px rgba(59, 130, 246, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.language-option-active:hover {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  transform: translateX(2px);
  box-shadow: 
    0 6px 16px rgba(59, 130, 246, 0.4),
    0 3px 6px rgba(0, 0, 0, 0.15);
}

.language-option:first-child {
  border-radius: 1rem 1rem 0 0;
}

.language-option:last-child {
  border-radius: 0 0 1rem 1rem;
}

.language-option:only-child {
  border-radius: 1rem;
}

/* 语言标志和名称 */
.language-flag {
  @apply text-lg mr-3;
}

.language-name {
  @apply font-medium flex-1;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .language-switcher-btn {
    @apply px-3 py-2;
  }
  
  .language-switcher-btn span {
    @apply hidden;
  }
  
  .language-dropdown {
    @apply right-0 left-auto;
    transform-origin: top right;
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .language-dropdown {
    min-width: 100%;
  }
  
  .language-option {
    @apply px-3 py-3;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .language-switcher-btn {
    @apply bg-gray-800 border-gray-700 text-gray-200;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  }
  
  .language-dropdown {
    @apply bg-gray-800 border-gray-600;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow: 
      0 10px 25px -3px rgba(0, 0, 0, 0.3),
      0 4px 6px -2px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  .language-option-inactive {
    @apply text-gray-300;
  }
  
  .language-option-inactive:hover {
    @apply text-blue-400;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%);
  }
  
  .language-option-active {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  }
}
</style>