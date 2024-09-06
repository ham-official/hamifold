<template>
  <main class="container mx-auto pb-6">
    <section
      class="flex flex-col w-full gap-4 bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6">
      <template v-if="isFetching">
        <div class="h-96 flex flex-col items-center justify-center">
          <p class="font-display text-display-sm uppercase font-semibold">
            Finding your creations...
          </p>
        </div>
      </template>
      <template v-else>
        <h2 class="font-display text-display-sm uppercase font-semibold mb-4"
          :class="{ 'text-center': !(creations && creations.length) }">
          creations
        </h2>
        <ul v-if="creations && creations.length" class="grid grid-cols-4 gap-4">
          <li v-for="(item, index) in creations" :key="`creation-${index}`">
            <template v-if="item.url">
              <NuxtLink :to="`/c/${item.url}`">
                <Card v-bind="item" class="ham-shadow" />
              </NuxtLink>
            </template>
            <Card v-else v-bind="item" />
          </li>
        </ul>
        <div v-else class="text-center">
          <p class="font-semibold">Nothing added yet</p>
          <p class="text-gray-400 mt-3 mb-4">
            Your published items will show up here
          </p>
          <CTA class="mx-auto mt-4" size="lg" color="primary" iconLeft="plus" @click="handleShowCreateModal">Create
          </CTA>
        </div>
      </template>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  hamERC721ListOfContracts,
  getClaimPages,
  listERC721ByOwner,
} from "@/utils/contractListingUtilities.js";
import { metadataNormalizer } from "@/utils/normalizers/metadataNormalizer";
definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      creations: null,
      isFetching: false,
    };
  },
  computed: {
    ...mapGetters(["wallet"]),
  },
  async mounted() {
    try {
      const storageCreations = JSON.parse(localStorage.getItem("creations"));
      const hasLocalStorageCreations =
        storageCreations && storageCreations.length > 0;
      this.creations = hasLocalStorageCreations ? storageCreations : [];

      this.isFetching = !hasLocalStorageCreations;

      const erc721Creations = await this.getERC721Tokens();
      const claimPageCreations = await this.getERC721ClaimPages();

      this.creations = [...erc721Creations, ...claimPageCreations];
      localStorage.setItem("creations", JSON.stringify(this.creations));
      this.isFetching = false;
    } catch (error) {
      this.isFetching = false;
      console.error(error);
    }
  },
  methods: {
    ...mapActions(["setShowGeneralModal", "setModalData"]),
    handleShowCreateModal() {
      this.setModalData({
        title: "create something new",
        components: ["CreateList", "MintList"],
      });
      this.setShowGeneralModal(true);
    },
    async getERC721Tokens() {
      const contracts = await hamERC721ListOfContracts(this.wallet);
      const numberOfContracts = contracts.length;

      const tokens = [];
      const creations = []
      for (let i = 0; i < numberOfContracts; i++) {
        const contractTokens = await listERC721ByOwner(
          this.wallet,
          contracts[i].contractAddress
        );
        const numberOfTokens = contractTokens.length;
        for (let j = 0; j < numberOfTokens; j++) {
          const request = await fetch(contractTokens[j].uri);
          const metadata = await request.json();
          contractTokens[j] = {
            ...contractTokens[j],
            contract: contracts[i],
            metadata: metadataNormalizer(metadata),
          };
        }

        tokens.push(...contractTokens);
        const contractCreations = tokens.map((t) => {
          return {
            contractAddress: t.contract.contractAddress,
            type: `1 of 1 - ${t.type}`,
            name: t.metadata.name,
            description: t.metadata.description,
            image: t.metadata.imageUrl,
          };
        });
        creations.push(...contractCreations)
      }
      return creations;
    },
    async getERC721ClaimPages() {
      const pages = await getClaimPages(this.wallet);
      const creations = pages.map((p) => {
        return {
          contractAddress: p.contract.contractAddress,
          type: p.type,
          name: p.metadata.name,
          description: p.metadata.description,
          image: p.metadata.imageUrl,
          url: p.url,
        };
      });
      return creations;
    },
  },
};
</script>
