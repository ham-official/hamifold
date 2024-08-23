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
      class="mx-auto border border-gray-900 rounded-xl p-6 bg-white ham-shadow--active relative overflow-hidden gap-3">
      <div v-if="isMinting"
        class="absolute top-0 left-0 right-0 bottom-0 z-20 w-full flex flex-col gap-2 items-center justify-center text-black bg-slate-300 bg-opacity-75">
        <span>Waiting for Wallet</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </div>
      <h1 class="text-gray-900 text-lg font-display">
        <span class="font-bold mr-1">1 of 1</span><span>ERC-721</span>
      </h1>
      <h2 class="text-gray-600 mb-4">Let's mint your new Token!!!</h2>
      <section class="w-full flex justify-center items-center">
        <div class="w-3/4 h-auto rounded-lg overflow-hidden">
          <IMG v-if="imgUrl" :image="imgUrl" class="w-full h-full object-cover" @load="imageIsLoaded = true" />
        </div>
      </section>
      <CTA class="my-6 ml-auto min-w-40" @click="handleMint"
        :disabled="!imageIsLoaded || !imgUrl || !contractAddress || !uri || isMinting" color="primary" size="lg">Mint
        Now (free)
      </CTA>
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
      uri: null,
      contractAddress: null,
      imgUrl: null,
      isMinting: false,
      imageIsLoaded: false
    };
  },
  mounted() {
    const uri = localStorage.getItem("uri");
    this.uri = uri ? uri : null;
    const imgUrl = localStorage.getItem("imgUrl");
    this.imgUrl = imgUrl ? imgUrl : null;
    const contractAddress = localStorage.getItem("contractAddress");
    this.contractAddress = contractAddress ? contractAddress : null;
  },
  computed: {
    ...mapGetters(["isConnected"]),
    navbarRoutes() {
      return navbarRoutes.routes;
    },
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
        this.isMinting = false;
        console.log(error);
      }
    },
  },
};
</script>
