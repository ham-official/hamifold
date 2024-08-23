<template>
  <main class="container mx-auto pb-16">
    <ol class="flex items-center gap-6 justify-center my-6">
      <li>1. Select contract</li>
      <li>
        <NuxtLink to="/claim-page/erc-721/set-up-media">
          2. Set up Media
        </NuxtLink>
      </li>
      <li class="font-bold">3. Set up Mint Page</li>
      <li>
        <NuxtLink to="/claim-page/erc-721/set-mint-rules">
          4. Set mint rules
        </NuxtLink>
      </li>
      <li>5. Set Audience</li>
    </ol>
    <Stepper :steps="stepper.steps" :currentStep="2" class="mb-6" />
    <div class="flex flex-col gap-y-8 bg-white rounded-xl p-6 border border-gray-900 ham-shadow--active mx-auto">
      <form @submit.prevent="handleSubmit" class="my-4 text-gray-700 flex flex-col gap-8 relative">
        <p class="text-display-sm font-semibold uppercase font-display">Set up mint page</p>
        <div class="flex flex-col gap-2">
          <label for="description"
            class="text-lg text-gray-500 uppercase font-display font-semibold">Description</label>
          <textarea id="description" rows="4" v-model="description"
            class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl text-base" />
        </div>
        <div class="flex justify-end items-center gap-4">
          <NuxtLink to="/claim-page/erc-721/set-up-media">
            <CTA size="lg" color="gray">Previous </CTA>
          </NuxtLink>
          <CTA :disabled="!formIsValid" size="lg" cta-type="submit" color="primary">Save & Next</CTA>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { patterns, testRegex } from "@/utils/regex.js";
import steps from "@/data/stepper.json"
definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      url: null,
      description: null,
      deployInProgress: false,
      deployTransaction: null,
      isSubmitting: false,
    };
  },
  mounted() {
    const mintPageData = localStorage.getItem('mintPage')
    if (mintPageData) {
      const mintPageDataObj = JSON.parse(mintPageData)
      this.url = mintPageDataObj.url
      this.description = mintPageDataObj.description
    }
  },
  computed: {
    ...mapGetters(["isConnected"]),
    formIsValid() {
      return (
        this.description &&
        testRegex(patterns.notEmptyString, this.description)
      );
    },
    baseUrl() {
      return import.meta.env.VITE_BASE_URL
    },
    stepper() {
      return steps
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.isSubmitting = true;
        const mintPage = {
          url: this.url,
          description: this.description,
        };
        localStorage.setItem('mintPage', JSON.stringify({ ...mintPage }))
        setTimeout(() => {
          this.$router.push('/claim-page/erc-721/set-mint-rules')
        }, 300);
      } catch (error) {
        console.log({ error });
        alert(error.message)
      }
    },
    async handleDeployTx(deployTx) {

    },
  },
}
</script>
