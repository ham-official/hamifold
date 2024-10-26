<template>
  <div class="fixed w-screen h-screen backdrop-filter backdrop-blur-sm z-20" @click="handleBackdropClick">
    <div
      class="appear absolute bottom-0 left-0 right-0 top-0 bg-white/95 z-50 rounded-t-3xl px-4 pt-4 pb-8 flex flex-col gap-y-4"
      @click.stop>
      <div class="flex">
        <slot name="header"></slot>
        <Icon @click="handleClose" icon="x-close"
          class="ml-auto rounded-full border border-gray-900 p-2.5 cursor-pointer hover:bg-black hover:text-white" />
      </div>
      <div class="flex-1 overflow-auto">
        <slot name="body">
        </slot>
      </div>
      <div class="fixed bottom-0 left-0 right-0 px-4 py-2">
        <slot name="footer">
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    if (!document.body.classList.contains('body-overflow-hidden')) {
      document.body.classList.add('body-overflow-hidden')
    }
  },
  methods: {
    handleClose() {
      document.body.classList.remove('body-overflow-hidden')
      this.$emit('close')
    },
    handleBackdropClick() {
      if (this.backdropClick === true) {
        this.handleClose()
      }
    },
  },
}
</script>
<style lang="css">
@keyframes smooth-appear {
  to {
    top: 0%;
    opacity: 1;
  }
}

.appear {
  top: 100%;
  animation: smooth-appear 0.2s ease both;
}
</style>