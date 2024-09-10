<template>
  <main class="container mx-auto py-6">
    <section
      class="flex flex-col w-full bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6"
      :class="{
        'gap-4': numberOfContracts > 0,
        'gap-2': numberOfContracts === 0,
      }">
      <h2 class="font-display text-display-sm uppercase font-semibold" :class="{
        'text-center': numberOfContracts === 0,
        'mb-4': numberOfContracts > 0,
      }">
        contracts
      </h2>
      <ul v-if="contracts" class="flex flex-wrap items-center gap-3">
        <li v-for="(item, index) in contracts" :key="index"
          class="border-2 border-gray-900 rounded-xl bg-white p-4 gap-4 min-w-[288px] max-w-[288px] ham-shadow" :class="{
            'mr-auto': index === numberOfContracts - 1,
          }">
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
    </section>
    <section v-if="creations">
      <CardsList :cards="creations.map((t) => t.metadata)" title="creations" @click="handleClick($event)" />
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import navbarRoutes from "@/data/navbar.json";
import {
  hamERC721ListOfContracts,
  hamERC721EditionListOfContracts,
  listERC721ByOwner,
  getContractType
} from "@/utils/contractListingUtilities.js";
import { metadataNormalizer } from "@/utils/normalizers/metadataNormalizer";
import { truncateAddress } from "@/utils/truncateAddress";

definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      contracts: null,
      isFetching: false,
      newTokens: [],
      newContracts: null,
      selectedContract: null,
      creations: null,
    };
  },
  computed: {
    ...mapGetters(["isConnected", "wallet"]),
    navbarRoutes() {
      return navbarRoutes.routes;
    },
    numberOfContracts() {
      return (this.contracts && this.contracts.length) ?? 0;
    },
  },
  async mounted() {
    // 1. First, fetch contracts
    const localStorageContracts = JSON.parse(
      localStorage.getItem("contractInventory")
    );
    this.newContracts = [];
    this.contracts = localStorageContracts ? localStorageContracts : [];

    hamERC721ListOfContracts(this.wallet).then((res) => {
      res.forEach((c) => this.newContracts.push({ ...c, label: "ERC-721" }));
      localStorage.setItem(
        "contractInventory",
        JSON.stringify(this.newContracts)
      );
      if (this.newContracts.length >= this.contracts.length) {
        this.contracts = this.newContracts;
      }
    });
    hamERC721EditionListOfContracts(this.wallet).then((res) => {
      res.forEach((c) => this.newContracts.push({ ...c, label: "ERC-721-EDITION" }));
      localStorage.setItem(
        "contractInventory",
        JSON.stringify(this.newContracts)
      );
      if (this.newContracts.length >= this.contracts.length) {
        this.contracts = this.newContracts;
      }
    });

    this.numberOfContracts = this.contracts.length;
    // 2. Second, fetch tokens and Claim pages
    const tokenInventory = JSON.parse(localStorage.getItem("tokenInventory"));
    if (tokenInventory && tokenInventory.length) {
      // If there are tokens in local storage, load them
      const claimPagesInventory = JSON.parse(localStorage.getItem("claimPagesInventory"));
      if (claimPagesInventory) {
        this.creations = [...tokenInventory, ...claimPagesInventory]
      } else {
        this.creations = tokenInventory;
      }
    } else {
      this.creations = []
    }
    // 3. Renew Tokens and ClaimPages in background
    this.getNfts()
      .then(async () => {
        const claimPages = await this.getERC721ClaimPages()
        claimPages.forEach(page => {
          if (this.creations.filter(c => c.url === page.url).length === 0) {
            this.creations.push(page)
          }
        })
        localStorage.setItem(
          "claimPagesInventory",
          JSON.stringify(claimPages)
        );
      })
      .catch(err => console.error(err))

  },
  methods: {
    ...mapActions(['setModalData', 'setShowGeneralModal']),
    truncate(address) {
      return truncateAddress(address);
    },
    async getERC721ClaimPages() {
      const pages = await getClaimPages(this.wallet);
      return pages.map(p => { p.metadata.type = p.type; p.metadata.badgeColor = 'primary-invert'; return { ...p } })
    },
    async getNfts() {
      try {
        const BLOCK_EXPLORER_URL = import.meta.env.VITE_BLOCK_EXPLORER_URL;
        const getNftsUrl = `${BLOCK_EXPLORER_URL}/api/v2/addresses/${this.wallet}/nft?type=ERC-721%2CERC-404%2CERC-1155`;

        const request = await fetch(getNftsUrl);
        const jsonPromise = await request.json();
        const creations = jsonPromise.items;
        const contracts = new Map();
        const tokenInventory = [];
        for (let i = 0; i < creations.length; i++) {
          const token = creations[i];
          const tokenAddress = token.token.address
          if (!contracts.has(tokenAddress)) {
            const contractType = await getContractType(tokenAddress);
            if (contractType === "ERC-721") {
              contracts.set(tokenAddress, contractType);
              const nfts = await listERC721ByOwner(
                this.wallet,
                tokenAddress
              );
              nfts.forEach((nft) => {
                fetch(nft.uri).then((res) => {
                  res.json().then((metadata) => {
                    this.newTokens.push({
                      ...creations[i],
                      contract: tokenAddress,
                      metadata: metadataNormalizer(metadata),
                    });
                    localStorage.setItem(
                      "tokenInventory",
                      JSON.stringify(this.newTokens)
                    );
                    if (tokenInventory.length >= this.creations.length) {
                      this.creations = this.newTokens;
                    }
                  });
                });
              });
            }
            if (contractType === "ERC-721-EDITION") {
              const nft = {
                tokenId: token.id,
                typeId: token.attributes
                  ? token.attributes[0].value
                  : token.metadata.attributes[0].value,
                metadata: {
                  description: token.metadata.description,
                  name: token.metadata.name,
                  type: "ERC-721-EDITION",
                  image: token.metadata.image,
                  imageUrl: token.metadata.image,
                },
                type: "ERC-721-EDITION",
                contract: {
                  contractAddress: tokenAddress,
                  name: token.token.name,
                  symbol: token.token.symbol,
                },
              };
              this.newTokens.push(nft);
              localStorage.setItem(
                "tokenInventory",
                JSON.stringify(this.newTokens)
              );
              if (tokenInventory.length >= this.creations.length) {
                this.creations = this.newTokens;
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async handleClick(data) {
      const index = data.index
      if (index !== undefined) {
        const creation = this.creations[index]
        const pageUrl = creation.url
        if (pageUrl) {
          this.$router.push(`/c/${pageUrl}`)
        } else {
          const data = creation.metadata
          this.setModalData({
            title: 'token',
            components: ["Token"],
            data: { ...data, tokenId: creation.tokenId ? creation.tokenId : creation.id }
          });
          this.setShowGeneralModal(true);
        }
      }
    }
  },
};
</script>
