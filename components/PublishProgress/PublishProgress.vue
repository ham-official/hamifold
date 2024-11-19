<template>
  <div class="flex flex-col gap-2 w-80">
    <ul v-if="steps" class="flex flex-col gap-4  ">
      <li v-for="s, index in steps" class="flex gap-4 py-4" :class="{
        'border-b border-black': index < numberOfSteps - 1
      }">
        <Icon v-if="index === current" icon="refresh-cw-03" class="animate-spin" />
        <Icon v-if="index < current" icon="check" class=" text-primary-700" />
        <span v-if="index > current" class="w-6 h-6"></span>
        <p class="font-semibold uppercase font-display" :class="{
          'text-primary-700': index < current,
          'text-gray-500': index > current
        }">{{ s.action }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: [Array, null],
      default: null
    },
    current: {
      type: Number,
      default: -1
    }
  },
  computed: {
    numberOfSteps() {
      return (this.steps && this.steps.length) ?? 0
    }
  },
}
</script>