<template>
  <main class="container mx-auto">
    <ol class="flex items-center gap-6 justify-center my-6">
      <li class="font-bold">

        <NuxtLink>1. Select contract</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/claim-page/erc-721/set-up-media">
          2. Set up Media
        </NuxtLink>
      </li>
      <li>3. Set up Mint Page</li>
      <li>4. Set mint rules</li>
      <li>5. Set Audience</li>
    </ol>

    <Stepper v-if="contracts" :steps="stepper.steps" :currentStep="0" class="mb-6" />
    <section class="flex flex-col gap-6">
      <div v-if="!contracts || contracts.length === 0" class="mx-auto container">
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
    <section v-if="contracts && contracts.length" class="mx-auto container py-16">
      <div class="ham-shadow--active bg-white border border-gray-900 rounded-3xl flex flex-col gap-10 p-5">
        <div class="flex justify-between">
          <div class="flex flex-col">
            <h2 class="text-display-sm uppercase font-display font-semibold">Select a contract or create one</h2>
            <p class="text-md text-gray-500">Choose which contract you’d like your media to be a part of</p>
          </div>
          <NuxtLink to="/new-contract/erc-721-edition" class="ml-auto" :disabled="selectedContractIndex !== -1">
            <CTA size="lg" color="primary" iconLeft="plus" :disabled="selectedContractIndex !== -1">Create a contract
            </CTA>
          </NuxtLink>
        </div>
        <section class="flex flex-col gap-4 relative">
          <ul v-if="contracts" class="flex flex-wrap items-center justify-between gap-3">
            <li v-for="(item, index) in contracts" :key="index" @click="handleSelectContract(index)"
              class="border-2 border-gray-900 rounded-xl bg-white p-4 gap-4 min-w-[288px] max-w-[288px] cursor-pointer"
              :class="{
                'ham-shadow--active bg-green-100': selectedContractIndex === index,
                'ham-shadow': selectedContractIndex !== index,
                'mr-auto': index === numberOfContracts - 1
              }">
              <p class="text-gray-900 font-semibold">{{ truncate(item.contractAddress) }}</p>
              <p class="text-gray-500 mb-3">{{ item.name }}</p>
              <div class="flex justify-between items-center">
                <Badge color="primary" size="sm" label="ERC-721 Edition" />
                <p class="text-sm">{{ item.symbol }}</p>
              </div>
            </li>
          </ul>
          <CTA @click="handleSave" size="lg" color="primary" cta-type="submit" :disabled="selectedContractIndex === -1"
            class="absolute right-4 bottom-4">Save & Next</CTA>
        </section>
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
    if (contractFromLocalStorage) {
      const contract = JSON.parse(contractFromLocalStorage)
      this.contracts = [contract]
      this.handleSelectContract(0)
    } else {
      const contracts = await hamERC721EditionListOfContracts(this.wallet);
      this.contracts = contracts;
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