<template>
  <section class="flex flex-wrap justify-between items-center rounded-2xl gap-3 bg-white border border-gray-900 p-4">
    <div class="flex gap-3 items-center">
      <Icon :icon="icon" :no-size="true"
        class="rounded-full border border-gray-900 h-[40px] w-[40px] p-2 flex items-center justify-center" />
      <div class="flex flex-col">
        <p class="text-base font-bold text-gray-900">{{ title }}</p>
        <p class="btext-base order text-gray-500">{{ description }}</p>
      </div>
    </div>
    <div class="flex flex-col gap-2 lg:mr-0 flex-1 lg:max-w-lg">
      <h3 v-if="steps" class="text-center font-bold">{{ currentStep + 1 }}. {{ steps[currentStep].title }}</h3>
      <ol v-if="steps" class="flex items-center gap-2 justify-center">
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