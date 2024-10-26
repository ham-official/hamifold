<template>
  <div class="border-2 border-gray-900 p-6 rounded-lg w-full lg:w-1/2 text-left">
    <p class="font-semibold">{{ isLimited ? 'Limited edition' : 'Unlimited edition' }}</p>
    <p><span class="font-semibold">Max tokens per wallet:</span> <span class="float-right">{{
      maxTokensPerWallet === 0 ?
        'No limit' :
        maxTokensPerWallet }}</span></p>
    <p><span class="font-semibold">Minted tokens:</span> <span class="float-right">{{ totalSupply }}</span></p>
    <p><span class="font-semibold">Total Tokens:</span> <span class="float-right">{{ totalTokens }}</span></p>
    <p><span class="font-semibold">Available Tokens:</span> <span class="float-right">{{ availableTokens === Infinity ?
      'Limitless' : availableTokens }}</span></p>
  </div>
  <div v-if="!maxTokensMinted" class="flex flex-col gap-2">
    <div class="flex gap-x-10 items-center xs-only:justify-center">
      <CTA color="white" @click="removeItemsClaimed" :disabled="itemsClaimed === 1 || isMinting" onlyIcon
        iconLeft="minus">
      </CTA>
      <span class="text-display-sm font-semibold">{{ itemsClaimed }}</span>
      <CTA color="white" @click="addItemsClaimed" :disabled="itemsClaimed === availableTokens || isMinting" onlyIcon
        iconLeft="plus">
      </CTA>
    </div>
    <CTA class="w-24 mx-auto" size="lg" v-if="isLimited || (!isLimited && maxTokensPerWallet !== 0)" color="primary"
      @click="addMaxItemsClaimed" :disabled="itemsClaimed === availableTokens || isMinting">Max
    </CTA>
  </div>
  <div v-else>
    <p class="font-semibold font-display">You have minted the maximum quantity of tokens allowed per user</p>
  </div>
  <section class="w-full px-16">
    <div class="flex flex-col gap-4 justify-start items-start">
      <p class="text-display-xs font-display font-semibold uppercase">Your Order</p>
      <ul class="flex flex-col gap-6 w-full">
        <li class="flex justify-between w-full text-gray-500">
          <p class="">Items<span class="font-normal"> x {{ itemsClaimed }}</span></p>
          <p>{{ totalClaimedPrice }} ETH</p>
        </li>
        <!-- <li class="flex justify-between w-full text-gray-500">
          <p class="">HAM Fee<span class="font-normal"> x {{ itemsClaimed }}</span></p>
          <p>{{ HAMfeePrice }} ETH</p>
        </li> -->
        <li class="flex justify-between w-full">
          <p class="text-display-xs font-display font-bold">TOTAL</p>
          <p class="flex flex-col font-bold">{{ totalPrice }} ETH</p>
        </li>
      </ul>
    </div>
  </section>
  <CTA :disabled="isMinting || maxTokensMinted" color="primary" size="lg" @click="$emit('claim', itemsClaimed)">
    claim now
    - {{ price }} ETH
  </CTA>
</template>

<script>
export default {
  props: {
    totalTokens: {
      type: [Number, null],
      default: null,
    },
    totalSupply: {
      type: [Number, null],
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    isMinting: {
      type: Boolean,
      default: false,
    },
    isLimited: {
      type: Boolean,
      default: false,
    },
    maxTokensPerWallet: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      itemsClaimed: 1,
      HAMfee: 0,
    }
  },
  computed: {
    totalClaimedPrice() {
      return parseFloat((this.itemsClaimed * this.price).toFixed(5))
    },
    HAMfeePrice() {
      return this.HAMfee * this.itemsClaimed
    },
    totalPrice() {
      return this.totalClaimedPrice + this.HAMfeePrice
    },
    availableTokens() {
      if (this.isLimited && this.maxTokensPerWallet !== 0) {
        // e.g.: Collection has 100 tokens and 3 maximum tokens per wallet
        return this.maxTokensPerWallet - this.totalSupply
      }
      if (this.isLimited && this.maxTokensPerWallet === 0) {
        // e.g.: Collection has 100 tokens but no maximum tokens per wallet
        return this.totalTokens - this.totalSupply
      }
      if (!this.isLimited && this.maxTokensPerWallet !== 0) {
        // e.g.: Collection has unlimited tokens and 3 maximum tokens per wallet
        return this.maxTokensPerWallet - this.totalSupply
      }
      if (!this.isLimited && this.maxTokensPerWallet === 0) {
        // e.g.: Collection has unlimited tokens and no maximum tokens per wallet
        return Infinity
      }
    },
    maxTokensMinted() {
      if ((this.totalSupply === this.totalTokens && this.totalTokens !== 0) || (this.totalSupply === this.maxTokensPerWallet && this.maxTokensPerWallet !== 0)) {
        return true
      }
    }
  },
  methods: {
    removeItemsClaimed() {
      if (this.itemsClaimed > 1) {
        return this.itemsClaimed = this.itemsClaimed - 1
      }
    },
    addItemsClaimed() {
      if (this.itemsClaimed < this.availableTokens) {
        return this.itemsClaimed = this.itemsClaimed + 1
      }

    },
    addMaxItemsClaimed() {
      return this.itemsClaimed = this.availableTokens

    },
    dollarChange(price) {
      // TODO: use the actual value of ETH in dollars
      return price * 4000
    },
  }
}
</script>