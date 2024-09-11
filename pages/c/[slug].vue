<template>
  <main class="container mx-auto pb-16">
    <section v-if="isFetching"
      class="flex flex-col w-full gap-4 bg-white border-2 border-gray-900 ham-shadow--active p-12 rounded-3xl text-gray-900 mt-6">
      <p class="font-display font-semibold text-center">
        <span>Retrieving claim page data ...</span>
      </p>
    </section>
    <template v-else>
      <template v-if="claimPageData">
        <section
          class="flex flex-col w-full gap-4 bg-white border-2 border-gray-900 ham-shadow--active p-12 rounded-3xl text-gray-900 mt-6">
          <div class="flex flex-wrap lg:grid lg:grid-cols-2 gap-2">
            <div class="flex flex-col gap-4">
              <p class="text-display-sm uppercase font-semibold font-display">{{
                claimPageData.tokenMetadata.title
              }}
                <span class="lowercase font-medium text-lg"><span class="mx-1">by</span> {{
                  truncate(claimPageData.contract.owner) }}</span>
              </p>
              <p class="text-display text-lg font-semibold">{{ claimPageData.tokenMetadata.description }}</p>
              <div class="flex flex-col justify-between h-full gap-4">
                <div class="grid grid-cols-3 gap-2">
                  <div class="border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl">
                    <p class="text-center uppercase text-display font-semibold text-gray-500">Minting price</p>
                    <p class="text-center uppercase text-display font-semibold">{{ claimPageData.mintRules.price }} ETH
                    </p>
                  </div>
                  <div class="border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl">
                    <p class="text-center uppercase text-display font-semibold text-gray-500">Total minted</p>
                    <p class="text-center uppercase text-display font-semibold">
                      {{ claimPageData.mintRules.totalSupply }} / {{ (maxSupply === 0 || maxSupply === '0') ? '∞' :
                        maxSupply }}</p>
                  </div>
                  <div class="border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl">
                    <p class="text-center uppercase text-display font-semibold text-gray-500">Type</p>
                    <p v-html="claimPageData.mintRules.isLimited ? 'Limited' : 'Unlimited'"
                      class="text-center uppercase text-display font-semibold"></p>
                  </div>
                </div>
                <div class="flex flex-col gap-8">
                  <div class="text-center">
                    <p class="uppercase text-display font-semibold text-gray-500 flex items-center justify-center">
                      <Icon icon="calendar" class="mr-1" />Claiming Starting Date
                    </p>
                    <p class="mt-1">
                      {{ startDate ?? 'Not set' }}</p>
                  </div>
                  <div class="text-center">
                    <p class="uppercase text-display font-semibold text-gray-500 flex items-center justify-center">
                      <Icon icon="calendar" class="mr-1" />Claiming Ending Date
                    </p>
                    <p class="mt-1">
                      {{ endDate ?? 'Not set' }}</p>
                  </div>
                </div>
                <CTA :disabled="!wallet" @click="mintModalIsOpen = true" size="xl" color="primary">
                  <span v-if="wallet">claim now - {{ claimPageData.mintRules.price }} ETH</span>
                  <span v-else>connect your wallet to claim</span>
                </CTA>
              </div>
            </div>
            <div class="border-2 border-gray-900 rounded-3xl w-[425px] h-[425px] overflow-hidden ml-auto">
              <IMG v-if="claimPageData.tokenMetadata.imgURL" :image="claimPageData.tokenMetadata.imgURL" alt="NFT Image"
                class="h-full w-full object-cover" />
            </div>
          </div>
        </section>
      </template>
      <span v-else class="font-display font-semibold">This is not a valid Claim Page</span>
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
            imgURL: this.tokenEditionMetadata[1],
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
          console.log(error)
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
        console.log(error);
        this.error = error
        this.transactionFinished = true
        this.isMinting = false
      }
    },
  },
}
</script>