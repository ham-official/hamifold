<template>
  <main class="container mx-auto pb-16">
    <Stepper title="1 of 1" description="Create a contract to mint your own tokens" icon="grid-02" icon-color="success"
      :steps="steps" :currentStep="2" class="my-6 mx-auto" />
    <div
      class="mx-auto border border-gray-900 rounded-xl p-6 bg-white ham-shadow--active relative overflow-hidden flex flex-col gap-3">
      <div v-if="isMinting"
        class="absolute top-0 left-0 right-0 bottom-0 z-20 w-full flex flex-col gap-2 items-center justify-center text-black bg-slate-300 bg-opacity-75">
        <span>Waiting for Wallet</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
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
            <Badge class="px-3 py-2 ml-auto" color="success" size="xl" label="ERC 721" />
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
import steps from "@/data/stepper.json"
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
    },
    steps() {
      return steps['erc-721']
    }
  },
  methods: {
    async handleMint() {
      console.log({ uri: this.uri, contract: this.contractAddress })
      try {
        this.isMinting = true;
        const nft = await safeMint(this.uri, this.contractAddress);
        confirm("Congrats!! You have successfully minted your NFT");
        this.isMinting = false;
        this.$router.push(`/contract/${this.contractAddress.replaceAll('"', '')}`)
      } catch (error) {
        confirm(error)
        this.isMinting = false;
        console.log(error);
      }
    },
  },
};
</script>
