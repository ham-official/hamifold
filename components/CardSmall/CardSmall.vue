<template>
  <div class="border-2 border-gray-900 rounded-xl bg-white p-4 gap-4 min-w-[300px] max-w-[300px]" :class="{
    'ham-shadow--active bg-green-100': selected,
    'ham-shadow': !selected,
    'mr-auto': isLast
  }">
    <p class="text-gray-900 font-semibold">{{ address }}</p>
    <p class="text-gray-500 mb-3">{{ name }}</p>
    <div v-if="badge" class="flex justify-between items-center">
      <Badge :color="badge.color" :size="badge.size" :label="badge.label" />
      <p class="text-xs max-w-1/2 overflow-hidden text-ellipsis">{{ symbol }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    address: {
      type: [String, null],
      default: null
    },
    badge: {
      type: [Object, null],
      default: null,
    },
    name: {
      type: [String, null],
      default: null
    },
    symbol: {
      type: [String, null],
      default: null
    },
    isLast: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
  },
}
</script>