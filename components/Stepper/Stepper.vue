<template>
  <section class="flex justify-between items-center rounded-lg bg-white border border-gray-900 p-5">
    <div class="flex gap-3 p-4 border border-gray-900 rounded-lg items-center">
      <Icon :icon="icon" :no-size="true"
        class="rounded-full border border-gray-900 h-[40px] w-[40px] p-2 flex items-center justify-center" />
      <div class="flex flex-col">
        <p class="text-base font-bold text-gray-900">{{ title }}</p>
        <p class="btext-base order text-gray-500">{{ description }}</p>
      </div>
    </div>
    <ol v-if="steps" class="flex items-center gap-2 justify-center">
      <li v-for="(step, index) in steps" :key="`step-${index}`" class="h-1.5 w-10 rounded-lg bg-gray-300" :class="{
        'bg-gray-700': $route.path === step.link,
      }"></li>
      <!-- <li class="flex gap-2">
          <CTA size="lg" color="white" :disabled="currentStep === 0" @click="handlePrev">previous</CTA>
          <CTA size="lg" color="black" class="" :disabled="currentStep === lastStepIndex" @click="handleNext">next</CTA>
        </li> -->
    </ol>
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