<template>
  <div class="flex items-center border w-fit uppercase font-semibold text-sm" :class="{
    'bg-white border border-gray-900 rounded-lg': color === 'primary',
    'bg-gray-900 text-white border border-gray-900 rounded-lg': color === 'primary-invert',
    'bg-success-50 border border-success-500 text-success-500 rounded-lg': color === 'success',
    'bg-indigo-50 border border-indigo-500 text-indigo-500 rounded-lg': color === 'indigo',
    'bg-warning-50 border border-warning-500 text-warning-500 rounded-lg': color === 'warning',
    'bg-gray-900 text-white border border-gray-700 rounded-full': color === 'secondary',
    'text-xs py-1 px-2': size === 'xs',
    'text-sm py-1.5 px-3': size === 'sm'
  }">
    <p class="text-center">{{ label }}</p>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
  },
}
</script>