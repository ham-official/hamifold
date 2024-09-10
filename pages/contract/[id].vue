<template>
  <main class="container mx-auto pb-8">
    <section v-if="contract"
      class="bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6">
      <h1 class="font-display font-semibold text-display-sm uppercase mb-4">Contract</h1>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p><span class="font-semibold mr-2">Contract Address</span><span class="text-gray-500">{{
            contract.contractAddress
              }}</span></p>
          <p><span class="font-semibold mr-2">Name</span><span class="text-gray-500">{{ contract.name }}</span></p>
        </div>
        <div>
          <p><span class="font-semibold mr-2">Symbol</span><span class="text-gray-500">{{ contract.symbol
              }}</span></p>
          <p><span class="font-semibold mr-2">Type</span><span class="text-gray-500">{{ contract.label }}</span></p>
        </div>
      </div>
    </section>
    <section v-if="tokenInventory"
      class="bg-white border-2 border-gray-900 ham-shadow--active p-6 rounded-3xl text-gray-900 mt-6">
      <h2 class="font-display font-semibold text-display-sm uppercase mb-4">Tokens</h2>
      <ul class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <li v-for="(card, index) in tokenInventory" :key="`token-card-${index}`" @click="handleClick(index)">
          <Card class="ham-shadow cursor-pointer" v-bind="card.metadata" />
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      contract: null,
      tokenInventory: null
    }
  },
  computed: {
    ...mapGetters(["wallet"]),
    contractAddress() {
      return this.$route && this.$route.params.id
    }
  },
  async mounted() {
    const tokenInventory = localStorage.getItem('tokenInventory');
    if (tokenInventory) {
      const tokens = JSON.parse(tokenInventory)
      const contractInventory = localStorage.getItem('contractInventory')
      const contracts = JSON.parse(contractInventory)
      this.contract = contracts.filter(c => c.contractAddress === this.contractAddress)[0]
      this.tokenInventory = tokens.filter(t => t.contract === this.contractAddress || t.contract.contractAddress === this.contractAddress)
    } else {
      const BLOCK_EXPLORER_URL = import.meta.env.VITE_BLOCK_EXPLORER_URL;
      const getContractsAndNFTsURL = `${BLOCK_EXPLORER_URL}/api/v2/addresses/${this.wallet}/nft/collections?type=ERC-721%2CERC-404%2CERC-1155`;
      const request = await fetch(getContractsAndNFTsURL);
      const jsonPromise = await request.json();
      const contracts = jsonPromise.items;
      const contract = contracts.filter(c => c.token.address === this.contractAddress)[0]
      this.contract = { ...contract }
      const tokens = contract.token_instances
      if (tokens && tokens.length) {
        const firstToken = tokens[0]
        console.log(firstToken.metadata)
        if (firstToken.metadata) {
          this.tokenInventory = tokens.map(t => {
            t.metadata.type = 'ERC-721-EDITION'
            return { ...t }
          })
          this.contract.label = 'ERC-721-EDITION'
        } else {
          this.tokenInventory = tokens.map(t => { t.metadata = { ...t, type: t.token_type }; return { ...t } })
          this.contract.label = 'ERC-721'
        }
      }
    }
  },
  methods: {
    ...mapActions(['setModalData', 'setShowGeneralModal']),
    async handleClick(index) {
      const creation = this.tokenInventory[index]
      const data = creation.metadata
      this.setModalData({
        title: 'token',
        components: ["Token"],
        data: { ...data, tokenId: creation.tokenId ? creation.tokenId : creation.id }
      });
      this.setShowGeneralModal(true);
    }
  },
}
</script>
