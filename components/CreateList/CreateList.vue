<template>
  <h4 class="font-display font-semibold uppercase text-display-sm text-gray-600">Create</h4>
  <ul class="grid grid-cols-1 gap-4 text-md w-full">
    <li @click="handleCreate('claim')"
      class="flex rounded-lg cursor-pointer border border-gray-900 ham-shadow p-4 gap-x-4">
      <Icon icon="layers-three-01" class="rounded-full p-2.5 border border-gray-900" />
      <div class="flex flex-col items-start">
        <p class="font-semibold">Claim page</p>
        <p class="text-gray-500">Create a page for collectors to mint tokens from your contract</p>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['setModalData', 'setShowGeneralModal']),
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
      this.$router.push(route)
    }
  },
}
</script>
