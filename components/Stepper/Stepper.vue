<template>
  <section class="flex flex-wrap items-center rounded-2xl gap-3 bg-white border border-gray-900 p-4">
    <div class="flex min-w-full lg:min-w-min flex-1 gap-3 items-center">
      <div class="min-h-[44px] min-w-[44px] flex items-center justify-center sm:ml-2 border rounded-full p-2" :class="{
        'border-gray-500 text-gray-500 bg-gray-50': iconColor === 'gray',
        'border-indigo-500 text-indigo-500 bg-indigo-50': iconColor === 'indigo',
        'border-warning-500 text-warning-500 bg-warning-50': iconColor === 'warning',
        'border-success-500 text-success-500 bg-success-50': iconColor === 'success'
      }">
        <Icon :icon="icon" />
      </div>
      <div class="flex flex-col">
        <p class="text-base font-bold text-gray-900">{{ title }}</p>
        <p class="btext-base order text-gray-500" v-html="description"></p>
      </div>
    </div>
    <div v-if="steps" class="flex min-w-full lg:min-w-min flex-1 flex-col gap-2 lg:mr-0 lg:max-w-lg">
      <h3 class="text-center font-bold">{{ currentStep + 1 }}. {{ steps[currentStep].title }}</h3>
      <ol class="flex items-center gap-2 justify-center">
        <li v-for="(step, index) in steps" :key="`step-${index}`" class="h-1.5 flex-1 rounded-lg bg-gray-300" :class="{
          'bg-gray-700': $route.path === step.link || index === currentStep,
          'bg-green-400': index < currentStep,
          'bg-gray-300': index > currentStep
        }">
        </li>
      </ol>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    steps: {
      type: [Array, null],
      default: null
    },
    icon: {
      type: String,
      default: 'layers-three-01'
    },
    iconColor: {
      type: String,
      default: 'gray'
    },
    title: {
      type: String,
      default: 'Claim page'
    },
    description: {
      type: String,
      default: 'Create a page for collectors to mint tokens from your contract'
    },
    currentStep: {
      type: Number,
      default: 0
    }

  },
  computed: {
    lastStepIndex() {
      return this.steps && (this.steps.length - 1)
    }
  },
  methods: {
    handleNext() {
      this.$router.push(this.steps[this.currentStep + 1].link)
    },
    handlePrev() {
      this.$router.push(this.steps[this.currentStep - 1].link)
    }
  },
}
</script>