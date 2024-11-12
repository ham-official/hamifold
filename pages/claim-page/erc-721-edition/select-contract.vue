<template>
  <main class="container mx-auto px-2 lg:px-0">
    <Stepper v-if="contracts" :steps="stepper.steps" :currentStep="0" :description="stepper.steps[0].description"
      :icon="stepper.steps[0].icon" icon-color="warning" class=" my-6" />
    <section v-if="!contracts || contracts.length === 0" class="flex flex-col gap-6 my-8">
      <div class="mx-auto container">
        <div
          class="ham-shadow--active bg-white border border-gray-900 rounded-3xl flex flex-col justify-center items-center gap-8 p-5">
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-display-sm uppercase font-display font-semibold">Contracts</h2>
            <p class="text-md text-gray-500">Claim pages need an ERC721-Edition contract and you didn’t create one yet
            </p>
          </div>
          <NuxtLink to="/new-contract/erc-721-edition" class="">
            <CTA size="xl" color="white" iconLeft="plus">Create a contract</CTA>
          </NuxtLink>
        </div>
      </div>
    </section>
    <section v-if="contracts && contracts.length" class="pb-8 mx-auto container">
      <div
        class="relative ham-shadow--active bg-white border border-gray-900 rounded-2xl flex flex-col gap-3 lg:gap-10 p-5 lg:pb-32">
        <div class="flex flex-wrap lg:justify-between gap-3">
          <div class="flex flex-col gap-3">
            <h2 class="flex items-center gap-2 text-display-sm uppercase font-display font-semibold text-gray-900">
              Select a contract or create one
            </h2>
            <p class="text-md text-gray-500">Choose which contract you’d like your media to be a part of:</p>
          </div>
          <div class="flex-1 lg:flex-none lg:ml-auto">
            <NuxtLink class="w-full" to="/new-contract/erc-721-edition" :disabled="selectedContractIndex !== -1">
              <CTA class="w-full lg:w-auto lg:ml-auto" size="lg" color="primary" iconLeft="plus"
                :disabled="selectedContractIndex !== -1">Create a contract
              </CTA>
            </NuxtLink>
          </div>
        </div>
        <div class="flex flex-col gap-4 relative overflow-x-auto">
          <ul v-if="contracts" class="flex lg:flex-wrap items-center gap-3 py-2">
            <li v-for="(item, index) in contracts" :key="index" @click="handleSelectContract(index)"
              class="cursor-pointer">
              <CardSmall :address="truncate(item.contractAddress)" :name="item.name" :symbol="item.symbol" :badge="{
                color: 'indigo',
                size: 'xs',
                label: 'ERC 721 EDITION'
              }" :isLast="index === numberOfContracts - 1" :selected="selectedContractIndex === index" />
            </li>
          </ul>
        </div>
        <CTA @click="handleSave" size="lg" color="primary" cta-type="submit" :disabled="selectedContractIndex === -1"
          class="flex-1 lg:flex-auto lg:absolute lg:right-8 lg:bottom-8">Save & Next</CTA>
      </div>
    </section>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import navbarRoutes from "@/data/navbar.json";
import { patterns, testRegex } from "@/utils/regex.js";
import {
  hamERC721EditionListOfContracts,
} from "@/utils/contractListingUtilities.js";
import { truncateAddress } from "@/utils/truncateAddress";
import steps from "@/data/stepper.json"
import CardSmall from "../../../components/CardSmall/CardSmall.vue";
definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
      contractName: null,
      symbol: null,
      type: null,
      asciiMark: null,
      deployInProgress: false,
      deployTransaction: null,
      isContractDeployed: false,
      inventory: null,
      isSubmitting: false,
      contracts: null,
      tokens: null,
      selectedContractIndex: -1
    };
  },
  async mounted() {
    const contractFromLocalStorage = localStorage.getItem('claimPageContract')
    const contractsFromLocalStorage = localStorage.getItem('contractsInventory')
    let contracts
    if (contractsFromLocalStorage) {
      contracts = JSON.parse(contractsFromLocalStorage)
    } else {
      contracts = await hamERC721EditionListOfContracts(this.wallet);
    }
    this.contracts = contracts
    if (contractFromLocalStorage) {
      const contract = JSON.parse(contractFromLocalStorage)
      const contractIndex = contracts.findIndex(c => c.contractAddress === contract.contractAddress)
      this.handleSelectContract(contractIndex)
    }
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
        this.type &&
        this.asciiMark &&
        testRegex(patterns.notEmptyString, this.contractName) &&
        testRegex(patterns.notEmptyString, this.symbol) &&
        testRegex(patterns.notEmptyString, this.type) &&
        testRegex(patterns.notEmptyString, this.asciiMark)
      );
    },
    stepper() {
      return steps
    },
    numberOfContracts() {
      return (this.contracts && this.contracts.length) ?? 0
    }
  },
  methods: {
    truncate(address) {
      return truncateAddress(address)
    },
    handleSelectContract(index) {
      if (this.selectedContractIndex === index) {
        this.selectedContractIndex = -1;
      } else {
        this.selectedContractIndex = index
      }
    },
    handleSave() {
      const claimPageContract = this.contracts[this.selectedContractIndex]
      localStorage.setItem('claimPageContract', JSON.stringify(claimPageContract))
      this.$router.push(this.stepper.steps[1].link)
    },
  },
};
</script>