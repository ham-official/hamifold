<template>
  <main class="container mx-auto pb-16">
    <ol class="flex items-center gap-6 justify-center my-6">
      <li>1. Select contract</li>
      <li>2. Set up Media</li>
      <li>
        <NuxtLink to="/claim-page/erc-721/set-up-mint-page">
          3. Set up Mint Page
        </NuxtLink>
      </li>
      <li class="font-bold">4. Set mint rules</li>
      <li>
        <NuxtLink to="/claim-page/erc-721/set-audience">
          5. Set Audience
        </NuxtLink>
      </li>
    </ol>
    <Stepper :steps="stepper.steps" :currentStep="3" class="mb-6" />
    <div class="flex flex-col gap-y-8 bg-white rounded-xl p-6 border border-gray-900 ham-shadow--active mx-auto">
      <form @submit.prevent="handleSubmit" class="my-4 text-gray-700 flex flex-col gap-8 relative">
        <div>
          <p class="text-display-sm font-semibold uppercase font-display">Set mint rules</p>
          <p class="text-md text-gray-500">Customize options such as price, supply, and date</p>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col gap-2 flex-1">
            <label for="price" class="text-lg text-gray-500 uppercase font-display font-semibold">edition price</label>
            <div class="flex items-center gap-1">
              <div class="flex gap-x-1">
                <input id="price" type="number" v-model="price"
                  class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl text-base" step="0.00001" />
                <Badge v-if="price === 0" color="green" label="free" />
              </div>
              <select name="currency" id="currency" disabled class="border border-gray-900 rounded-xl p-2"
                v-model="currency">
                <option value="eth">ETH</option>
                <option value="usd">USD</option>
              </select>
            </div>
            <p v-if="!editionPriceIsValid" class="text-red-500">Error: You can't select a negative value</p>
          </div>
          <div class="flex flex-col gap-2 flex-1">
            <label for="walletForPayment" class="text-lg text-gray-500 uppercase font-display font-semibold">specify the
              address that will receive the payments</label>
            <input :disabled="true" id="walletForPayment" type="text" v-model="walletForPayment" :placeholder="wallet"
              class="bg-gray-100 px-3 py-1.5 border border-gray-300 text-gray-500 cursor-not-allowed rounded-xl text-base" />
            <p v-if="!walletForPaymentIsValid" class="text-red-500">Error: Wallet Address incorrect format</p>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <label for="totalSupply" class="text-lg text-gray-500 uppercase font-display font-semibold">mintable total
            supply</label>
          <div class="flex gap-x-2">
            <div class="mb-4">
              <input type="radio" id="unlimited" name="totalSupply" value="unlimited" v-model="totalSupply"
                :checked="totalSupply === 'unlimited'" class="hidden peer" />
              <label for="unlimited"
                class="uppercase p-2 border border-gray-900 rounded-xl peer-checked:border-2 peer-checked:font-semibold cursor-pointer">unlimited</label>
            </div>
            <div class="">
              <input type="radio" id="limited" name="totalSupply" value="limited" v-model="totalSupply"
                :checked="totalSupply === 'limited'" class="hidden peer" />
              <label for="limited"
                class="uppercase p-2 border border-gray-900 rounded-xl peer-checked:border-2 peer-checked:font-semibold cursor-pointer">limited</label>
            </div>
          </div>
          <div v-if="totalSupply === 'limited'" class="flex flex-col gap-2">
            <input v-model="numberOfTokens" id="numberOfTokens" type="number" :placeholder="100"
              class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl text-base mb-2" />
            <p v-if="!numberOfTokensIsValid" class="text-red-500">Error: You must select at least 1 token and the
              quantity must be an integer number</p>
            <!-- <label for="numberedTokens" class="text-lg text-gray-500 uppercase font-display font-semibold">numbered
              tokens</label>
            <div class="flex gap-x-2">
              <div class="mb-4">
                <input type="radio" id="yes" name="numberedTokens" :value="true" v-model="numberedTokens" checked
                  class="hidden peer" />
                <label for="yes"
                  class="uppercase p-2 border border-gray-900 rounded-xl peer-checked:border-2 peer-checked:font-semibold cursor-pointer">yes</label>
              </div>
              <div class="">
                <input type="radio" id="no" name="numberedTokens" :value="false" v-model="numberedTokens"
                  class="hidden peer" />
                <label for="no"
                  class="uppercase p-2 border border-gray-900 rounded-xl peer-checked:border-2 peer-checked:font-semibold cursor-pointer">no</label>
              </div>
            </div> -->
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col gap-2 flex-1">
            <label for="startDate" class="text-lg text-gray-500 uppercase font-display font-semibold">start date</label>
            <input id="startDate" type="date" v-model="startDate" :min="todayDate"
              class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl text-base" />
          </div>
          <div class="flex flex-col gap-2 flex-1">
            <label for="endDate" class="text-lg text-gray-500 uppercase font-display font-semibold">end date</label>
            <input id="endDate" type="date" v-model="endDate"
              class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl text-base" />
            <p v-if="!endDateIsValid">
              <span v-if="endDate < startDate && !startDateIsEmpty" class="text-red-500">Error: End date is before
                Start date
              </span><span v-if="!startDate" class="text-red-500">Error: You can't select an End Date if you don't
                select a Start Date</span>
            </p>
          </div>
        </div>
        <div class="flex justify-end items-center gap-4">
          <NuxtLink to="/claim-page/erc-721/set-up-mint-page">
            <CTA size="lg" color="gray">Previous</CTA>
          </NuxtLink>
          <CTA :disabled="!formIsValid" size="lg" cta-type="submit" color="primary">Save & Next</CTA>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import { patterns, testRegex } from "@/utils/regex.js";
import steps from "@/data/stepper.json"
definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      price: 0,
      currency: 'eth',
      walletForPayment: null,
      totalSupply: 'unlimited',
      numberOfTokens: 100,
      numberedTokens: false,
      startDate: null,
      endDate: null,

    };
  },
  computed: {
    ...mapGetters(['wallet']),
    todayDate() {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const day = now.getDate()

      return `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`
    },
    editionPriceIsValid() {
      return this.price >= 0
    },
    walletForPaymentIsValid() {
      return testRegex(patterns.walletAddress, this.walletForPayment)
    },
    startDateIsEmpty() {
      return this.startDate === null || this.startDate === ''
    },
    endDateIsValid() {
      return this.endDate === null || this.endDate === '' || (this.endDate > this.startDate && !this.startDateIsEmpty)
    },
    numberOfTokensIsValid() {
      if (this.totalSupply === 'unlimited') {
        return true
      } else {
        return this.numberOfTokens && this.numberOfTokens > 0 && this.numberOfTokens % 1 === 0
      }

    },
    formIsValid() {
      return (
        this.editionPriceIsValid &&
        this.walletForPaymentIsValid &&
        this.numberOfTokensIsValid &&
        this.endDateIsValid
      );
    },
    stepper() {
      return steps
    }
  },
  methods: {
    handleSubmit() {
      if (this.formIsValid) {
        const formData = {
          price: this.price,
          currency: this.currency,
          walletForPayment: this.walletForPayment,
          totalSupply: this.totalSupply,
          startDate: this.startDate,
          endDate: this.endDate,
        }
        if (this.totalSupply === 'limited') {
          formData.numberOfTokens = this.numberOfTokens
          formData.numberedTokens = this.numberedTokens
        }
        localStorage.setItem('claimPageMintRules', JSON.stringify(formData))
        setTimeout(() => {
          this.$router.push('/claim-page/erc-721/set-audience')
        }, 300);
      }
    }
  },
  mounted() {
    this.walletForPayment = this.wallet;
    const mintRules = localStorage.getItem('claimPageMintRules');
    if (mintRules) {
      const mintRulesObject = JSON.parse(mintRules)
      this.price = mintRulesObject.price
      this.totalSupply = mintRulesObject.totalSupply
      this.startDate = mintRulesObject.startDate
      this.endDate = mintRulesObject.endDate
    }
  },
}
</script>
