<template>
  <ClientOnly>
    <button
      class="theme-toggle-btn group"
      :aria-label="ariaLabel"
      :title="ariaLabel"
      type="button"
      @click="cycleTheme"
      @keydown.enter="cycleTheme"
      @keydown.space.prevent="cycleTheme"
    >
      <!-- Sun icon for light mode -->
      <Icon
        v-if="colorMode.preference === 'light'"
        name="heroicons:sun"
        class="w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors"
        aria-hidden="true"
      />
      <!-- Moon icon for dark mode -->
      <Icon
        v-else-if="colorMode.preference === 'dark'"
        name="heroicons:moon"
        class="w-5 h-5 text-indigo-400 group-hover:text-indigo-500 transition-colors"
        aria-hidden="true"
      />
      <!-- Computer icon for system mode -->
      <Icon
        v-else
        name="heroicons:computer-desktop"
        class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors"
        aria-hidden="true"
      />
      <span class="sr-only">{{ ariaLabel }}</span>
    </button>
    <template #fallback>
      <div class="theme-toggle-btn">
        <Icon
          name="heroicons:computer-desktop"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
        />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
const colorMode = useColorMode()
const { t } = useI18n()

// Theme cycle order: light -> dark -> system -> light
const themes = ['light', 'dark', 'system']

const cycleTheme = () => {
  const currentIndex = themes.indexOf(colorMode.preference)
  const nextIndex = (currentIndex + 1) % themes.length
  colorMode.preference = themes[nextIndex]
}

const ariaLabel = computed(() => {
  const mode = colorMode.preference
  return t(`theme.${mode}Mode`)
})
</script>

<style scoped>
.theme-toggle-btn {
  @apply flex items-center justify-center p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm;
  @apply hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  @apply transition-all duration-300 cursor-pointer;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.theme-toggle-btn:hover {
  transform: translateY(-1px);
}

.theme-toggle-btn:active {
  transform: translateY(0);
}
</style>

<!-- 非 scoped 样式 - 用于深色模式支持 -->
<style>
:root.dark .theme-toggle-btn {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}
</style>
