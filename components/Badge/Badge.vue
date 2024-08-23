<template>
  <div class="flex items-center border w-fit py-1.5 px-3 uppercase font-semibold text-sm" :class="{
    'bg-white border border-gray-900 rounded-lg': color === 'primary',
    'bg-green-200 border border-green-500 text-green-500 rounded-lg': color === 'green',
    'bg-gray-900 text-white border border-gray-700 rounded-full': color === 'secondary',
    'text-xs': size === 'sm',
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