<template>
  <div class="flex items-center gap-2">
    <Icon name="heroicons:language" class="text-gray-600" />
    <select 
      v-model="currentLocale"
      @change="switchLanguage"
      class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <option value="zh">中文</option>
      <option value="en">English</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const currentLocale = ref(locale.value)

// 监听locale变化，同步更新currentLocale
watch(locale, (newLocale) => {
  currentLocale.value = newLocale
})

// 语言切换函数
const switchLanguage = () => {
  const newLocale = currentLocale.value
  setLocale(newLocale)
  // 使用 switchLocalePath 进行正确的语言路由切换
  const newPath = switchLocalePath(newLocale)
  if (newPath) {
    navigateTo(newPath)
  }
}
</script>

<style scoped>
/* 自定义选择框样式 */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select:focus {
  outline: none;
}
</style>