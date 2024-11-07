<template>
  <header class="sticky top-0 z-50 pt-0 lg:pt-6 bg-gray-100/75">
    <div
      class="lg:container mx-auto p-4 text-gray-800 flex justify-between items-center min-h-[77px] max-h-[77px] bg-white rounded-none lg:rounded-full border-b lg:border-2 border-gray-900">
      <nav>
        <NuxtLink v-if="!isConnected" to="/">
          <Icon icon="hamifold-logo" :no-size="true" classes="text-gray-900 w-auto h-12" />
        </NuxtLink>
        <NuxtLink v-else to="/home">
          <Icon icon="hamifold-logo" :no-size="true" classes="text-gray-900 w-auto h-12 lg:ml-4" />
        </NuxtLink>
      </nav>
      <div class="hidden lg:flex gap-2 lg:gap-4">
        <CTA v-if="isConnected" size="lg" color="primary" iconLeft="plus" @click="handleShowCreateModal">Create</CTA>
        <DropdownMenu :closeCTA="{ icon: 'user-03', label: 'Connect wallet', color: 'primary' }"
          :openCTA="{ icon: 'user-03', label: truncate(wallet), color: 'white' }" />
      </div>
      <div @click="handleShowMenu" class="block lg:hidden">
        <Icon :icon="showMenu ? 'x-close' : 'menu-01'" />
      </div>
    </div>
    <nav v-if="showMenu" class="bg-white flex flex-col gap-y-4 p-4 h-screen">
      <p v-if="isConnected" class="uppercase w-full flex gap-1 items-center justify-center">
        <Icon icon="user-03" />{{ truncate(wallet) }}
      </p>
      <CTA v-if="isConnected" size="lg" color="primary" iconLeft="plus" class="w-full"
        @click="handleShowCreateSlideOver">
        Create</CTA>
      <a href="https://ham.fun/bridge" target="_blank">
        <CTA size="lg" color="white" class="w-full" iconLeft="switch-horizontal-01">
          Bridge</CTA>
      </a>
      <CTA v-if="!isConnected" size="lg" color="primary" @click="handleConnect()">Connect walet</CTA>
      <CTA v-if="isConnected" size="lg" color="white" class="uppercase w-full" iconLeft="log-out-01"
        @click="handleDisconnect()">Log out</CTA>

    </nav>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import Ethereum from "@/components/Ethereum.vue";
export default {
  extends: Ethereum,
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    ...mapActions(['setShowGeneralModal', 'setModalData', 'setShowSlideOver', 'setSlideOverData']),
    handleShowCreateModal() {
      this.setModalData({ components: ['CreatePagesList', 'MintList', 'CreateContractsList'] })
      this.setShowGeneralModal(true)
    },
    handleShowCreateSlideOver() {
      this.setSlideOverData({ components: ['CreatePagesList', 'MintList', 'CreateContractsList'] })
      this.setShowSlideOver(true)
      this.showMenu = false
    },
    handleShowMenu() {
      this.showMenu = !this.showMenu
    }
  },
};
</script>
