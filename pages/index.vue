<template>
  <main class="relative flex-1 flex flex-col items-center justify-center">
    <section class="container lg:max-w-5xl mx-auto px-3 xl:px-0">
      <AuthSignIn />
    </section>
  </main>
</template>
<script>
import { mapGetters } from 'vuex';
definePageMeta({
  layout: 'sign-in'
})
export default {
  computed: {
    ...mapGetters(['isConnected']),
  },

  watch: {
    isConnected(newValue) {
      if (newValue) {
        this.$router.push('/home')
      }
    }
  },
}

</script>