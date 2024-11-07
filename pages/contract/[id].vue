<template>
  <main class="container mx-auto pb-8">
    <section
      class="relative lg:bg-white border-b-2 lg:border-2 border-gray-900 ham-shadow--active--desktop p-6 lg:rounded-3xl text-gray-900 mt-6">
      <h1 class="font-display font-semibold text-display-sm uppercase mb-4">Contract</h1>
      <p v-if="contractType === 'ERC 721'" class="text-gray-500 mb-4">
        <span>You can use the same ERC-721 contract to mint NFTs for yourself</span>
      </p>
      <p v-if="contractType === 'ERC 721 EDITION'" class="text-gray-500 mb-4">
        <span v-if="!claimPages">
          To enable minting for this contract and upload your NFT media
          you'll need to create a
          claim page for people to mint
        </span>
        <span v-else>You can use the same contract to enable minting for different NFTs through several Claim
          Pages</span>
      </p>
      <div v-if="contract && contractType" class="lg:grid grid-cols-3 gap-4 mb-4">
        <div>
          <p class="flex items-center">
            <span class="font-semibold mr-2">Contract Address</span>
            <a :href="`https://explorer.ham.fun/address/${contractAddress}`" target="_blank"
              class="text-gray-500 hover:text-black flex items-center gap-2">
              <span>{{ truncate(contractAddress) }}</span>
              <Icon icon="link-external-01" />
            </a>
          </p>
          <p><span class="font-semibold mr-2">Name</span><span class="text-gray-500">{{ contract.name }}</span></p>
        </div>
        <div class="mb-4 lg:mb-0">
          <p><span class="font-semibold mr-2">Symbol</span><span class="text-gray-500">{{ contract.symbol
              }}</span></p>
          <p><span class="font-semibold mr-2">Type</span><span class="text-gray-500">{{ contract.label }}</span></p>
        </div>
        <template v-if="wallet === contractOwner">
          <CTA v-if="contractType === 'ERC 721 EDITION'" class="w-full lg:max-w-48 lg:ml-auto" color="primary"
            @click="handleCreate" size="lg">
            Create a Claim Page
          </CTA>
          <CTA v-if="contractType === 'ERC 721'" class="w-full lg:max-w-48 lg:ml-auto" color="primary"
            @click="handleCreate" size="lg">
            Mint your own token
          </CTA>
        </template>
      </div>
      <p v-else
        class="flex gap-2 mx-auto p-12 items-center justify-center border border-gray-900 rounded-xl bg-gray-200">
        <span>Fetching contract</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
    </section>
    <section class="bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6">
      <h2 class="font-display font-semibold text-display-sm uppercase mb-4">Your Tokens</h2>
      <p v-if="fetchingTokens" class="flex gap-2"><span>Fetching the contract tokens</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
      <template v-else>
        <ul v-if="tokenInventory && tokenInventory.length" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <li v-for="(card, index) in tokenInventory" :key="`token-card-${index}`" @click="handleClick(index)">
            <Card class="ham-shadow cursor-pointer" v-bind="card.metadata" />
          </li>
        </ul>
        <template v-else>
          <p>You don't own tokens of this contract</p>
        </template>
      </template>
    </section>
    <section class="bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6">
      <h3 class="font-display font-semibold text-display-sm uppercase mb-4">Claim Pages</h3>
      <p v-if="fetchingClaimPages" class="flex gap-2"><span>Checking if claim pages exits to mint some ...</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
      <p v-else class="mb-4">
        <template v-if="contractType === 'ERC 721 EDITION'">
          <span v-if="claimPages && claimPages.length" class="font-semibold">Visiting these Claim Pages you can mint the
            tokens</span>
          <span v-else class="font-semibold">There are not</span>
        </template>
        <template v-if="contractType === 'ERC 721'">
          <span class="mb-4">Regular ERC-721 contracts are not suitable to have Claim Pages, which allow people to mint
            your NFTs.
            <br />You can use the ERC-721 contract <span class="font-semibold">to mint your own NFTs</span>, although no
            one else will be able to mint any.</span>
        </template>
      </p>
      <ul v-if="claimPages" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <li v-for="c, i in claimPages" :key="`claim-page-${i}`">
          <NuxtLink :to="`/c/${c.url}`">
            <Card class="ham-shadow cursor-pointer" v-bind="c.metadata" />
          </NuxtLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getContractInfo, listClaimPages } from "@/utils/contractListingUtilities";
import { getStandardTokenUri, getContractType, getMetadataFromTokenUri } from "@/utils/contractUtilities.js"
import { truncateAddress } from "@/utils/truncateAddress"
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
    ...mapGetters(["wallet"]),
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
        this.fetchingTokens = false
      }
    } else {
      const contract = await getContractInfo(this.contractAddress)
      this.contract = { ...contract }
    }
    this.fetchingContract = false
    console.log({ contract: this.contract })
    if (!this.contract.label) {
      console.log({ label: this.contract.label })
      const contractType = await getContractType(this.contractAddress)
      console.log({ contractType })
      this.contract['label'] = contractType
      localStorage.setItem(this.contractAddress, JSON.stringify(this.contract))
    }
    if (this.contract['label'] === 'ERC 721 EDITION') {
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
    ...mapActions(['setModalData', 'setShowGeneralModal']),
    async getTokenNFTsForWallet() {
      const BLOCK_EXPLORER_URL = import.meta.env.VITE_BLOCK_EXPLORER_URL;
      const getNFTsURL = `${BLOCK_EXPLORER_URL}/api/v2/addresses/${this.wallet}/nft?type=ERC-721`;
      const nftsRequest = await fetch(getNFTsURL);
      const nftsJSON = await nftsRequest.json();
      const nfts = nftsJSON.items;
      const contractNFTs = nfts && nfts.filter(c => c.token.address === this.contractAddress)
      const tokens = [...contractNFTs]
      if (tokens && tokens.length) {
        const firstToken = tokens[0]
        const isEdition = firstToken.metadata && firstToken.metadata.attributes && firstToken.metadata.attributes.some(attr => attr.trait_type === 'edition')
        if (!this.contract.label) {
          this.contract.label = isEdition ? 'ERC 721 EDITION' : 'ERC 721'
        }
        if (isEdition) {
          if (!this.tokenInventory || this.tokenInventory.length !== tokens.length) {
            this.tokenInventory = tokens.map(t => {
              t.metadata.type = 'ERC 721 EDITION'
              return { ...t }
            })
            localStorage.setItem(`tokens-${this.contractAddress}`, JSON.stringify(tokens))
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
        }
        this.fetchingTokens = false
      } else {
        this.fetchingTokens = false
      }
    },
    async handleClick(index) {
      const creation = this.tokenInventory[index]
      const data = creation.metadata
      this.setModalData({
        title: 'token',
        components: ["Token"],
        data: { ...data, tokenId: creation.tokenId ? creation.tokenId : creation.id }
      });
      this.setShowGeneralModal(true);
    },
    handleCreate() {
      if (this.contractType === 'ERC 721 EDITION') {
        localStorage.setItem('claimPageContract', JSON.stringify({
          contractAddress: this.contractAddress,
          name: this.contract.name,
          symbol: this.contract.symbol
        }))
        this.$router.push(stepper.steps[1].link)
      }
      if (this.contractType === 'ERC 721') {
        localStorage.setItem('contractAddress', JSON.stringify(this.contractAddress))
        localStorage.setItem(this.contractAddress, JSON.stringify(this.contract))
        this.$router.push(`/new-contract/${this.contractAddress}`)
      }
    },
    truncate(address) {
      return truncateAddress(address)
    }
  },
}
</script>