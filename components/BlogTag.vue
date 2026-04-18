<template>
  <button
    :class="[
      'rounded-full border px-3 py-1 text-xs font-medium transition',
      isSelected
        ? 'border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950'
        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-50'
    ]"
    type="button"
    :aria-pressed="isSelected"
    :aria-label="$t('accessibility.filterTagAriaLabel', { action: isSelected ? $t('accessibility.deselectTag') : $t('accessibility.selectTag'), tag })"
    @click="$emit('click', tag)"
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
