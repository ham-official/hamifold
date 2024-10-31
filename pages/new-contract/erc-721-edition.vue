<template>
  <main class="container mx-auto py-8 px-2 lg:px-0">
    <div
      class="mx-auto lg:max-w-200 border border-gray-900 rounded-xl p-6 bg-white ham-shadow--active relative overflow-hidden">
      <div v-if="isSubmitting"
        class="absolute top-0 left-0 right-0 bottom-0 z-20 w-full h-full flex flex-col gap-2 items-center justify-center text-black bg-slate-300 bg-opacity-75">
        <span>Waiting for Wallet</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </div>
      <h1 class="text-gray-900 text-lg font-display flex items-center gap-2">
        <span class="font-bold">ERC-721</span>
        <Badge label="edition" size="md" color="secondary" />
      </h1>
      <h2 class="text-gray-600 font-display font-semibold mt-4">
        Create an ERC-721 edition contract to mint your tokens on your own claim page.<br /> You can use the same
        contract for
        multiple claim pages.
      </h2>
      <form @submit.prevent="handleSubmit" class="my-4 text-gray-700 flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="contract-name" class="">Contract Name</label>
          <input id="contract-name" type="text" v-model="contractName" placeholder="e.g. Hamazing Edition Contract"
            class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="contract-symbol" class="">Symbol</label>
          <input id="contract-symbol" type="text" v-model="symbol" placeholder="e.g. HAMEDITCON"
            class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl" />
        </div>
        <CTA :disabled="!formIsValid" color="primary" cta-type="submit" class="mt-6">Create</CTA>
      </form>
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import navbarRoutes from "@/data/navbar.json";
import { hamERC721EditionContractDeployer } from "@/utils/contractDeployer.js";
import {
  hamERC721EditionListOfContracts
} from '@/utils/contractListingUtilities.js'
import { patterns, testRegex } from "@/utils/regex.js";

definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      contractName: null,
      symbol: null,
      // asciiMark: null,
      deployInProgress: false,
      deployTransaction: null,
      isContractDeployed: false,
      inventory: null,
      isSubmitting: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    const origin = from.path
    next(vm => {
      const query = { from: origin }
      vm.$router.replace({
        query: { ...query }
      });
    })
  },
  mounted() {
    const deployTx = JSON.parse(localStorage.getItem("deployTx"));

    this.deployTx = deployTx ? deployTx : null;

    const inventory = JSON.parse(localStorage.getItem("inventory"));
    this.inventory = inventory ? inventory : null;

  },
  computed: {
    ...mapGetters(["isConnected", "wallet"]),
    navbarRoutes() {
      return navbarRoutes.routes;
    },
    formIsValid() {
      return (
        this.contractName &&
        this.symbol &&
        // this.asciiMark &&
        testRegex(patterns.notEmptyString, this.contractName) &&
        testRegex(patterns.notEmptyString, this.symbol)
        // testRegex(patterns.notEmptyString, this.asciiMark)
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
        const deployTx = await hamERC721EditionContractDeployer(
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
        .then(async (res) => {
          const contracts = await hamERC721EditionListOfContracts(this.wallet)
          const contractAddress = res.logs[0].address
          inventory.push({
            contractAddress: contractAddress,
            contractName: deployTx.contractName,
            symbol: deployTx.symbol,
            // asciiMark: deployTx.asciiMark,
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
          const to = this.$route.query.from
          if (to) {
            this.$router.push(to);
          } else {
            this.$router.push('/home')
          }
        })
        .catch((err) => {
          localStorage.removeItem("deployTx");
          console.log(err);
        });
    },
  },
};
</script>
