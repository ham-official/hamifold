<template>
  <main class="lg:container mx-auto pb-8">
    <section
      class="relative bg-transparent lg:bg-white border-b-2 lg:border-2 border-gray-900 ham-shadow--active--desktop rounded-none lg:rounded-3xl text-gray-900 mt-6 gap-2 py-6 p-2 lg:p-6">
      <h1 class="font-display font-semibold text-display-sm uppercase mb-4">Contract</h1>
      <h2 class="text-gray-600 mb-4"><span v-if="!claimPages">
          To enable minting for this contract and upload your NFT media
          you'll need to create a
          claim page for people to mint
        </span>
        <span v-else>You can use the same contract to enable minting for different NFTs through several Claim
          Pages</span>
      </h2>
      <div v-if="contract" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="">
          <p class="flex items-center">
            <span class="font-semibold mr-2">Contract Address</span>
            <a :href="`https://explorer.ham.fun/address/${contractAddress}`" target="_blank"
              class="text-gray-500 hover:text-black flex items-center gap-2">
              <span>{{ truncate(contractAddress) }}</span>
              <Icon icon="link-external-01" :no-size="true" class="w-4 h-4" />
            </a>
          </p>
          <p><span class="font-semibold mr-2">Name</span><span class="text-gray-500">{{ contract.name }}</span></p>
        </div>
        <div>
          <p><span class="font-semibold mr-2">Symbol</span><span class="text-gray-500">{{ contract.symbol
              }}</span></p>
          <p><span class="font-semibold mr-2">Type</span><span class="text-gray-500">{{ contract.label }}</span></p>
        </div>
        <div v-if="wallet === contractOwner" class="lg:ml-auto">
          <template v-if="contractType === 'ERC-721-EDITION'">
            <CTA color="primary" @click="handleCreate" size="lg" class="w-full lg:w-auto">
              Create a Claim Page
            </CTA>
          </template>
          <template v-if="contractType === 'ERC-721'">
            <CTA color="primary" @click="handleCreate" size="lg" class="w-full lg:w-auto">
              Mint your own token
            </CTA>
          </template>
        </div>
      </div>
      <p v-else class="flex gap-2"><span>Fetching contract</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
    </section>
    <section
      class="bg-transparent lg:bg-white lg:border-2 border-gray-900 ham-shadow--active--desktop rounded-none lg:rounded-3xl text-gray-900 mt-6 gap-2 py-6">
      <h3 class="font-display font-semibold text-display-sm uppercase mb-4 pl-2 lg:px-6">Claim Pages</h3>
      <p v-if="fetchingClaimPages" class="flex gap-2 pl-2 lg:px-6"><span>Checking if claim pages exits to mint some
          ...</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
      <p v-else class="mb-4 pl-2 lg:px-6">
        <template v-if="contractType === 'ERC-721-EDITION'">
          <span v-if="claimPages && claimPages.length" class="font-semibold">Visiting these Claim Pages you can mint the
            tokens</span>
          <span v-else class="font-semibold">There are not</span>
        </template>
        <template v-if="contractType === 'ERC-721'">
          <span class="mb-4">Regular ERC-721 contracts are not suitable to have Claim Pages, which allow people to mint
            your NFTs.
            <br />You can use the ERC-721 contract <span class="font-semibold">to mint your own NFTs</span>, although no
            one else will be able to mint any.</span>
        </template>
      </p>
      <ul v-if="claimPages" class="flex overflow-x-auto lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1 pl-2 lg:px-6">
        <li v-for="c, i in claimPages" :key="`claim-page-${i}`">
          <NuxtLink :to="`/c/${c.url}`">
            <Card class="ham-shadow cursor-pointer" v-bind="c.metadata" />
          </NuxtLink>
        </li>
      </ul>
    </section>
    <section
      class="bg-transparent lg:bg-white border-b-2 lg:border-2 border-gray-900 ham-shadow--active--desktop rounded-none lg:rounded-3xl text-gray-900 mt-6 gap-2 py-6">
      <h2 class="font-display font-semibold text-display-sm uppercase mb-4 pl-2 lg:px-6">Your Tokens</h2>
      <p v-if="fetchingTokens" class="flex gap-2 pl-2"><span>Fetching the contract tokens</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
      <template v-else>
        <ul v-if="tokenInventory && tokenInventory.length"
          class="flex overflow-x-auto lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1 pl-2 lg:px-6">
          <li v-for="(card, index) in tokenInventory" :key="`token-card-${index}`" @click="handleClick(index)">
            <Card class="ham-shadow cursor-pointer" v-bind="card.metadata" />
          </li>
        </ul>
        <template v-else>
          <p class="pl-2 lg:pl-6">You don't own tokens of this contract</p>
        </template>
      </template>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getContractInfo, getContractType, listClaimPages } from "@/utils/contractListingUtilities";
import { getStandardTokenUri, getMetadataFromTokenUri } from '@/utils/contractUtilities.js'
import { truncateAddress } from "@/utils/truncateAddress";
import stepper from "@/data/stepper.json"
export default {
  data() {
    return {
      claimPages: null,
      contract: null,
      fetchingClaimPages: false,
      fetchingContract: false,
      fetchingTokens: false,
      tokenInventory: null,
    }
  },
  computed: {
    ...mapGetters(['wallet', 'currentTokenIndex']),
    contractAddress() {
      return this.$route && this.$route.params.id
    },
    contractType() {
      return this.contract && this.contract.label
    },
    contractOwner() {
      return this.contract && this.contract.owner
    },
  },
  watch: {
    currentTokenIndex(newValue, oldValue) {
      console.log({ newValue })
      this.handleClick(newValue)
    }
  },
  async mounted() {
    this.fetchingContract = true
    this.fetchingTokens = true
    this.fetchingClaimPages = true
    const contractFromStorage = localStorage.getItem(this.contractAddress)
    if (contractFromStorage) {
      this.contract = JSON.parse(contractFromStorage)
      const claims = localStorage.getItem(`claims-${this.contractAddress}`)
      if (claims) {
        this.claimPages = JSON.parse(claims)
      }
      this.fetchingClaimPages = false
      const tokens = localStorage.getItem(`tokens-${this.contractAddress}`)
      if (tokens) {
        this.tokenInventory = JSON.parse(tokens)
        this.setVisibleTokens(this.tokenInventory)
        this.fetchingTokens = false
      }
    } else {
      const contract = await getContractInfo(this.contractAddress)
      this.contract = { ...contract }
    }
    this.fetchingContract = false
    if (!this.contract.label) {
      const contractType = await getContractType(this.contractAddress)
      this.contract['label'] = contractType
      localStorage.setItem(this.contractAddress, JSON.stringify(this.contract))
    }
    if (this.contract['label'] === 'ERC-721-EDITION') {
      listClaimPages(this.contract.owner).then(pages => {
        this.fetchingClaimPages = false;
        if (pages) {
          const contractPages = pages.filter(p => p.contract.contractAddress === this.contractAddress)
          if (contractPages && contractPages.length && (!this.claimPages || this.claimPages.length !== contractPages.length)) {
            this.claimPages = contractPages.map(p => { p.metadata.type = p.type; p.metadata.badgeColor = 'primary-invert'; return { ...p } })
            localStorage.setItem(`claims-${this.contractAddress}`, JSON.stringify(this.claimPages))
          }
        }
      })
    } else {
      this.fetchingClaimPages = false;
    }
    if (this.wallet) {
      this.getTokenNFTsForWallet()
    } else {
      this.fetchingTokens = false
    }
  },
  methods: {
    ...mapActions(['setModalData', 'setShowGeneralModal', 'setCurrentTokenIndex', 'setSlideOverData', 'setShowSlideOver', 'setVisibleTokens']),
    async getTokenNFTsForWallet() {
      const BLOCK_EXPLORER_URL = import.meta.env.VITE_BLOCK_EXPLORER_URL;
      const getNFTsURL = `${BLOCK_EXPLORER_URL}/api/v2/addresses/${this.wallet}/nft?type=ERC-721`;
      const request = await fetch(getNFTsURL);
      const jsonPromise = await request.json();
      const nfts = jsonPromise.items;
      const contractNFTs = nfts && nfts.filter(c => c.token.address === this.contractAddress)
      const tokens = [...contractNFTs]
      if (tokens && tokens.length) {
        const firstToken = tokens[0]
        if (firstToken.metadata) {
          if (!this.tokenInventory || this.tokenInventory.length !== tokens.length) {
            this.tokenInventory = tokens.map(t => {
              t.metadata.type = 'ERC-721-EDITION'
              return { ...t }
            })
            localStorage.setItem(`tokens-${this.contractAddress}`, JSON.stringify(tokens))
            if (!this.contract.label) {
              this.contract.label = 'ERC-721-EDITION'
            }
          }
        } else {
          const erc721Tokens = []
          tokens.forEach((token) => {
            getStandardTokenUri(this.contractAddress, token.id).then(
              (uri) => {
                getMetadataFromTokenUri(uri).then((metadata) => {
                  const nft = {
                    ...metadata,
                    tokenId: token.id,
                    contract: {
                      contractAddress: this.contractAddress,
                      name: this.contract.name,
                      symbol: this.contract.symbol,
                    },
                  };
                  erc721Tokens.push(nft)
                  if (this.fetchingTokens) {
                    this.fetchingTokens = false
                  }
                  if (erc721Tokens.length === tokens.length) {
                    if (!this.tokenInventory || this.tokenInventory.length !== erc721Tokens.length) {
                      this.tokenInventory = [...erc721Tokens]
                      localStorage.setItem(`tokens-${this.contractAddress}`, JSON.stringify(erc721Tokens))
                    }
                  }
                });
              }
            );
          });
          if (!this.contract.label) {
            this.contract.label = 'ERC-721'
          }
        }
        localStorage.setItem(this.contractAddress, JSON.stringify(this.contract))
        this.fetchingTokens = false
      } else {
        this.fetchingTokens = false
      }
    },
    async handleClick(index) {
      const creation = this.tokenInventory[index]
      const data = creation.metadata
      const modalData = {
        title: 'token',
        components: ["Token"],
        data: { ...data, tokenId: creation.tokenId ? creation.tokenId : creation.id }
      }
      if (this.isDesktop) {
        this.setModalData(modalData);
        this.setShowGeneralModal(true);
      } else {
        this.setSlideOverData(modalData);
        this.setShowSlideOver(true);
      }
      this.setCurrentTokenIndex(index);
    },
    handleCreate() {
      if (this.contractType === 'ERC-721-EDITION') {
        localStorage.setItem('claimPageContract', JSON.stringify({
          contractAddress: this.contractAddress,
          name: this.contract.name,
          symbol: this.contract.symbol
        }))
        this.$router.push(stepper.steps[1].link)
      }
      if (this.contractType === 'ERC-721') {
        localStorage.setItem('contractAddress', JSON.stringify(this.contractAddress))
        localStorage.setItem(this.contractAddress, JSON.stringify(this.contract))
        this.$router.push(`/new-contract/${this.contractAddress}`)
      }
    },
    truncate(address) {
      return truncateAddress(address);
    },
  },
}
</script>
