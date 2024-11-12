<template>
  <div class="my-0">
    <h4 class="font-display font-semibold uppercase text-display-sm text-gray-600 mb-4">Contracts</h4>
    <ul class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-md w-full">
      <li @click="handleCreate('721')"
        class="flex items-center rounded-lg cursor-pointer border border-gray-900 ham-shadow p-4 gap-x-4">
        <Icon icon="layer-single" class="rounded-full p-2.5 border border-success-500 text-success-500 bg-success-50" />
        <div class="flex flex-col items-start">
          <p class="font-semibold">1 OF 1</p>
          <p class="text-gray-500 text-left">Create a contract and mint 1 of 1 unique NFTs</p>
        </div>
      </li>
      <li @click="handleCreate('721-edition')"
        class="flex items-center rounded-lg cursor-pointer border border-gray-900 ham-shadow p-4 gap-x-4">
        <Icon icon="layers-three-01" class="rounded-full p-2.5 border border-indigo-500 text-indigo-500 bg-indigo-50" />
        <div class="flex flex-col items-start">
          <p class="font-semibold">Series</p>
          <p class="text-gray-500 text-left">Create multiple editions of the same ERC 721 Edition</p>
        </div>
      </li>
    </ul>
  </div>
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
