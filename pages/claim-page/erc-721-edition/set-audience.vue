<template>
  <main class="container mx-auto px-2 lg:px-0 pb-8">
    <Stepper :steps="stepper.steps" :currentStep="4" :description="stepper.steps[4].description"
      :icon="stepper.steps[4].icon" icon-color="warning" class="my-6" />
    <div
      class="flex flex-col gap-y-8 bg-white rounded-2xl p-4 lg:p-6 border border-gray-900 ham-shadow--active mx-auto">
      <form @submit.prevent="handleSubmit" class="text-gray-700 flex flex-col gap-4 lg:gap-8 relative">
        <p class="text-lg text-gray-500 uppercase font-display font-semibold">Max number of tokens per wallet</p>
        <fieldset class="flex flex-col gap-2">
          <label for="unlimited" class="border rounded-lg p-4 border-gray-400 text-gray-400 cursor-pointer" :class="{
            'border-gray-900 text-gray-900 bg-gray-100': !limited,
            'border-gray-400': limited,
          }">Unlimited
            <input type="radio" id="unlimited" name="limited" :value="false" v-model="limited" :checked="!limited"
              class="hidden" />
          </label>
          <label for="limited" class="border rounded-lg p-4 border-gray-400 text-gray-400 cursor-pointer" :class="{
            'border-gray-900 text-gray-900 bg-gray-100': limited,
            'border-gray-400': !limited
          }">Limited
            <input type="radio" id="limited" name="limited" :value="true" v-model="limited" :checked="limited"
              class="hidden" />
          </label>
          <input v-if="limited" id="maxTokensPerWallet" type="number" v-model="maxTokensPerWallet"
            class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl text-base" />

        </fieldset>
        <div class="flex flex-1 lg:flex-auto lg:ml-auto items-center gap-4 mt-4 lg:justify-end">
          <NuxtLink to="/claim-page/erc-721-edition/set-mint-rules" class="flex-1 lg:flex-initial">
            <CTA size="lg" color="gray" class="w-full">Previous </CTA>
          </NuxtLink>
          <CTA class="flex-1 lg:flex-initial" :disabled="!formIsValid" size="lg" cta-type="submit" color="primary">Save
            & Next
          </CTA>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import steps from "@/data/stepper.json"
definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      audience: 'anyone',
      limited: false,
      maxTokensPerWallet: 5,
    }
  },
  computed: {
    formIsValid() {
      // TODO: include check for maxTokensPerWallet to be smaller than totalSupply from previous step
      return (
        true
      );
    },
    stepper() {
      return steps
    }
  },
  methods: {
    handleSubmit() {
      const claimPageAudience = {
        audience: this.audience,
        limited: this.limited
      }
      if (this.limited) {
        claimPageAudience['maxTokensPerWallet'] = this.maxTokensPerWallet
      }
      localStorage.setItem('claimPageAudience', JSON.stringify({ ...claimPageAudience }))
      setTimeout(() => {
        this.$router.push('/claim-page/erc-721-edition/preview')
      }, 300);
    }
  },
}
</script>
