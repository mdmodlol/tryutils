<template>
  <span
    :class="[
      'px-3 py-1 text-sm rounded-full cursor-pointer transition-all duration-300',
      isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    ]"
    @click="$emit('click', tag)"
  >
    {{ tag }}
  </span>
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