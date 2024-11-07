<template>
  <h4 class="font-display font-semibold uppercase text-display-sm text-gray-600">Pages</h4>
  <ul class="grid grid-cols-2 gap-4 text-md w-full">
    <li @click="handleCreate('claim')"
      class="flex items-center rounded-lg cursor-pointer border border-gray-900 ham-shadow p-4 gap-x-4">
      <Icon icon="layout-top" class="rounded-full p-2.5 border border-gray-900" />
      <div class="flex flex-col items-start">
        <p class="font-semibold">Claim page</p>
        <p class="text-gray-500 text-left">Create a page to allow minting of your <span class="font-bold">ERC 721
            Edition</span> tokens.</p>
      </div>
    </li>
    <li class="flex items-center rounded-lg cursor-not-allowed border border-gray-900 bg-gray-300 p-4 gap-x-4">
      <Icon icon="layout-grid-01" class="rounded-full p-2.5 border border-gray-900" />
      <div class="flex flex-col items-start">
        <p class="font-semibold">Collection page</p>
        <p class="text-gray-500 text-left">Create a page for collectors to mint tokens from your collection.</p>
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
        case 'claim':
          route = '/claim-page/erc-721/select-contract'
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
