<template>
  <main class="container mx-auto pb-16 px-2 lg:px-0">
    <div
      class="mx-auto border border-gray-900 rounded-xl p-6 bg-white ham-shadow--active relative overflow-hidden my-8">
      <div v-if="isSubmitting"
        class="absolute top-0 left-0 right-0 bottom-0 z-20 w-full h-full flex flex-col gap-2 items-center justify-center text-black bg-slate-300 bg-opacity-75">
        <span>Waiting for Wallet</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </div>
      <h1 class="text-gray-900 text-lg font-display flex items-center gap-2">
        <span class="font-bold mr-1">1 of 1</span>
        <Badge color="success" size="sm" label="erc 721" />
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
import steps from "@/data/stepper.json"
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
  computed: {
    ...mapGetters(['isConnected', 'wallet']),
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
    steps() {
      return steps['erc-721']
    }
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

    const inventory = JSON.parse(localStorage.getItem(`contractsInventory-${this.wallet}`));
    this.inventory = inventory ? inventory : null;

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
            name: deployTx.contractName,
            symbol: deployTx.symbol,
            label: 'ERC 721'
          });

          localStorage.setItem(`contractsInventory-${this.wallet}`, JSON.stringify(inventory))
          localStorage.setItem(
            "contractAddress",
            contractAddress
          );
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
