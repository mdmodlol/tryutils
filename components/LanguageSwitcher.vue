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
      <Icon name="heroicons:language" class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" aria-hidden="true" />
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {{ currentLanguageLabel }}
      </span>
      <Icon 
        name="heroicons:chevron-down" 
        :class="[
          'w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300',
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
  @apply flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-teal-600/30 dark:focus:ring-teal-400/30;
  @apply transition-all duration-300 cursor-pointer;
}

.language-switcher-btn:hover {
  border-color: rgba(13, 148, 136, 0.3);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.language-switcher-btn:active {
  transform: translateY(0);
}

/* 下拉菜单容器 */
.language-dropdown {
  @apply absolute left-0 mt-3 bg-white rounded-2xl border border-slate-200;
  @apply z-50 overflow-hidden;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 18px 40px -12px rgba(15, 23, 42, 0.18),
    0 0 0 1px rgba(255, 255, 255, 0.2);
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
  @apply text-teal-700;
  background: rgba(240, 253, 250, 0.9);
}

.language-option-active {
  @apply text-white;
  background: #0f172a;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.16);
}

.language-option-active:hover {
  background: #1e293b;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.2);
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

</style>

<!-- 非 scoped 样式 - 用于深色模式支持 -->
<style>
/* 深色模式支持 - 必须在非 scoped 样式中才能正常工作 */
:root.dark .language-switcher-btn {
  border-color: #334155;
}

:root.dark .language-switcher-btn:hover {
  border-color: rgba(45, 212, 191, 0.4);
  box-shadow: 0 16px 32px rgba(2, 6, 23, 0.28);
}

:root.dark .language-dropdown {
  background: rgba(15, 23, 42, 0.96);
  border-color: #334155;
  box-shadow: 
    0 18px 40px -12px rgba(2, 6, 23, 0.45),
    0 0 0 1px rgba(148, 163, 184, 0.08);
}

:root.dark .language-option-inactive {
  color: #d1d5db;
}

:root.dark .language-option-inactive:hover {
  color: #5eead4;
  background: rgba(15, 118, 110, 0.16);
}

:root.dark .language-option-active {
  background: #e2e8f0;
  color: #0f172a;
}
</style>
