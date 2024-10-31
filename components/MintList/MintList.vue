<template>
  <h4 class="font-display font-semibold uppercase text-display-sm text-gray-600">Mint</h4>
  <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-md w-full">
    <li @click="handleCreate('721')"
      class="flex rounded-lg cursor-pointer border border-gray-900 ham-shadow p-4 gap-x-4">
      <Icon icon="layer-single" class="rounded-full p-2.5 border border-gray-900" />
      <div class="flex flex-col items-start">
        <p class="font-semibold">1 OF 1</p>
        <p class="text-gray-500">ERC-721</p>
      </div>
    </li>
    <!-- <li class="flex rounded-lg cursor-pointer border border-gray-900 bg-gray-300 p-4 gap-x-4">
      <Icon icon="layers-three-01" class="rounded-full p-2.5 border border-gray-900" />
      <div class="flex flex-col items-start">
        <p class="font-semibold">Edition</p>
        <p class="text-gray-500">ERC-1155</p>
      </div>
    </li> -->
    <li @click="handleCreate('721-edition')"
      class="flex rounded-lg cursor-pointer border border-gray-900 ham-shadow p-4 gap-x-4">
      <Icon icon="layers-two-01" class="rounded-full p-2.5 border border-gray-900" />
      <div class="flex flex-col items-start">
        <p class="font-semibold">Series</p>
        <p class="text-gray-500">ERC 721 Edition</p>
      </div>
    </li>
    <li class="flex rounded-lg cursor-not-allowed border border-gray-900 bg-gray-300 p-4 gap-x-4">
      <Icon icon="farcast" class="rounded-full p-2.5 border border-gray-900" />
      <div class="flex flex-col items-start">
        <p class="font-semibold">Farcaster Mint</p>
        <p class="text-gray-500">Farcaster Open edition</p>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['setShowGeneralModal', 'setModalData', 'setShowSlideOver', 'setSlideOverData']),
    handleCreate(type) {
      let route
      switch (type) {
        case '721':
          route = '/new-contract/erc-721'
          break;
        case '721-edition':
          route = '/new-contract/erc-721-edition'
          break;
        default:
          break;
      }
      document.body.classList.remove('body-overflow-hidden')
      this.setShowGeneralModal(false)
      this.setModalData(null)
      this.setShowSlideOver(false)
      this.setSlideOverData(null)
      this.$router.push(route)
    }
  },
}
</script>
