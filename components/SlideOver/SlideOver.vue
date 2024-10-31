<template>
  <div class="fixed w-screen h-screen backdrop-grayscale bg-[#1219261A] backdrop-blur-sm z-20 pt-16"
    @click="handleBackdropClick">
    <div class="appear z-50 rounded-t-3xl flex h-full flex-col bg-white" @click.stop>
      <!-- <div class="bg-red-400">a</div>
      <div class="bg-blue-400 flex-1 overflow-auto text-display-sm">aslfkjasldkfjalsdfkjaslkdjfasdfasdfasdfasd adsfas
        aslfkjasldkfjalsdfkjaslkdjfasdfasdfasdfasd adsfasaslfkjasldkfjalsdfkjaslkdjfasdfasdfasdfasd
        adsfasaslfkjasldkfjalsdfkjaslkdjfasdfasdfasdfasd adsfasaslfkjasldkfjalsdfkjaslkdjfasdfasdfasdfasd
        adsfasaslfkjasldkfjalsdfkjaslkdjfasdfasdfasdfasd adsfas aslfkjasldkfjalsdfkjaslkdjfasdfasdfasdfasd adsfas
        aslfkjasldkfjalsdfkjaslkdjfasdfasdfasdfasd adsfas aslfkjasldkfjalsdfkjaslkdjfasdfasdfasdfasd adsfas</div>
      <div class="bg-green-400">c</div> -->
      <div class="z-60 flex">
        <Icon @click="handleClose" icon="x-close"
          class="ml-auto mt-3 mr-4 mb-2 rounded-full border border-gray-900 p-1.5 cursor-pointer hover:bg-black hover:text-white" />
      </div>
      <div class="flex-1 overflow-auto px-4 pt-1">
        <slot name="body">
        </slot>
      </div>
      <div class="p-4 bg-white/95">
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