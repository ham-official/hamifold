<template>
  <main class="container mx-auto pb-16 px-2 lg:px-0">
    <Stepper title="1 of 1" description="Mint your own ERC 721 token" icon="grid-02" :steps="steps" :currentStep="0"
      class="my-6 mx-auto" />
    <section class="pb-8 mx-auto container">

    </section>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import navbarRoutes from "@/data/navbar.json";

import steps from "@/data/stepper.json"
definePageMeta({
  middleware: ["auth"],
});
export default {
  data() {
    return {
    };
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
    steps() {
      return steps['erc-721']
    }
  },
  mounted() {

  },
  methods: {

  },
};
</script>
