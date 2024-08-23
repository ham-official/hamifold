<template>
  <header class="sticky top-0 z-50 pt-6 bg-gray-100/75">
    <div
      class="container mx-auto p-4 text-gray-800 flex justify-between items-center min-h-[77px] max-h-[77px] bg-white rounded-full border-2 border-gray-900">
      <nav>
        <NuxtLink v-if="!isConnected" to="/">
          <Icon icon="hamifold-logo" :no-size="true" classes="text-gray-900 w-64 h-12" />
        </NuxtLink>
        <NuxtLink v-else to="/home">
          <Icon icon="hamifold-logo" :no-size="true" classes="text-gray-900 w-64 h-12" />
        </NuxtLink>
      </nav>
      <div class="flex gap-2 lg:gap-4">
        <CTA v-if="isConnected" size="lg" :color="$route && $route.path === '/inventory' ? '' : 'gray'"
          class="uppercase font-semibold font-display">
          <NuxtLink to="/inventory">Assets</NuxtLink>
        </CTA>
        <CTA v-if="isConnected" size="lg" color="primary" iconLeft="plus" @click="handleShowCreateModal">Create</CTA>
        <DropdownMenu :closeCTA="{ icon: '', label: 'Connect wallet', color: 'primary' }"
          :openCTA="{ icon: 'user-03', label: truncate(wallet), color: 'white' }" />
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import Ethereum from "@/components/Ethereum.vue";
export default {
  extends: Ethereum,
  methods: {
    ...mapActions(['setShowGeneralModal', 'setModalData']),
    handleShowCreateModal() {
      this.setModalData({ title: 'create something new', components: ['CreateList', 'MintList'] })
      this.setShowGeneralModal(true)
    }
  },
};
</script>
