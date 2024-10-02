<template>
  <main class="container mx-auto py-6">
    <section
      class="flex flex-col w-full bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6"
      :class="{
        'gap-4': numberOfContracts > 0,
        'gap-2': numberOfContracts === 0,
      }"
    >
      <h2
        class="font-display text-display-sm uppercase font-semibold"
        :class="{
          'text-center': numberOfContracts === 0,
          'mb-4': numberOfContracts > 0,
        }"
      >
        contracts
      </h2>
      <p v-if="!isNotEditionContractOwner && !isNotStandardContractOwner && !contracts.length" class="flex gap-2">
        <span>Fetching Contracts</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
      <template v-if="numberOfContracts > 0">
        <ul v-if="contracts" class="flex flex-wrap items-center gap-3">
          <li
            v-for="(item, index) in contracts"
            :key="index"
            class="border-2 border-gray-900 rounded-xl bg-white p-4 gap-4 min-w-[288px] max-w-[288px] ham-shadow"
            :class="{
              'mr-auto': index === numberOfContracts - 1,
            }"
          >
            <NuxtLink :to="`/contract/${item.contractAddress}`">
              <p class="text-gray-900 font-semibold">
                {{ truncate(item.contractAddress) }}
              </p>
              <p class="text-gray-500 mb-3 line-clamp-1">{{ item.name }}</p>
              <div class="flex justify-between items-center">
                <Badge color="primary" size="sm" :label="item.label" />
                <p class="text-sm">{{ item.symbol }}</p>
              </div>
            </NuxtLink>
          </li>
        </ul>
        <template v-if="numberOfContracts === 0">
          <p class="text-center text-gray-400">
            Once you create a contract, it will be displayed here
          </p>
        </template>
      </template>
    </section>
    <section>
      <CardsList
        :cards="tokens && tokens.map((t) => t.metadata)"
        :isFetching="isFetchingTokens && !isNotTokenOwner"
        title="Tokens"
        @click="handleClick($event)"
      />
    </section>
    <section
      class="bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6"
    >
      <h3 class="font-display font-semibold text-display-sm uppercase mb-4">
        Claim Pages
      </h3>
      <p v-if="fetchingClaimPages" class="flex gap-2">
        <span>Checking if claim pages exits to mint some ...</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </p>
      <p v-else class="mb-4">
        <span v-if="claimPages && claimPages.length" class="font-semibold"
          >Visiting these Claim Pages you can mint the tokens</span
        >
        <span v-if="isNotClaimPageOwner" class="font-semibold"
          >There are no claim pages</span
        >
      </p>
      <ul
        v-if="claimPages"
        class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <li v-for="(c, i) in claimPages" :key="`claim-page-${i}`">
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
      tokens: [],
      claimPages: [],
      ethersRPCProvider: null,
      ethersRPCSigner: null,
      isFetchingContracts: false,
      isFetchingTokens: false,
      isNotTokenOwner: false,
      numberOfStandardContracts: 0,
      isNotEditionContractOwner: false,
      isNotStandardContractOwner: false,
      totalNumberOfContracts: 0,
    };
  },
  computed: {
    ...mapGetters(["isConnected", "wallet", "chainId"]),
    navbarRoutes() {
      return navbarRoutes.routes;
    },
    numberOfContracts() {
      return (this.contracts && this.contracts.length) ?? 0;
    },
    isNotClaimPageOwner() {
      console.log(
        "claimPage",
        this.isNotEditionContractOwner,
        this.isFetchingContracts,
        this.claimPages.length
      );
      return (
        this.isNotEditionContractOwner ||
        (!this.isFetchingContracts && !this.claimPages.length)
      );
    },
    fetchingClaimPages() {
      return !this.isNotClaimPageOwner && !this.claimPages.length;
    },
  },
  watch: {
    isNotEditionContractOwner(newValue, oldValue) {
      this.checkIsNotContractOwner();
    },
  },
  async mounted() {
    const localContracts = this.getContractsFromLocalStorage();
    const localTokens = this.getTokensFromLocalStorage();
    const localClaimPages = this.getClaimPagesFromLocalStorage();

    this.contracts = localContracts ? localContracts : [];
    this.getContracts();

    this.tokens = localTokens ? localTokens : [];
    this.getTokens();

    // Claim pages are fetched at this.getContracts()
    this.claimPages = localClaimPages ? localClaimPages : [];
  },
  methods: {
    ...mapActions(["setModalData", "setShowGeneralModal"]),
    truncate(address) {
      return truncateAddress(address);
    },
    checkIsNotContractOwner() {
      if (this.isNotEditionContractOwner && this.isNotStandardContractOwner) {
        this.isFetchingContracts = false;
      }
    },
    getContractsFromLocalStorage() {
      return JSON.parse(localStorage.getItem("contractInventory"));
    },
    getTokensFromLocalStorage() {
      const tokens = JSON.parse(localStorage.getItem("tokenInventory")) ?? [];
      return tokens;
    },
    getClaimPagesFromLocalStorage() {
      const claimPages =
        JSON.parse(localStorage.getItem("claimPagesInventory")) ?? [];
      return claimPages;
    },
    async getClaimPagesForContract(address) {
      const claimPages = await listClaimPages(address);
      console.log({ claimPages });
      claimPages.forEach((e) => this.updateClaimPages(e));
    },
    getContracts() {
      this.isFetchingContracts = this.numberOfContracts === 0;
      this.getEditionContractsForWallet(this.wallet);
      this.getStandardContractsForWallet(this.wallet);
    },
    async getTokens() {
      this.isFetchingTokens = !this.tokens.length;
      const allNfts = await getAllNftsForWallet(this.wallet);
      const uniqueContracts = allNfts.map((e) => e.token.address);

      if (allNfts.length === 0) {
        this.isNotTokenOwner = true;
      }

      uniqueContracts.forEach((e) => {
        getContractType(e).then((res) => {
          const contractType = res;
          const collection = allNfts.find(
            (collection) => collection.token.address === e
          );

          if (contractType === "ERC-721-EDITION") {
            collection.token_instances.forEach((token) => {
              this.totalNumberOfTokens++;
              const nft = editionNormalizer(collection, token);
              this.updateTokens(nft);
            });
          }
          if (contractType === "ERC-721") {
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
                    this.updateTokens(nft);
                  });
                }
              );
            });
          }
        });
      });

      return null;
    },
    async getEditionContractsForWallet(wallet) {
      try {
        const numberOfContractsForCreator = parseInt(
          await getNumberOfEditionContractsForCreator(this.wallet)
        );
        this.totalNumberOfContracts += numberOfContractsForCreator;

        if (numberOfContractsForCreator === 0) {
          this.isNotEditionContractOwner = true;
        } else {
          for (let i = 0; i < numberOfContractsForCreator; i++) {
            getEditionCreatorContractAtIndex(wallet, i).then((res) => {
              const contractAddress = res;
              getEditionContractNameAndSymbol(contractAddress).then((res) => {
                const { name, symbol } = res;
                this.updateContracts({
                  contractAddress,
                  name,
                  symbol,
                  label: "ERC-721-EDITION",
                });
              });
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
      return null;
    },
    async getStandardContractsForWallet(wallet) {
      try {
        const numberOfContractsForCreator = parseInt(
          await getNumberOfStandardContractsForCreator(this.wallet)
        );
        this.totalNumberOfContracts += numberOfContractsForCreator;

        if (numberOfContractsForCreator === 0) {
          this.isNotEditionContractOwner = true;
        } else {
          for (let i = 0; i < numberOfContractsForCreator; i++) {
            getStandardCreatorContractAtIndex(wallet, i).then((res) => {
              const contractAddress = res;
              getStandardContractNameAndSymbol(contractAddress).then((res) => {
                const { name, symbol } = res;
                this.updateContracts({
                  contractAddress,
                  name,
                  symbol,
                  label: "ERC-721",
                });
              });
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
      return null;
    },
    updateClaimPages(claimPage) {
      const isNewClaimPage = !this.claimPages.some(
        (element) => element.url === claimPage.url
      );

      if (isNewClaimPage) {
        console.log({ claimPage });
        this.claimPages.push(claimPage);

        console.log(this.claimPages);
        localStorage.setItem(
          "claimPagesInventory",
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
          "contractInventory",
          JSON.stringify(this.contracts)
        );
      }

      if (contract.label === "ERC-721-EDITION") {
        console.log({ contract });
        this.getClaimPagesForContract(contract.contractAddress);
      }

      if (this.numberOfContracts === this.totalNumberOfContracts) {
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

        localStorage.setItem("tokenInventory", JSON.stringify(this.tokens));
      }
    },
  },
};
</script>
