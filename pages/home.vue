<template>
  <main class="lg:container mx-auto pb-6">
    <section
      class="flex flex-col bg-transparent lg:bg-white border-b-2 lg:border-2 border-gray-900 ham-shadow--active--desktop rounded-none lg:rounded-3xl text-gray-900 mt-0 pb-6 lg:mt-6 gap-2 lg:gap-4">
      <h2 class="font-display text-display-sm uppercase font-semibold pl-6 pt-6 mb-2 lg:mb-4">
        contracts
      </h2>
      <template v-if="isFetchingContracts">
        <p
          class="flex gap-2 mx-4 lg:mx-6 p-12 items-center justify-center border border-gray-900 rounded-xl bg-gray-200">
          <span>Fetching Contracts</span>
          <Icon icon="refresh-cw-03" class="animate-spin" />
        </p>
      </template>
      <template v-else>
        <div v-if="numberOfContracts === 0" class="border border-gray-900 bg-gray-200 rounded-3xl py-36 mx-4 sm:mx-6">
          <p class="text-center pb-2">
            There are no contracts yet. Once you create one, it will be displayed here
          </p>
          <CTA v-if="numberOfContracts === 0" color="primary" size="lg" iconLeft="plus" class="max-w-fit mx-auto"
            @click="handleShowCreateModal">
            Create
          </CTA>
        </div>
        <ul v-else class="flex max-h-[300px] overflow-y-auto lg:flex-wrap items-center gap-3 overflow-x-auto px-6 pt-1">
          <li v-for="(item, index) in contracts" :key="index"
            class="border-2 border-gray-900 rounded-xl bg-white p-4 gap-4 min-w-[288px] max-w-[288px] ham-shadow"
            :class="{
              'mr-auto': index === numberOfContracts - 1,
            }">
            <NuxtLink :to="`/contract/${item.contractAddress}`">
              <p class="text-gray-900 font-semibold">
                {{ truncate(item.contractAddress) }}
              </p>
              <p class="text-gray-500 mb-3 line-clamp-1">{{ item.name }}</p>
              <div class="grid grid-cols-2 gap-1 items-center">
                <Badge :color="item.label === 'ERC 721 EDITION' ? 'indigo' : 'success'" size="xs" :label="item.label" />
                <p class="max-w-full text-xs ml-auto text-ellipsis overflow-hidden">{{ item.symbol }}</p>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </template>
    </section>
    <section
      class="bg-transparent lg:bg-white border-b-2 lg:border-2 border-gray-900 ham-shadow--active--desktop rounded-none lg:rounded-3xl text-gray-900 mt-0 lg:mt-6 pb-6">
      <h3 class="font-display font-semibold text-display-sm pt-6 pl-6 uppercase mb-4">
        Claim Pages
      </h3>
      <p v-if="isFetchingClaimPages"
        class="flex gap-2 mx-4 lg:mx-6 p-12 items-center justify-center border border-gray-900 rounded-xl bg-gray-200">
        <span>Checking if claim pages exist for any of your contracts...</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
      <template v-else>
        <template v-if="claimPages && claimPages.length">
          <p class="mb-4 pl-6 font-semibold">
            Visiting these Claim Pages you can mint the
            tokens
          </p>
          <ul v-if="claimPages"
            class="flex max-h-[1000px] overflow-auto lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1 px-6">
            <li v-for="(c, i) in claimPages" :key="`claim-page-${i}`">
              <NuxtLink :to="`/c/${c.url}`">
                <Card class="ham-shadow cursor-pointer" v-bind="{ ...c.metadata, badgeColor: 'warning' }" />
              </NuxtLink>
            </li>
          </ul>
        </template>
        <p v-else class="border border-gray-900 bg-gray-200 rounded-3xl py-36 mx-4 sm:mx-6 text-center">There are no
          claim
          pages</p>
      </template>
    </section>
    <section
      class="bg-transparent lg:bg-white lg:border-2 border-gray-900 ham-shadow--active--desktop pb-6 rounded-none lg:rounded-3xl text-gray-900 mt-0 lg:mt-6">
      <CardsList :cards="tokens && tokens.map((t) => { return { ...t.metadata, tokenId: t.tokenId } })"
        :isFetching="isFetchingTokens && !isNotTokenOwner" title="Tokens" @view="handleClick($event)" />
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import navbarRoutes from "@/data/navbar.json";
import { editionNormalizer } from "@/utils/normalizers/blockscoutMetadataNormalizer";
import {
  getNumberOfEditionContractsForCreator,
  getEditionCreatorContractAtIndex,
  getEditionContractNameAndSymbol,
  getNumberOfStandardContractsForCreator,
  getStandardCreatorContractAtIndex,
  getStandardContractNameAndSymbol,
  getAllNftsForWallet,
  getContractType,
  getStandardTokenUri,
  getMetadataFromTokenUri,
  getClaimPages as listClaimPages,
} from "@/utils/contractUtilities";
import { truncateAddress } from "@/utils/truncateAddress";

definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      contracts: [],
      claimPages: [],
      tokens: [],
      isFetchingContracts: false,
      isFetchingClaimPages: false,
      isFetchingTokens: false,
      isNotTokenOwner: false,
    };
  },
  computed: {
    ...mapGetters(['isConnected', 'wallet', 'chainId', 'isDesktop', 'currentTokenIndex', 'visibleTokens']),
    navbarRoutes() {
      return navbarRoutes.routes;
    },
    numberOfContracts() {
      return (this.contracts && this.contracts.length) ?? 0;
    },
    numberOfVisibleTokens() {
      return this.visibleTokens ? this.visibleTokens.length : 0
    },
  },
  watch: {
    currentTokenIndex(newValue, oldValue) {
      if (oldValue === 0 && newValue === -1) {
        // Prev has been pressed on first element
        const newIndex = this.numberOfVisibleTokens - 1
        this.setCurrentTokenIndex(newIndex)
        this.handleClick(newIndex)
      }
      if (oldValue === this.numberOfVisibleTokens - 1 && newValue === this.numberOfVisibleTokens) {
        // Next has been pressed on last element
        const newIndex = 0
        this.setCurrentTokenIndex(newIndex)
      }
      if (oldValue !== -1 && newValue !== oldValue) {
        // Element has been pressed
        this.handleClick(newValue)
      }
    }
  },
  async mounted() {
    const localContracts = this.getContractsFromLocalStorage();
    const localTokens = this.getTokensFromLocalStorage();
    const localClaimPages = this.getClaimPagesFromLocalStorage();

    this.contracts = localContracts ? localContracts : []
    this.getContracts();

    this.tokens = localTokens ? localTokens : [];
    this.getTokens();

    // Claim pages are fetched at this.getContracts()
    this.claimPages = localClaimPages ? localClaimPages : [];
  },
  methods: {
    ...mapActions(['setCurrentTokenIndex', 'setModalData', 'setShowGeneralModal', 'setSlideOverData', 'setShowSlideOver']),
    truncate(address) {
      return truncateAddress(address);
    },
    getContractsFromLocalStorage() {
      const contracts = JSON.parse(localStorage.getItem(`contractsInventory-${this.wallet}`)) ?? []
      return contracts;
    },
    getTokensFromLocalStorage() {
      const tokens = JSON.parse(localStorage.getItem(`tokensInventory-${this.wallet}`)) ?? [];
      return tokens;
    },
    getClaimPagesFromLocalStorage() {
      const claimPages =
        JSON.parse(localStorage.getItem(`claimPagesInventory-${this.wallet}`)) ?? [];
      return claimPages;
    },
    async getClaimPagesForContract(address) {
      const claimPages = await listClaimPages(address);
      this.isFetchingClaimPages = false;
      claimPages.forEach((e) => this.updateClaimPages(e));
    },
    getContracts() {
      this.getEditionContractsForWallet(this.wallet);
      this.getStandardContractsForWallet(this.wallet);
    },
    async getTokens() {
      const allNfts = await getAllNftsForWallet(this.wallet);
      if (allNfts) {
        const uniqueContracts = allNfts && allNfts.length && allNfts.map((e) => e.token.address);
        if (allNfts.length === 0) {
          this.isFetchingTokens = false;
        }
        uniqueContracts && uniqueContracts.forEach((e) => {
          getContractType(e).then((res) => {
            const contractType = res;
            const collection = allNfts.find(
              (collection) => collection.token.address === e
            );
            if (contractType === "ERC 721 EDITION") {
              collection.token_instances.forEach((token) => {
                this.totalNumberOfTokens++;
                const nft = editionNormalizer(collection, token);
                nft.metadata.badgeColor = 'indigo'
                this.updateTokens(nft);
              });
            }
            if (contractType === "ERC 721") {
              collection.token_instances.forEach((token) => {
                this.totalNumberOfTokens++;
                getStandardTokenUri(collection.token.address, token.id).then(
                  (uri) => {
                    getMetadataFromTokenUri(uri).then((metadata) => {
                      const nft = {
                        ...metadata,
                        tokenId: token.id,
                        contract: {
                          contractAddress: collection.token.address,
                          name: collection.token.name,
                          symbol: collection.token.symbol,
                        },
                      };
                      nft.metadata.badgeColor = 'success'
                      this.updateTokens(nft);
                    });
                  }
                );
              });
            }
          });
        });
      } else {
        this.isFetchingTokens = false;
      }
    },
    async getEditionContractsForWallet(wallet) {
      try {
        const numberOfEditionContractsOfCreator = parseInt(
          await getNumberOfEditionContractsForCreator(this.wallet)
        );
        this.totalNumberOfContractsOfCreator += numberOfEditionContractsOfCreator;

        for (let i = 0; i < numberOfEditionContractsOfCreator; i++) {
          getEditionCreatorContractAtIndex(wallet, i).then((res) => {
            const contractAddress = res;
            getEditionContractNameAndSymbol(contractAddress).then((res) => {
              const { name, symbol } = res;
              this.updateContracts({
                contractAddress,
                name,
                symbol,
                label: "ERC 721 EDITION",
              });
            });
          });
        }
      } catch (error) {
        console.error(error);
      }
      return null;
    },
    async getStandardContractsForWallet(wallet) {
      try {
        const numberOfStandardContractsOfCreator = parseInt(
          await getNumberOfStandardContractsForCreator(this.wallet)
        );
        this.totalNumberOfContractsOfCreator += numberOfStandardContractsOfCreator;

        for (let i = 0; i < numberOfStandardContractsOfCreator; i++) {
          getStandardCreatorContractAtIndex(wallet, i).then((res) => {
            const contractAddress = res;
            getStandardContractNameAndSymbol(contractAddress).then((res) => {
              const { name, symbol } = res;
              this.updateContracts({
                contractAddress,
                name,
                symbol,
                label: "ERC 721",
              });
            });
          });
        }
      } catch (error) {
        console.error(error);
      }
      return null;
    },
    async handleClick(index) {
      if (index !== undefined && index !== -1) {
        const token = this.visibleTokens[index]
        const pageUrl = token && token.url
        if (pageUrl) {
          this.$router.push(`/c/${pageUrl}`)
        } else {
          const data = token
          console.log({ token })
          if (this.isDesktop) {
            this.setModalData({
              title: 'token',
              components: ["Token"],
              data: { ...data, tokenId: token.tokenId ? token.tokenId : token.id }
            });
            this.setShowGeneralModal(true);
          } else {
            this.setSlideOverData({
              title: 'token',
              components: ["Token"],
              data: { ...data, tokenId: token.tokenId ? token.tokenId : token.id }
            });
            this.setShowSlideOver(true);
          }
          this.setCurrentTokenIndex(index);
        }
      }
    },
    handleShowCreateModal() {
      if (this.isDesktop) {
        this.setModalData({ components: ['CreatePagesList', 'MintList', 'CreateContractsList'] })
        this.setShowGeneralModal(true)
      } else {
        this.setSlideOverData({ components: ['CreatePagesList', 'MintList', 'CreateContractsList'] })
        this.setShowSlideOver(true)
      }
    },
    updateClaimPages(claimPage) {
      const isNewClaimPage = !this.claimPages.some(
        (element) => element.url === claimPage.url
      );

      if (isNewClaimPage) {
        const claim = claimPage
        claim.metadata.badgeColor = 'warning'
        claim.metadata.url = claim.url
        this.claimPages.push(claim);
        localStorage.setItem(
          `claimPagesInventory-${this.wallet}`,
          JSON.stringify(this.claimPages)
        );
      }
    },
    updateContracts(contract) {
      const isNewContract = !this.contracts.some(
        (element) => element.contractAddress === contract.contractAddress
      );

      if (isNewContract) {
        this.contracts.push(contract);
        localStorage.setItem(
          `contractsInventory-${this.wallet}`,
          JSON.stringify(this.contracts)
        );
      }

      if (contract.label === "ERC 721 EDITION") {
        this.getClaimPagesForContract(contract.contractAddress);
      }

      if (this.numberOfContracts === this.totalNumberOfContractsOfCreator) {
        this.isFetchingContracts = false;
      }
    },
    updateTokens(nft) {
      this.isFetchingTokens = false;
      const isNewNft = !this.tokens.some(
        ({ contract: { contractAddress }, tokenId }) =>
          contractAddress === nft.contract.contractAddress &&
          tokenId === nft.tokenId
      );
      if (isNewNft) {
        this.tokens.push(nft);
        localStorage.setItem(`tokensInventory-${this.wallet}`, JSON.stringify(this.tokens));
      }
    },
  },
};
</script>
z