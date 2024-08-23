<template>
  <div class="absolute top-0 left-0 z-50">
    <Modal v-if="showGeneralModal" :show-default-buttons="true" :confirmCancel="false" size="xl" class="min-h-[419px]">
      <template #header class="relative">
        <p v-if="modalData && modalData.title" class="font-display font-semibold uppercase text-display-sm">{{
      modalData.title }}</p>
        <Icon @click="closeGeneralModal" icon="x-close"
          class="absolute top-4 right-4 rounded-full border border-gray-900 p-2.5 cursor-pointer hover:bg-black hover:text-white" />
      </template>
      <template #body>
        <template v-if="modalData">
          <CreateList v-if="modalData.components.includes('CreateList')" />
          <MintList v-if="modalData.components.includes('MintList')" />
          <PublishProgress v-if="modalData.components.includes('PublishProgress')" v-bind="modalData.data" />
        </template>
      </template>
      <template #footer>
        <ul v-if="modalData && modalData.ctas">
          <li v-for="cta, i in modalData.ctas" :key="`modal-cta-${i}`">
            <CTA :color="cta.color" :disabled="cta.disabled" size="md" @click="cta.handleClick">{{ cta.label }}</CTA>
          </li>
        </ul>
      </template>
    </Modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['modalData', 'showGeneralModal']),
  },
  methods: {
    ...mapActions(['setShowGeneralModal']),
    closeGeneralModal() {
      this.setShowGeneralModal(false)
      document.body.classList.remove('body-overflow-hidden')
    },
  },
  beforeRouteLeave() {
    this.closeGeneralModal()
  }
}
</script>
