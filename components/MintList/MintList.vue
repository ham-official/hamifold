<template>
  <h4 class="font-display font-semibold uppercase text-display-sm text-gray-600">Mint</h4>
  <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-md w-full">
    <li @click="handleCreate('721')"
      class="flex items-center rounded-lg cursor-pointer border border-gray-900 ham-shadow p-4 gap-x-4">
      <Icon icon="grid-02" class="rounded-full p-2.5 border border-success-500 text-success-500 bg-success-50" />
      <div class="flex flex-col items-start">
        <p class="font-semibold">1 OF 1</p>
        <p class="text-gray-500">Mint your own ERC 721 token</p>
      </div>
    </li>
    <li class="flex items-center rounded-lg cursor-not-allowed border border-gray-900 bg-gray-300 p-4 gap-x-4">
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
          route = '/mint-erc-721/select-contract'
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
