<template>
  <main class="container mx-auto pb-16">
    <section class="max-w-100 mx-auto my-6">
      <ul class="flex items-center gap-2 justify-between text-gray-600">
        <li class="text-gray-950 font-bold">1. Create contract</li>
        <li>2. Set up media</li>
        <li>3. Mint</li>
      </ul>
    </section>
    <div class="mx-auto border border-gray-900 rounded-xl p-6 bg-white ham-shadow--active relative overflow-hidden">
      <div v-if="isSubmitting"
        class="absolute top-0 left-0 right-0 bottom-0 z-20 w-full h-full flex flex-col gap-2 items-center justify-center text-black bg-slate-300 bg-opacity-75">
        <span>Waiting for Wallet</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </div>
      <h1 class="text-gray-900 text-lg font-display">
        <span class="font-bold mr-1">1 of 1</span><span>ERC-721</span>
      </h1>
      <h2 class="text-gray-600 font-display font-semibold">
        Mint a single piece to hold, transfer or sell on any platform
      </h2>
      <form @submit.prevent="handleSubmit" class="my-4 text-gray-700 flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="contract-name" class="">Contract Name</label>
          <input id="contract-name" type="text" v-model="contractName" placeholder="e.g. Hamazing Contract"
            class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="contract-symbol" class="">Symbol</label>
          <input id="contract-symbol" type="text" v-model="symbol" placeholder="e.g. HAMCON"
            class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl" />
        </div>
        <!-- <div class="flex flex-col gap-2">
          <label for="ascii-mark" class="">ASCII Mark</label>
          <input id="ascii-mark" type="text" v-model="asciiMark" placeholder="e.g. Bad Ass Contract"
            class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl" />
        </div> -->
        <CTA :disabled="!formIsValid" color="primary" cta-type="submit">Create</CTA>
      </form>
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import navbarRoutes from "@/data/navbar.json";
import { hamERC721ContractDeployer } from "@/utils/contractDeployer.js";
import { patterns, testRegex } from "@/utils/regex.js";

definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      contractName: null,
      symbol: null,
      asciiMark: null,
      deployInProgress: false,
      deployTransaction: null,
      isContractDeployed: false,
      inventory: null,
      isSubmitting: false,
    };
  },
  mounted() {
    const deployTx = JSON.parse(localStorage.getItem("deployTx"));

    this.deployTx = deployTx ? deployTx : null;

    const inventory = JSON.parse(localStorage.getItem("inventory"));
    this.inventory = inventory ? inventory : null;

  },
  computed: {
    ...mapGetters(["isConnected"]),
    navbarRoutes() {
      return navbarRoutes.routes;
    },
    formIsValid() {
      return (
        this.contractName &&
        this.symbol &&
        testRegex(patterns.notEmptyString, this.contractName) &&
        testRegex(patterns.notEmptyString, this.symbol)
      );
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.isSubmitting = true;
        const contractData = {
          contractName: this.contractName,
          symbol: this.symbol,
          asciiMark: this.asciiMark,
        };
        const deployTx = await hamERC721ContractDeployer(
          this.contractName,
          this.symbol
        );

        if (deployTx) {
          this.deployTx = deployTx;
          localStorage.setItem(
            "deployTx",
            JSON.stringify({ ...deployTx, ...contractData })
          );
          this.handleDeployTx({ ...deployTx, ...contractData });
        }
      } catch (error) {
        console.log({ error });
        alert(error.message)
        this.isSubmitting = false;
      }
    },
    async handleDeployTx(deployTx) {
      const inventory = this.inventory ? this.inventory : [];
      deployTx
        .wait()
        .then((res) => {
          const contractAddress = res.logs[0].address
          inventory.push({
            contractAddress: contractAddress,
            contractName: deployTx.contractName,
            symbol: deployTx.symbol,
            asciiMark: deployTx.asciiMark,
            gasUsed: res.gasUsed,
            transactionHash: res.transactionHash,
            blockNumber: res.blockNumber,
          });

          this.inventory = inventory;
          localStorage.setItem("inventory", JSON.stringify(inventory));
          localStorage.setItem(
            "contractAddress",
            contractAddress
          );
          localStorage.removeItem("deployTx");
          this.isSubmitting = false;

          this.$router.push(`/new-contract/${contractAddress}`);
        })
        .catch((err) => {
          localStorage.removeItem("deployTx");
          console.log(err);
        });
    },
  },
};
</script>
