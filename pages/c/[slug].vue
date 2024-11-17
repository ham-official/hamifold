<template>
  <main class="container mx-auto lg:pb-16">
    <section v-if="isFetching"
      class="bg-transparent lg:bg-white lg:border-2 border-gray-900 ham-shadow--active--desktop rounded-none lg:rounded-3xl text-gray-900 mt-0 lg:mt-6 p-4 lg:p-6">
      <h1 class="font-display text-display-sm uppercase font-semibold pt-6 mb-2 lg:mb-4">Claim Page</h1>
      <p
        class="flex gap-2 mx-auto px-12 py-36 items-center justify-center border border-gray-900 rounded-xl bg-gray-200">
        <span class="font-display font-semibold">Retrieving claim page data ...</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
    </section>
    <template v-else>
      <template v-if="claimPageData">
        <section
          class="w-full bg-white border-0 lg:border-2 border-gray-900 ham-shadow--active p-4 lg:p-6 rounded-none lg:rounded-3xl text-gray-900 mt-0 lg:mt-6 flex flex-col lg:flex-row justify-between gap-4 lg:gap-8">

          <div class="border-2 border-gray-900 rounded-2xl w-full lg:w-1/2 h-auto overflow-hidden">
            <IMG v-if="claimPageData.tokenMetadata.imgURL" :image="claimPageData.tokenMetadata.imgURL" alt="NFT Image"
              class="h-full w-full object-cover" />
          </div>
          <div class="flex flex-col w-full lg:w-1/2">
            <p class="text-lg lg:text-display-sm uppercase font-semibold font-display mb-1">{{
              claimPageData.tokenMetadata.title
              }}</p>
            <p class="text-sm lg:text-md text-gray-500 mb-4">{{ truncate(claimPageData.contract.owner) }}</p>
            <p class="text-sm lg:text-lg text-gray-900 mb-4">{{ claimPageData.tokenMetadata.description }}</p>
            <ul class="flex flex-col gap-1 xs-only:pb-4">
              <li class="text-sm lg:text-md flex justify-between">
                <p class="text-gray-500">Minting price:</p>
                <p class="text-gray-900 font-semibold">{{ claimPageData.mintRules.price }} ETH</p>
              </li>
              <li class="text-sm lg:text-md flex justify-between">
                <p class="text-gray-500">Total minted:</p>
                <p class="text-gray-900 font-semibold"> {{ claimPageData.mintRules.totalSupply }} / {{ (maxSupply ===
                  0 || maxSupply === '0') ? '∞' :
                  maxSupply }}</p>
              </li>
              <li class="text-sm lg:text-md flex justify-between">
                <p class="text-gray-500">Type:</p>
                <p v-html="claimPageData.mintRules.isLimited ? 'Limited' : 'Unlimited'"
                  class="text-gray-900 font-semibold"></p>
              </li>
              <li class="text-sm lg:text-md flex justify-between">
                <p class="text-gray-500">Claiming Starting Date</p>
                <p class="text-gray-900 font-semibold"> {{ startDate ?? 'Not set' }}</p>
              </li>
              <li class="text-sm lg:text-md flex justify-between">
                <p class="text-gray-500">Claiming Ending Date</p>
                <p class="text-gray-900 font-semibold"> {{ endDate ?? 'Not set' }}</p>
              </li>

            </ul>
            <CTA :disabled="!wallet" @click="mintModalIsOpen = true" size="lg" color="primary"
              class="mt-auto xs-only:-order-1 xs-only:mb-4">
              <span v-if="wallet">claim now - {{ claimPageData.mintRules.price }} ETH</span>
              <span v-else>connect your wallet to claim</span>
            </CTA>
          </div>
        </section>
      </template>
      <section v-else
        class="bg-transparent lg:bg-white lg:border-2 border-gray-900 ham-shadow--active--desktop rounded-none lg:rounded-3xl text-gray-900 mt-0 lg:mt-6 p-4 lg:p-6">
        <h1 class="font-display text-display-sm uppercase font-semibold pt-6 mb-2 lg:mb-4">Claim Page</h1>
        <p
          class="font-display font-semibold border border-gray-900 rounded-3xl text-gray-900 text-center py-36 bg-gray-200">
          This
          is not a valid Claim Page</p>
      </section>
    </template>
  </main>
  <div class="absolute top-0 left-0 z-50">
    <Modal v-if="mintModalIsOpen" :show-default-buttons="true" :confirmCancel="false" size="xl"
      class="min-h-[419px] relative">
      <template #header class="relative">
        <p class="font-display font-semibold uppercase text-display-sm">Checkout</p>
        <Icon @click="closeCheckoutModal" icon="x-close"
          class="absolute top-4 right-4 rounded-full z-20 border bg-white border-gray-900 p-2.5 cursor-pointer hover:bg-black hover:text-white" />
      </template>
      <template #body>
        <div v-if="isMinting"
          class="absolute top-0 left-0 right-0 bottom-0 z-10 w-full h-full flex flex-col gap-2 items-center justify-center text-black bg-slate-300 bg-opacity-90">
          <span>Waiting for Wallet</span>
          <Icon icon="refresh-cw-03" class="animate-spin" />
        </div>
        <Checkout v-if="!transactionFinished" :is-limited="claimPageData.mintRules.isLimited"
          :total-tokens="claimPageData.mintRules.maxSupply" :price="claimPageData.mintRules.price" @claim="handleClaim"
          :is-minting="isMinting" :max-tokens-per-wallet="claimPageData.mintRules.maxTokensPerWallet"
          :total-supply="claimPageData.mintRules.totalSupply" />
        <template v-else>
          <div class="w-full max-h-96 overflow-auto">
            <p v-if="error" class="text-red-500 text-wrap">{{ error }}</p>
            <p v-else class="text-wrap">Congrats!! You have successfully minted your {{ transactionFinished > 1 ?
              transactionFinished : '' }} NFT{{
                transactionFinished > 1 ? 's' : '' }}</p>
          </div>
        </template>
      </template>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getContractInfo,
} from "@/utils/contractListingUtilities.js";
import { getTokenEditionMetadata, batchMint, nextTokenTypeId } from "@/utils/erc721EditionUtils.js";
import { truncateAddress } from "@/utils/truncateAddress";
import { utils } from "ethers";
export default {
  data() {
    return {
      contracts: null,
      contractTokens: null,
      contract: null,
      error: null,
      isFetching: null,
      isMinting: false,
      mintModalIsOpen: false,
      nextTokenTypeId: null,
      transactionFinished: null,
      tokenEditionMetadata: null,
    }
  },
  computed: {
    ...mapGetters(['wallet']),
    slug() {
      return this.$route && this.$route.params.slug
    },
    claimPageSlugParams() {
      return (this.slug && this.slug.split('-')) ?? null
    },
    contractAddressFromURL() {
      return (this.claimPageSlugParams && this.claimPageSlugParams[0]) ?? null
    },
    tokenTypeFromURL() {
      return (this.claimPageSlugParams && parseInt(this.claimPageSlugParams[1])) ?? null
    },
    isValidClaimPage() {
      if (this.contract && this.nextTokenTypeId && this.tokenEditionMetadata) {
        return this.tokenTypeFromURL < this.nextTokenTypeId
      }
      return false
    },
    claimPageData() {
      if (this.isValidClaimPage) {
        return {
          contract: this.contract,
          tokenMetadata: {
            title: this.tokenEditionMetadata[0],
            imgURL: this.tokenEditionMetadata[1].replace('//ipfs', '/ipfs'),
            description: this.tokenEditionMetadata[2]
          },
          mintRules: {
            startDate: this.tokenEditionMetadata[3],
            endDate: this.tokenEditionMetadata[4],
            maxSupply: this.tokenEditionMetadata[5],
            isLimited: this.tokenEditionMetadata[5] > 0,
            totalSupply: this.tokenEditionMetadata[6],
            price: this.tokenEditionMetadata[7],
            maxTokensPerWallet: this.tokenEditionMetadata[8]
          }
        }
      }
      return null
    },
    startDate() {
      if (this.claimPageData.mintRules.startDate && this.claimPageData.mintRules.startDate > 0) {
        return new Date(parseInt(this.claimPageData.mintRules.startDate) * 1000)
      }
      return null
    },
    endDate() {
      if (this.claimPageData.mintRules.endDate && this.claimPageData.mintRules.endDate > 0) {
        return new Date(this.claimPageData.mintRules.endDate * 1000)
      }
      return null
    },
    maxSupply() {
      if (this.claimPageData.mintRules.maxSupply && this.claimPageData.mintRules.maxSupply > 0) {
        return this.claimPageData.mintRules.maxSupply
      } else {
        return 0
      }
    }
  },
  async mounted() {

    const claimPage = localStorage.getItem(this.slug)
    if (claimPage) {
      this.isFetching = true
      const claimPageObj = JSON.parse(claimPage)
      this.contract = claimPageObj.contract
      this.nextTokenTypeId = claimPageObj.nextTokenTypeId
      this.tokenEditionMetadata = claimPageObj.tokenEditionMetadata
      this.isFetching = false
      this.formatTokenMetadata(this.contractAddressFromURL, this.tokenTypeFromURL)
    } else {
      this.getPageData()
    }
  },
  methods: {
    closeCheckoutModal() {
      this.mintModalIsOpen = false;
      this.isMinting = false;
      this.error = null;
      this.transactionFinished = null
      document.body.classList.remove('body-overflow-hidden')
    },
    truncate(address) {
      return truncateAddress(address)
    },
    async getPageData() {
      if (!this.isFetching) {
        this.isFetching = true
        try {
          this.contract = await getContractInfo(this.contractAddressFromURL)
          const tokenType = await nextTokenTypeId(this.contractAddressFromURL)
          this.nextTokenTypeId = tokenType.toNumber();
          await this.formatTokenMetadata()
        } catch (error) {
          console.error(error)
        }
        this.isFetching = false
      }
    },
    async formatTokenMetadata() {
      const tokenEditionMetadata = await getTokenEditionMetadata(this.contractAddressFromURL, this.tokenTypeFromURL)
      this.tokenEditionMetadata = tokenEditionMetadata.map((val, index) => {
        if (val['_isBigNumber'] && index !== 7) {
          return val.toNumber()
        } if (val['_isBigNumber'] && index === 7) {
          return utils.formatUnits(val, 'ether')
        } else {
          return val
        }
      })
      localStorage.setItem(this.slug, JSON.stringify({
        contract: this.contract,
        nextTokenTypeId: this.nextTokenTypeId,
        tokenEditionMetadata: this.tokenEditionMetadata
      }))
    },
    async handleClaim(itemsToBeMinted) {
      this.isMinting = true
      try {
        const nfts = await batchMint(parseInt(this.tokenTypeFromURL), this.contractAddressFromURL, itemsToBeMinted, this.claimPageData.mintRules.price);
        this.transactionFinished = itemsToBeMinted
        this.isMinting = false
        this.getPageData()
      } catch (error) {
        console.error(error);
        this.error = error
        this.transactionFinished = true
        this.isMinting = false
      }
    },
  },
}
</script>