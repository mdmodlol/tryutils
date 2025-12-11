<template>
  <button
    :class="[
      'px-3 py-1 text-sm rounded-full cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
      isSelected 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50'
    ]"
    @click="$emit('click', tag)"
    type="button"
    :aria-pressed="isSelected"
    :aria-label="`${isSelected ? '取消选择' : '选择'} ${tag} 标签`"
    role="button"
  >
    {{ tag }}
  </button>
</template>

<script setup>
defineProps({
  tag: {
    type: String,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>