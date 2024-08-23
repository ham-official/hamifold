<template>
  <div class="flex justify-center items-center fixed w-screen h-screen backdrop-filter backdrop-blur-sm z-20"
    @click="handleBackdropClick">

    <div
      class="relative flex flex-col w-[760px] items-center gap-y-8 bg-white rounded-xl p-6 border border-gray-900 ham-shadow--active z-30 text-center"
      :class="{
      'w-80 sm:w-100': size === 'md',
      'w-100 sm:w-141.75': size === 'lg',
      'w-141.75 sm:[760px]': size === 'xl',
    }" @click.stop>

      <slot name="header"></slot>
      <slot name="body"></slot>
      <slot v-if="showDefaultButtons" name="footer">
        <div class="flex xs-only:flex-col items-center gap-4">
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    autoDismiss: {
      type: Boolean,
      default: false,
    },
    confirmCancel: {
      type: Boolean,
      default: false,
    },
    showDefaultButtons: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'md',
    },
    backdropClick: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (!document.body.classList.contains('body-overflow-hidden')) {
      document.body.classList.add('body-overflow-hidden')
    }
    if (this.autoDismiss) {
      let vm = this
      setTimeout(() => {
        document.body.classList.remove('body-overflow-hidden')
        vm.$emit('dismiss')
      }, 3000)
    }
  },
  methods: {
    handleCancel() {
      document.body.classList.remove('body-overflow-hidden')
      this.$emit('cancel')
    },
    handleConfirm() {
      document.body.classList.remove('body-overflow-hidden')
      this.$emit('confirm')
    },
    handleBackdropClick() {
      if (this.backdropClick === true) {
        this.handleCancel()
      }

    },
  },
}
</script>
