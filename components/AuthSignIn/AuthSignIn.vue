<template>
  <div
    class="ham-shadow--active bg-white border border-gray-900 rounded-3xl flex flex-col justify-center items-center gap-10 p-16">
    <Icon icon="hamifold-logo" :no-size="true" class="text-gray-900 h-[56px] w-[274px]" />
    <div class="flex flex-col items-center">
      <h2 class="text-display-sm uppercase font-display font-semibold pb-4">Welcome</h2>
      <p class="text-md text-gray-500 text-center">Create your own tokens and pages to claim them!</p>
    </div>
    <CTA size="lg" color="primary" iconLeft="wallet-03" @click="handleConnect()" class="px-6">Connect your wallet
    </CTA>
  </div>
</template>

<script>
import Ethereum from "@/components/Ethereum.vue";

export default {
  extends: Ethereum,
};
</script>