<template>
  <main class="container mx-auto pb-16">
    <section class="max-w-100 mx-auto my-6">
      <ul class="flex items-center gap-2 justify-between text-gray-600">
        <li>1. Create contract</li>
        <li>2. Set up media</li>
        <li class="text-gray-950 font-bold">3. Mint</li>
      </ul>
    </section>
    <div
      class="mx-auto border border-gray-900 rounded-xl p-6 bg-white ham-shadow--active relative overflow-hidden flex flex-col gap-3">
      <div v-if="isMinting"
        class="absolute top-0 left-0 right-0 bottom-0 z-20 w-full flex flex-col gap-2 items-center justify-center text-black bg-slate-300 bg-opacity-75">
        <span>Waiting for Wallet</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </div>
      <div class="flex justify-between items-center">
        <h1 class="text-gray-900 text-lg font-display flex items-center gap-2">
          <Icon icon="layer-single" :no-size="true"
            class="rounded-full border border-gray-900 h-[40px] w-[40px] p-2 flex items-center justify-center" />
          <div class="">
            <p class="font-bold mr-1">1 of 1</p>
            <p>ERC-721</p>
          </div>
        </h1>
        <h2 class="text-gray-600 mb-4 font-display text-display-sm">Let's mint your new Token!!!</h2>
      </div>
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          class="h-auto w-full aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center relative">
          <p v-if="!imageIsLoaded"
            class="absolute top-0 left-0 right-0 bottom-0 z-20 flex justify-center items-center gap-2">
            <span>Loading your NFT media</span>
            <Icon icon="refresh-cw-03" class=" animate-spin" />
          </p>
          <IMG v-if="imgUrl" :image="imgUrl" class="w-full h-full object-cover" @load="imageIsLoaded = true" />
        </div>
        <div class="flex flex-col gap-2">
          <template v-if="nftData">
            <p class="font-display text-display-sm">{{ nftData.title }}</p>
            <p class="text-gray-600">{{ nftData.description }}</p>
            <p class="mt-2">Created by<span class="ml-2 font-semibold">{{ nftData.created_by }}</span></p>
          </template>
          <p class="border border-black rounded-lg p-4 mt-auto mb-4 flex items-center">
            <span>{{ contractName ? contractName : contractAddress && contractAddress.replaceAll('"', '') }}</span>
            <Badge class="ml-auto" color="success" label="ERC 721" />
          </p>
          <CTA class="w-full" @click="handleMint"
            :disabled="!imageIsLoaded || !imgUrl || !contractAddress || !uri || isMinting" color="primary" size="lg">
            Mint
            Now (free)
          </CTA>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import navbarRoutes from "@/data/navbar.json";
import { safeMint } from "@/utils/erc721Utils.js";

definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      contract: null,
      contractAddress: null,
      imageIsLoaded: false,
      imgUrl: null,
      isMinting: false,
      nftData: null,
      uri: null,
    };
  },
  mounted() {
    const uri = localStorage.getItem("uri");
    this.uri = uri ? uri : null;
    const imgUrl = localStorage.getItem("imgUrl");
    this.imgUrl = imgUrl ? imgUrl : null;
    fetch(uri).then(async (res) => {
      this.nftData = await res.json()
    })
    const contractAddress = localStorage.getItem("contractAddress");
    const contract = localStorage.getItem(contractAddress)
    console.log({ contract })
    this.contractAddress = contractAddress ? contractAddress : null;
  },
  computed: {
    ...mapGetters(["isConnected"]),
    navbarRoutes() {
      return navbarRoutes.routes;
    },
    contractName() {
      return this.contract && this.contract.name
    }
  },
  methods: {
    async handleMint() {
      try {
        this.isMinting = true;
        const nft = await safeMint(this.uri, this.contractAddress);
        confirm("Congrats!! You have successfully minted your NFT");
        this.isMinting = false;
        this.$router.push('/inventory')
      } catch (error) {
        confirm(error)
        this.isMinting = false;
        console.log(error);
      }
    },
  },
};
</script>
