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
      <div class=" hidden lg:flex gap-2 lg:gap-4">
        <CTA v-if="isConnected" size="lg" color="primary" iconLeft="plus" @click="handleShowCreateModal">Create</CTA>
        <DropdownMenu :closeCTA="{ icon: '', label: 'Connect wallet', color: 'primary' }"
          :openCTA="{ icon: 'user-03', label: truncate(wallet), color: 'white' }" />
      </div>
      <div @click="handleShowMenu" class="block lg:hidden">
        <Icon icon="menu-01" />
      </div>
    </div>
    <nav v-if="showMenu" class="bg-white flex flex-col gap-y-4 p-4 h-screen">
      <CTA v-if="isConnected" size="lg" color="white" icon="user03" class="uppercase w-full">{{
        truncate(wallet) }}</CTA>
      <CTA v-if="isConnected" size="lg" color="primary" iconLeft="plus" class="w-full" @click="handleShowCreateModal">
        Create</CTA>
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
    ...mapActions(['setShowGeneralModal', 'setModalData']),
    handleShowCreateModal() {
      this.setModalData({ title: 'create something new', components: ['CreateList', 'MintList'] })
      this.setShowGeneralModal(true)
    },
    handleShowMenu() {
      this.showMenu = !this.showMenu
    }
  },
};
</script>
