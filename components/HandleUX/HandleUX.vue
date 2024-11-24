<template>
  <div v-if="show" class="absolute top-0 left-0 z-50">
    <Modal v-if="showGeneralModal" :show-default-buttons="true" :show-custom-buttons="true" :confirmCancel="false"
      size="xl" class="min-h-[419px]">
      <template #header class="relative">
        <p v-if="modalData && modalData.title"
          class="font-display font-semibold uppercase text-display-xs sm:text-display-sm">{{
            modalData.title }}</p>
        <Icon @click="closeGeneralModal" icon="x-close"
          class="absolute top-4 right-4 rounded-full border border-gray-900 p-2.5 cursor-pointer hover:bg-black hover:text-white" />
      </template>
      <template #body>
        <template v-if="modalData">
          <CreatePagesList v-if="modalData.components.includes('CreatePagesList')" />
          <MintList v-if="modalData.components.includes('MintList')" />
          <CreateContractsList v-if="modalData.components.includes('CreateContractsList')" />
          <PublishProgress v-if="modalData.components.includes('PublishProgress')" v-bind="modalData.data"
            class="flex items-center w-full" />
          <Token v-if="modalData.components.includes('Token')" v-bind="modalData.data" class="my-8" />
        </template>
      </template>
      <template #footer>
        <ul v-if="modalData && modalData.ctas">
          <li v-for="cta, i in modalData.ctas" :key="`modal-cta-${i}`" class="flex justify-center items-center w-full">
            <CTA :color="cta.color" :disabled="cta.disabled" size="md" @click="cta.handleClick">{{ cta.label }}</CTA>
          </li>
        </ul>
      </template>
      <template #footer-custom-buttons>
        <div v-if="modalData && modalData.title === 'token'" class="flex justify-between">
          <CTA color="white" size="lg" iconLeft="arrow-left" @click="handlePrev">prev</CTA>
          <CTA color="white" size="lg" iconRight="arrow-left" iconRightClasses="rotate-180" @click="handleNext">next
          </CTA>
        </div>
      </template>
    </Modal>
    <SlideOver v-if="showSlideOver" @close="closeSlideOver">
      <template #body>
        <div v-if="slideOverData" class="flex flex-col gap-2">
          <CreatePagesList v-if="slideOverData.components.includes('CreatePagesList')" />
          <MintList v-if="slideOverData.components.includes('MintList')" />
          <CreateContractsList v-if="slideOverData.components.includes('CreateContractsList')" />
          <PublishProgress v-if="slideOverData.components.includes('PublishProgress')" v-bind="slideOverData.data" />
          <Token v-if="slideOverData.components.includes('Token')" v-bind="slideOverData.data" />
        </div>
      </template>
      <template #footer>
        <div v-if="slideOverData.components.includes('Token')" class="flex justify-between">
          <CTA class="px-6" color="white" size="lg" iconLeft="arrow-left" @click="handlePrev">prev</CTA>
          <CTA class="px-6" color="white" size="lg" iconRight="arrow-left" iconRightClasses="rotate-180"
            @click="handleNext">next
          </CTA>
        </div>
      </template>
    </SlideOver>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['modalData', 'showGeneralModal', 'slideOverData', 'showSlideOver', 'currentTokenIndex', 'totalTokens']),
    show() {
      return this.showGeneralModal || this.showSlideOver
    }
  },
  methods: {
    ...mapActions(['setShowGeneralModal', 'setShowSlideOver', 'setCurrentTokenIndex', 'setVisibleTokens']),
    closeGeneralModal() {
      this.setShowGeneralModal(false)
      document.body.classList.remove('body-overflow-hidden')
    },
    closeSlideOver() {
      this.setShowSlideOver(false)
      document.body.classList.remove('body-overflow-hidden')
    },
    handleNext() {
      this.setCurrentTokenIndex(this.currentTokenIndex + 1)
    },
    handlePrev() {
      this.setCurrentTokenIndex(this.currentTokenIndex - 1)
    }
  },
  beforeRouteLeave() {
    this.closeGeneralModal()
  }
}
</script>
