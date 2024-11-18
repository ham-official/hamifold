<template>
  <main class="container mx-auto pb-8">
    <section
      class="relative sm:bg-white border-b-2 sm:border-2 border-gray-900 ham-shadow--active--desktop p-4 sm:p-6 sm:rounded-3xl text-gray-900 mt-6">
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
      <div v-if="contract && contractType" class="lg:grid lg:grid-cols-3 gap-4 mb-4">
        <div>
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
        class="flex gap-2 mx-auto px-4 py-36 sm:px-0  items-center justify-center border border-gray-900 rounded-xl bg-gray-200">
        <span>Fetching contract</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
    </section>
    <SectionWithListOfCards title="your tokens" name="tokens" :list="tokens" :isFetching="fetchingTokens"
      fetchingText="Fetching the contract tokens..." :listItemIsLink="false">
      <template #empty>
        <p class="text-center">
          You don't have tokens of this contract yet.
        </p>
      </template>
    </SectionWithListOfCards>
    <SectionWithListOfCards title="claim pages" name="claims"
      content-subtitle="By visiting these Claim Pages you can mint the tokens" :list="claimPages"
      :isFetching="fetchingClaimPages" :hasBorderBottomInMobile="false"
      fetchingText="Checking if claim pages exist to mint some...">
      <template #empty>
        <p v-if="contractType === 'ERC 721 EDITION'" class="lg:max-w-sm mx-auto">
          <span v-if="claimPages && claimPages.length" class="font-semibold">Visiting these Claim Pages you can mint
            the
            tokens</span>
          <span v-else class="font-semibold">There are not</span>
        </p>
        <p v-if="contractType === 'ERC 721'" class="lg:max-w-sm mx-auto flex flex-col gap-3">
          <span>Regular ERC-721 contracts are not suitable to have Claim Pages, which
            allow people
            to mint
            your NFTs.
          </span>
          <span>You can use the ERC-721 contract <span class="font-semibold">to mint your own
              NFTs</span>, although no
            one else will be able to mint any.</span>
        </p>
      </template>
    </SectionWithListOfCards>
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
      contract: null,
      claimPages: null,
      tokens: null,
      fetchingClaimPages: false,
      fetchingContract: false,
      fetchingTokens: false,
    }
  },
  computed: {
    ...mapGetters(['wallet', 'isDesktop', 'currentTokenIndex']),
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
  mounted() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['setCurrentTokenIndex', 'setModalData', 'setShowGeneralModal', 'setSlideOverData', 'setShowSlideOver']),
    async fetchData() {
      this.fetchFromLocalStorage()
      if (this.fetchingContract) {
        await this.fetchContractFromApi()
      }
      // Even if claims and tokens exist in local storage, api is used to update in background
      this.fetchClaimsFromApi()
      this.fetchTokensFromApi()

    },
    fetchFromLocalStorage() {
      this.fetchingContract = true
      this.fetchingTokens = true
      this.fetchingClaimPages = true
      this.fetchContractFromLocalStorage()
      this.fetchClaimsFromLocalStorage()
      this.fetchTokensFromLocalStorage()
    },
    fetchContractFromLocalStorage() {
      const contractFromStorage = localStorage.getItem(this.contractAddress)
      if (contractFromStorage) {
        // First try for contract Item
        this.contract = JSON.parse(contractFromStorage)
        this.fetchingContract = false
      } else {
        // If not found, filter from contracts Inventory item
        const contractInventoryFromStorage = localStorage.getItem(`contractsInventory-${this.wallet}`)
        if (contractInventoryFromStorage) {
          const inventory = JSON.parse(contractInventoryFromStorage)
          const contracts = inventory.filter(c => c.contractAddress === this.contractAddress)
          this.contract = contracts.length ? contracts[0] : null
          // Store contract info as item for faster access on next load
          localStorage.setItem(this.contractAddress, JSON.stringify(this.contract))
          this.fetchingContract = false
        }
      }
    },
    fetchClaimsFromLocalStorage() {
      const contractClaimsFromStorage = localStorage.getItem(`claims-${this.contractAddress}`)
      if (contractClaimsFromStorage) {
        // First try for contract Claims Item
        const claims = JSON.parse(contractClaimsFromStorage)
        this.claimPages = claims
        this.fetchingClaimPages = false
      } else {
        // If not found, filter from claims Inventory item
        const claimsInventoryFromStorage = localStorage.getItem(`claimPagesInventory-${this.wallet}`)
        if (claimsInventoryFromStorage) {
          const claimPages = JSON.parse(claimsInventoryFromStorage)
          this.claimPages = claimPages.filter(page => page.c === this.contractAddress)
          // Store contract claims as item for faster access on next load
          localStorage.setItem(`claims-${this.contractAddress}`, JSON.stringify(this.claimPages))
          this.fetchingClaimPages = false
        }
      }
    },
    fetchTokensFromLocalStorage() {
      const contractTokensFromStorage = localStorage.getItem(`tokens-${this.contractAddress}`)
      if (contractTokensFromStorage) {
        // First try for contract Tokens Item
        const tokens = JSON.parse(contractTokensFromStorage)
        this.tokens = tokens
        this.fetchingTokens = false
      } else {
        // If not found, filter from token Inventory item
        const tokensInventoryFromStorage = localStorage.getItem(`tokensInventory-${this.wallet}`)
        if (tokensInventoryFromStorage) {
          const tokens = JSON.parse(tokensInventoryFromStorage)
          this.tokens = tokens.filter(page => page.contract.contractAddress === this.contractAddress)
          // Store contract claims as item for faster access on next load
          localStorage.setItem(`tokens-${this.contractAddress}`, JSON.stringify(this.tokens))
          this.fetchingClaimPages = false
        }
      }
    },
    async fetchContractFromApi() {
      const contract = await getContractInfo(this.contractAddress)
      this.contract = { ...contract }
      if (!this.contract.label) {
        const contractType = await getContractType(this.contractAddress)
        this.contract['label'] = contractType
        localStorage.setItem(this.contractAddress, JSON.stringify(this.contract))
      }
    },
    fetchClaimsFromApi() {
      if (this.contract['label'] === 'ERC 721 EDITION') {
        listClaimPages(this.contract.owner).then(pages => {
          if (pages) {
            const contractPages = pages.filter(p => p.contract.contractAddress === this.contractAddress)
            if (contractPages && contractPages.length && (!this.claimPages || this.claimPages.length !== contractPages.length)) {
              this.claimPages = contractPages.map(p => { p.metadata.type = p.type; p.metadata.badgeColor = 'warning'; p.metadata.url = p.url; return { ...p } })
              localStorage.setItem(`claims-${this.contractAddress}`, JSON.stringify(this.claimPages))
            }
          }
          this.fetchingClaimPages = false;
        })
      } else {
        // ERC 721 don't have claim pages, therefore no need to fetch
        this.fetchingClaimPages = false;
      }
    },
    fetchTokensFromApi() {
      if (this.wallet) {
        this.getTokenNFTsForWallet()
      } else {
        this.fetchingTokens = false
      }
    },
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
          if (!this.tokens || this.tokens.length !== tokens.length) {
            this.tokens = tokens.map(t => {
              t.metadata.type = 'ERC 721 EDITION',
                t.metadata.badgeColor = 'indigo'
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
                  nft.metadata.badgeColor = 'success'
                  erc721Tokens.push(nft)
                  if (this.fetchingTokens) {
                    this.fetchingTokens = false
                  }
                  if (erc721Tokens.length === tokens.length) {
                    if (!this.tokens || this.tokens.length !== erc721Tokens.length) {
                      this.tokens = [...erc721Tokens]
                      localStorage.setItem(`tokens-${this.contractAddress}`, JSON.stringify(erc721Tokens))
                    }
                  }
                });
              }
            );
          });
        }
      }
      this.fetchingTokens = false
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
        this.$router.push(`/mint-erc-721/${this.contractAddress}`)
      }
    },
    truncate(address) {
      return truncateAddress(address)
    }
  },
}
</script>